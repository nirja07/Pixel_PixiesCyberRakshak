// popup.js — renders analysis results in the PhishGuard popup

const CIRC = 2 * Math.PI * 37; // SVG circle r=37

// ─────────────────────────────────────────────
// INIT
// ─────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return showError("No active tab found.");

  loadResult(tab.id);

  // Rescan button
  document.getElementById("rescanBtn").addEventListener("click", async () => {
    showLoading();
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
      setTimeout(() => loadResult(tab.id), 2800);
    } catch {
      showError("Cannot scan this page (browser-restricted URL).");
    }
  });

  // Tab switching
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("active");
    });
  });
});

// ─────────────────────────────────────────────
// LOAD RESULT
// ─────────────────────────────────────────────
let retries = 0;
function loadResult(tabId) {
  showLoading();
  chrome.storage.local.get([`result_${tabId}`, "lastResult"], (data) => {
    const result = data[`result_${tabId}`] || data["lastResult"];
    if (!result && retries < 4) {
      retries++;
      setTimeout(() => loadResult(tabId), 1200);
      return;
    }
    retries = 0;
    if (!result) return showError("No scan data yet. Try refreshing the page.");
    renderResult(result);
  });
}

// ─────────────────────────────────────────────
// RENDER
// ─────────────────────────────────────────────
function renderResult(result) {
  document.getElementById("loading").style.display = "none";
  document.getElementById("result").style.display = "block";

  const { score, verdict, domain, pageInfo, checks, timestamp } = result;

  // Score ring
  const circle = document.getElementById("scoreCircle");
  circle.style.strokeDasharray = CIRC;
  circle.style.strokeDashoffset = CIRC - (score / 100) * CIRC;
  circle.style.stroke = scoreColor(score);
  animateNum("scoreNum", 0, score, 900);

  // Verdict
  const pill = document.getElementById("verdictPill");
  pill.className = "verdict-pill " + verdict.toLowerCase();
  document.getElementById("verdictIcon").textContent = verdict === "SAFE" ? "✓" : verdict === "SUSPICIOUS" ? "!" : "✗";
  document.getElementById("verdictText").textContent = verdict;
  document.getElementById("verdictDomain").textContent = domain;
  document.getElementById("verdictDesc").textContent = verdictDesc(verdict, score);

  // Info strip
  setCell("cellHTTPS", pageInfo.isHTTPS ? "✓" : "✗", pageInfo.isHTTPS ? "var(--safe)" : "var(--danger)");
  setCell("cellForms", pageInfo.hasLoginForm ? "Login" : pageInfo.hasCreditCardField ? "Card" : "None",
    (pageInfo.hasLoginForm || pageInfo.hasCreditCardField) ? "var(--warn)" : "var(--muted)");
  setCell("cellLinks", String(pageInfo.externalLinks || 0));
  setCell("cellIframes", String(pageInfo.iframes || 0),
    pageInfo.suspiciousIframes > 0 ? "var(--warn)" : "var(--text)");

  // API checks tab
  renderChecks(checks);

  // Flags tab
  renderFlags(checks, pageInfo);

  // Page info tab
  renderPageInfo(pageInfo);

  // Footer
  if (timestamp) {
    const d = new Date(timestamp);
    document.getElementById("footer").textContent = `Last scanned: ${d.toLocaleTimeString()}`;
  }
}

// ─────────────────────────────────────────────
// TAB: API CHECKS
// ─────────────────────────────────────────────
const CHECK_META = {
  heuristics:   { label: "Heuristic Analysis",      free: true  },
  ssl_domain:   { label: "SSL & Domain Structure",   free: true  },
  domain_age:   { label: "Domain Age (WHOIS)",       free: false },
  virustotal:   { label: "VirusTotal (70+ engines)", free: false },
  phishtank:    { label: "PhishTank Database",       free: false },
  urlhaus:      { label: "URLhaus Malware Feed",     free: true  },
  openphish:    { label: "OpenPhish Active Feed",    free: true  },
  ip_info:      { label: "IP & Hosting Info",        free: false },
};

function renderChecks(checks) {
  const list = document.getElementById("checksList");
  list.innerHTML = "";

  const order = ["urlhaus","openphish","phishtank","virustotal","heuristics","ssl_domain","domain_age","ip_info"];

  order.forEach((key) => {
    const check = checks?.find((c) => c.check === key);
    if (!check) return;
    const meta = CHECK_META[key] || { label: key, free: false };
    const { iconCls, detail } = formatCheck(key, check);

    const el = document.createElement("div");
    el.className = "check-item";
    el.innerHTML = `
      <div class="check-icon ${iconCls}">${iconSymbol(iconCls)}</div>
      <div style="flex:1">
        <div class="check-name">
          ${meta.label}
          <span class="check-tag ${meta.free ? 'tag-free' : 'tag-api'}">${meta.free ? 'FREE' : 'API KEY'}</span>
        </div>
        <div class="check-detail">${detail}</div>
      </div>`;
    list.appendChild(el);
  });
}

function formatCheck(key, c) {
  if (c.error)  return { iconCls: "ci-warn", detail: `Error: ${c.error}` };
  if (c.skipped) return { iconCls: "ci-skip", detail: c.message || "Not configured" };

  switch (key) {
    case "urlhaus":
      if (c.suspicious)
        return { iconCls: "ci-bad", detail: `⚠ Confirmed malware URL — threat: ${c.threat || "unknown"} · tags: ${c.tags?.join(", ") || "none"}` };
      return { iconCls: "ci-ok", detail: `Status: ${c.queryStatus || "not found in malware database"}` };

    case "openphish":
      if (c.suspicious)
        return { iconCls: "ci-bad", detail: "Found in OpenPhish active phishing feed!" };
      return { iconCls: "ci-ok", detail: c.message || `Not in phishing feed (${c.feedSize || 0} URLs checked)` };

    case "phishtank":
      if (c.suspicious)
        return { iconCls: "ci-bad", detail: `Verified phishing URL — PhishTank ID: ${c.phishId || "?"}` };
      if (c.inDatabase && !c.isPhishing)
        return { iconCls: "ci-ok", detail: "In database but NOT classified as phishing" };
      return { iconCls: "ci-ok", detail: "Not found in PhishTank phishing database" };

    case "virustotal": {
      if (c.status === "submitted")
        return { iconCls: "ci-info", detail: "URL submitted for analysis — rescan in ~1 minute" };
      const detail = `${c.malicious || 0} malicious · ${c.suspiciousEngines || 0} suspicious · ${c.harmless || 0} clean out of ${c.totalEngines || 0} engines`;
      return { iconCls: c.suspicious ? "ci-bad" : "ci-ok", detail };
    }

    case "heuristics": {
      const high = c.flags?.filter((f) => f.severity === "high").length || 0;
      const med  = c.flags?.filter((f) => f.severity === "medium").length || 0;
      const low  = c.flags?.filter((f) => f.severity === "low").length || 0;
      if (c.flagCount === 0) return { iconCls: "ci-ok", detail: "No suspicious patterns detected" };
      return {
        iconCls: high > 0 ? "ci-bad" : med > 0 ? "ci-warn" : "ci-ok",
        detail: `${c.flagCount} issue(s): ${high} high · ${med} medium · ${low} low — see Issues tab`,
      };
    }

    case "ssl_domain": {
      const issues = [];
      if (!c.isHTTPS) issues.push("No HTTPS");
      if (c.flags?.includes("punycode_domain")) issues.push("Punycode IDN homograph");
      if (c.flags?.includes("phishing_pattern_domain")) issues.push("Domain matches phishing pattern");
      return {
        iconCls: c.suspicious ? "ci-warn" : "ci-ok",
        detail: issues.length ? issues.join(" · ") : "HTTPS active, no structural anomalies",
      };
    }

    case "domain_age":
      if (!c.ageDays && c.ageDays !== 0)
        return { iconCls: "ci-skip", detail: c.message || "No data" };
      return {
        iconCls: c.suspicious ? (c.ageDays < 7 ? "ci-bad" : "ci-warn") : "ci-ok",
        detail: `${formatAge(c.ageDays)} old · Registrar: ${c.registrar || "?"} · Country: ${c.country || "?"}`,
      };

    case "ip_info":
      return {
        iconCls: c.suspicious ? "ci-warn" : "ci-ok",
        detail: `${c.ip || "?"} · ${c.city || "?"}, ${c.country || "?"} · ${c.org || "Unknown ASN"}`,
      };

    default:
      return { iconCls: "ci-skip", detail: "Unknown check" };
  }
}

// ─────────────────────────────────────────────
// TAB: FLAGS / ISSUES
// ─────────────────────────────────────────────
function renderFlags(checks, pageInfo) {
  const list = document.getElementById("flagsList");
  list.innerHTML = "";
  const heuristics = checks?.find((c) => c.check === "heuristics");
  const ssl = checks?.find((c) => c.check === "ssl_domain");

  let hasFlags = false;

  // Heuristic flags
  heuristics?.flags?.forEach((f) => {
    list.appendChild(buildFlagEl(f.message, f.severity));
    hasFlags = true;
  });

  // SSL flags
  if (ssl?.flags?.includes("punycode_domain")) {
    list.appendChild(buildFlagEl("Domain uses Punycode (IDN homograph attack risk)", "high"));
    hasFlags = true;
  }
  if (ssl?.flags?.includes("phishing_pattern_domain")) {
    list.appendChild(buildFlagEl("Domain matches a phishing URL structural pattern", "high"));
    hasFlags = true;
  }

  // Urgency keywords (from pageInfo)
  pageInfo?.urgencyKeywords?.forEach((kw) => {
    list.appendChild(buildFlagEl(`Urgency phrase found: "${kw}"`, "medium"));
    hasFlags = true;
  });

  if (!hasFlags) {
    list.innerHTML = `<div class="empty-msg">✓ No suspicious issues detected on this page</div>`;
  }
}

function buildFlagEl(message, severity) {
  const el = document.createElement("div");
  el.className = "flag-item";
  const dotCls = severity === "high" ? "dot-high" : severity === "medium" ? "dot-medium" : "dot-low";
  const sevCls = severity === "high" ? "sev-high" : severity === "medium" ? "sev-med" : "sev-low";
  el.innerHTML = `
    <div class="flag-dot ${dotCls}"></div>
    <div class="flag-text">${message}<span class="sev ${sevCls}">${severity.toUpperCase()}</span></div>`;
  return el;
}

// ─────────────────────────────────────────────
// TAB: PAGE INFO
// ─────────────────────────────────────────────
function renderPageInfo(pageInfo) {
  const list = document.getElementById("pageInfoList");
  const rows = [
    ["Page Title", pageInfo.title || "—"],
    ["HTTPS", pageInfo.isHTTPS ? "Yes ✓" : "No ✗"],
    ["Login Form", pageInfo.hasLoginForm ? "Yes" : "No"],
    ["Password Field", pageInfo.hasPasswordField ? "Yes" : "No"],
    ["Credit Card Field", pageInfo.hasCreditCardField ? "Yes" : "No"],
    ["External Links", String(pageInfo.externalLinks || 0)],
    ["Suspicious Short Links", String(pageInfo.suspiciousLinks || 0)],
    ["iFrames Total", String(pageInfo.iframes || 0)],
    ["Cross-Origin iFrames", String(pageInfo.suspiciousIframes || 0)],
    ["Hidden Elements", String(pageInfo.hiddenElements || 0)],
    ["Brands Mentioned", pageInfo.mentionedBrands?.join(", ") || "None"],
    ["Domain Impersonation", pageInfo.domainContainsBrand?.join(", ") || "None"],
  ];

  list.innerHTML = rows.map(([label, value]) => `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--border);gap:10px;">
      <span style="color:var(--muted);font-size:11px;flex-shrink:0">${label}</span>
      <span style="font-size:11px;text-align:right;word-break:break-word;max-width:220px">${value}</span>
    </div>`
  ).join("");
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function scoreColor(s) {
  return s >= 60 ? "#ef4444" : s >= 30 ? "#f97316" : "#22c55e";
}

function iconSymbol(cls) {
  return { "ci-ok": "✓", "ci-bad": "✗", "ci-warn": "!", "ci-info": "i", "ci-skip": "–" }[cls] || "?";
}

function verdictDesc(verdict, score) {
  if (verdict === "SAFE")
    return `Score ${score}/100. No significant threats. Exercise normal caution.`;
  if (verdict === "SUSPICIOUS")
    return `Score ${score}/100. Suspicious signals found. Do not enter sensitive info.`;
  return `Score ${score}/100. Multiple high-risk indicators. Do NOT enter credentials or payment info.`;
}

function formatAge(days) {
  if (days < 1) return "< 1 day";
  if (days < 30) return `${days} days`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
}

function setCell(id, text, color) {
  const el = document.getElementById(id);
  el.textContent = text;
  if (color) el.style.color = color;
}

function animateNum(id, from, to, ms) {
  const el = document.getElementById(id);
  const start = performance.now();
  function frame(now) {
    const t = Math.min((now - start) / ms, 1);
    el.textContent = Math.round(from + (to - from) * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

function showLoading() {
  document.getElementById("loading").style.display = "flex";
  document.getElementById("result").style.display = "none";
}

function showError(msg) {
  document.getElementById("loading").innerHTML =
    `<div style="color:#ef4444;padding:20px;text-align:center;font-size:12px">${msg}</div>`;
}
