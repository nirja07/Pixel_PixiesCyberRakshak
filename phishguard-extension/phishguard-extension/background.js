// background.js - Service Worker
// Checks: Heuristics, SSL/Domain, WHOIS Age, VirusTotal,
//         PhishTank, URLhaus, OpenPhish, IPInfo
// Google Safe Browsing NOT used — replaced with free alternatives

// ─────────────────────────────────────────────
// CONFIG — fill in keys you have, leave others
// ─────────────────────────────────────────────
const CONFIG = {
  // VirusTotal — free at virustotal.com (4 req/min)
  VIRUSTOTAL_API_KEY: "4083891026db437212d9a09b622cd4951b233d30e14f382a7ff086a07874fc86",
  USE_VIRUSTOTAL: true,

  // PhishTank — free at phishtank.org/api_info.php (no credit card)
  PHISHTANK_API_KEY: "YOUR_PHISHTANK_API_KEY",
  USE_PHISHTANK: false,

  // URLhaus — NO KEY NEEDED, enabled by default
  USE_URLHAUS: true,

  // OpenPhish — NO KEY NEEDED, enabled by default
  USE_OPENPHISH: true,

  // WHOIS XML API — free at whoisxmlapi.com (500 req/month)
  WHOIS_API_KEY: "YOUR_WHOISXMLAPI_KEY",
  USE_WHOIS: false,

  // IPInfo — free at ipinfo.io (50k req/month)
  IPINFO_TOKEN: "YOUR_IPINFO_TOKEN",
  USE_IPINFO: false,
};

// ─────────────────────────────────────────────
// OPENPHISH FEED CACHE (no key needed)
// ─────────────────────────────────────────────
let openPhishFeed = new Set();
let openPhishLastLoaded = 0;

async function refreshOpenPhishFeed() {
  try {
    if (Date.now() - openPhishLastLoaded < 3600000) return; // refresh max once/hour
    const res = await fetch("https://openphish.com/feed.txt");
    if (!res.ok) return;
    const text = await res.text();
    openPhishFeed = new Set(text.split("\n").map((u) => u.trim()).filter(Boolean));
    openPhishLastLoaded = Date.now();
    console.log(`[PhishGuard] OpenPhish feed: ${openPhishFeed.size} URLs loaded`);
  } catch (e) {
    console.warn("[PhishGuard] OpenPhish feed failed:", e.message);
  }
}

refreshOpenPhishFeed();
setInterval(refreshOpenPhishFeed, 3600000);

// ─────────────────────────────────────────────
// MESSAGE LISTENER
// ─────────────────────────────────────────────
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_DATA") {
    analyzeSite(message.data, sender.tab?.id);
  }

  if (message.type === "GET_RESULT") {
    chrome.storage.local.get(["lastResult"], (d) => sendResponse(d.lastResult || null));
    return true;
  }

  if (message.type === "GET_RESULT_FOR_TAB") {
    chrome.storage.local.get([`result_${message.tabId}`], (d) =>
      sendResponse(d[`result_${message.tabId}`] || null)
    );
    return true;
  }
});

// ─────────────────────────────────────────────
// MAIN ORCHESTRATOR
// ─────────────────────────────────────────────
async function analyzeSite(data, tabId) {
  if (tabId) setBadge(tabId, "...", "#666");

  const settled = await Promise.allSettled([
    runHeuristicChecks(data),      // 0 - always runs, no API
    checkSSLAndDomain(data),       // 1 - always runs, no API
    checkDomainAge(data.domain),   // 2 - WHOIS API optional
    checkVirusTotal(data.url),     // 3 - VT API optional
    checkPhishTank(data.url),      // 4 - PhishTank API optional
    checkURLhaus(data.url),        // 5 - no key needed
    checkOpenPhish(data.url),      // 6 - no key needed
    checkIPInfo(data.domain),      // 7 - IPInfo optional
  ]);

  const results = settled.map((c) =>
    c.status === "fulfilled"
      ? c.value
      : { check: "error", error: c.reason?.message, suspicious: false }
  );

  const score = calculateRiskScore(results, data);
  const verdict = getVerdict(score);

  const finalResult = {
    url: data.url,
    domain: data.domain,
    score,
    verdict,
    checks: results,
    pageInfo: {
      title: data.pageTitle,
      isHTTPS: data.isHTTPS,
      hasLoginForm: data.hasLoginForm,
      hasPasswordField: data.hasPasswordField,
      hasCreditCardField: data.hasCreditCardField,
      externalLinks: data.externalLinks,
      suspiciousLinks: data.suspiciousLinks,
      iframes: data.iframes,
      suspiciousIframes: data.suspiciousIframes,
      hiddenElements: data.hiddenElements,
      urgencyKeywords: data.foundUrgencyKeywords,
      mentionedBrands: data.mentionedBrands,
      domainContainsBrand: data.domainContainsBrand,
    },
    timestamp: Date.now(),
  };

  chrome.storage.local.set({ lastResult: finalResult });
  if (tabId) {
    chrome.storage.local.set({ [`result_${tabId}`]: finalResult });
    const color = verdict === "SAFE" ? "#22c55e" : verdict === "SUSPICIOUS" ? "#f97316" : "#ef4444";
    const label = verdict === "SAFE" ? "✓" : verdict === "SUSPICIOUS" ? "!" : "✗";
    setBadge(tabId, label, color);
  }
}

// ─────────────────────────────────────────────
// CHECK 1: HEURISTICS — no API, always runs
// ─────────────────────────────────────────────
async function runHeuristicChecks(data) {
  const flags = [];
  const domain = data.domain;

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(domain))
    flags.push({ flag: "ip_as_domain", severity: "high", message: "Domain is a raw IP address — not used by legitimate sites" });

  if (!data.isHTTPS)
    flags.push({ flag: "no_https", severity: "medium", message: "Site does not use HTTPS encryption" });

  if (!data.isHTTPS && (data.hasLoginForm || data.hasCreditCardField))
    flags.push({ flag: "insecure_form", severity: "high", message: "Login/payment form present on unencrypted HTTP page" });

  const suspiciousTLDs = [".xyz",".top",".click",".gq",".tk",".ml",".ga",".cf",".pw",".su",".cc",".biz"];
  const tld = domain.slice(domain.lastIndexOf("."));
  if (suspiciousTLDs.includes(tld))
    flags.push({ flag: "suspicious_tld", severity: "medium", message: `TLD "${tld}" is heavily abused in phishing campaigns` });

  const hyphens = (domain.match(/-/g) || []).length;
  if (hyphens >= 3)
    flags.push({ flag: "many_hyphens", severity: "low", message: `Domain contains ${hyphens} hyphens — common in spoofed domains` });

  if (domain.split(".").length > 4)
    flags.push({ flag: "deep_subdomain", severity: "medium", message: "Deeply nested subdomains used to disguise the real domain" });

  data.domainContainsBrand?.forEach((brand) =>
    flags.push({ flag: `lookalike_${brand}`, severity: "high", message: `Domain impersonates "${brand}" but is NOT the official site` })
  );

  if (data.foundUrgencyKeywords?.length > 0)
    flags.push({ flag: "urgency_language", severity: "medium", message: `${data.foundUrgencyKeywords.length} urgency/scare phrase(s) found`, detail: data.foundUrgencyKeywords });

  if (data.hiddenElements > 20)
    flags.push({ flag: "hidden_elements", severity: "low", message: `${data.hiddenElements} hidden DOM elements detected (possible cloaking)` });

  if (data.suspiciousLinks > 0)
    flags.push({ flag: "url_shorteners", severity: "low", message: `${data.suspiciousLinks} URL shortener link(s) on page` });

  if (data.suspiciousIframes > 0)
    flags.push({ flag: "cross_origin_iframes", severity: "medium", message: `${data.suspiciousIframes} cross-origin iframe(s) detected` });

  if (domain.length > 40)
    flags.push({ flag: "long_domain", severity: "low", message: `Unusually long domain name (${domain.length} chars)` });

  if (/[a-z][0-9]+[a-z]/i.test(domain.split(".")[0]))
    flags.push({ flag: "leet_speak", severity: "high", message: "Domain uses numbers substituting letters (e.g. g00gle, paypa1)" });

  if (data.hasCreditCardField)
    flags.push({ flag: "credit_card_field", severity: "medium", message: "Page contains a credit card input field" });

  return {
    check: "heuristics",
    flags,
    flagCount: flags.length,
    suspicious: flags.some((f) => f.severity === "high" || f.severity === "medium"),
  };
}

// ─────────────────────────────────────────────
// CHECK 2: SSL & DOMAIN STRUCTURE — no API
// ─────────────────────────────────────────────
async function checkSSLAndDomain(data) {
  const domain = data.domain;
  const flags = [];

  if (domain.includes("xn--"))
    flags.push("punycode_domain"); // IDN homograph attack

  const phishPatterns = [
    /secure[-_.]?\w+\.(com|net|org)/i,
    /\w+[-_.]?login\.(com|net|org)/i,
    /\w+[-_.]?account\.(com|net|org)/i,
    /\w+[-_.]?verify\.(com|net|org)/i,
    /\w+[-_.]?update\.(com|net|org)/i,
    /\w+[-_.]?support\.(com|net|org)/i,
    /\w+[-_.]?billing\.(com|net|org)/i,
    /\w+[-_.]?confirm\.(com|net|org)/i,
  ];
  if (phishPatterns.some((p) => p.test(domain)))
    flags.push("phishing_pattern_domain");

  return {
    check: "ssl_domain",
    isHTTPS: data.isHTTPS,
    domain,
    flags,
    suspicious: flags.length > 0 || !data.isHTTPS,
  };
}

// ─────────────────────────────────────────────
// CHECK 3: DOMAIN AGE via WHOIS XML API
// Get free key at whoisxmlapi.com
// ─────────────────────────────────────────────
async function checkDomainAge(domain) {
  if (!CONFIG.USE_WHOIS)
    return { check: "domain_age", skipped: true, message: "Get free key at whoisxmlapi.com", suspicious: false };

  try {
    const res = await fetch(
      `https://www.whoisxmlapi.com/whoisserver/WhoisService?apiKey=${CONFIG.WHOIS_API_KEY}&domainName=${domain}&outputFormat=JSON`
    );
    const json = await res.json();
    const record = json?.WhoisRecord;
    const createdRaw = record?.createdDate || record?.registryData?.createdDate;

    if (!createdRaw)
      return { check: "domain_age", suspicious: false, message: "No creation date in WHOIS record" };

    const ageDays = Math.floor((Date.now() - new Date(createdRaw).getTime()) / 86400000);
    return {
      check: "domain_age",
      createdDate: createdRaw,
      ageDays,
      registrar: record?.registrarName || "Unknown",
      country: record?.registrant?.country || record?.registryData?.registrant?.country || "Unknown",
      expiresDate: record?.expiresDate || null,
      suspicious: ageDays < 30,
      warning: ageDays < 7 ? "Registered in last 7 days!" : ageDays < 30 ? "Registered < 30 days ago" : null,
    };
  } catch (e) {
    return { check: "domain_age", error: e.message, suspicious: false };
  }
}

// ─────────────────────────────────────────────
// CHECK 4: VIRUSTOTAL
// Get free key at virustotal.com
// ─────────────────────────────────────────────
async function checkVirusTotal(url) {
  if (!CONFIG.USE_VIRUSTOTAL)
    return { check: "virustotal", skipped: true, message: "Get free key at virustotal.com", suspicious: false };

  try {
    const urlId = btoa(url).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
    const res = await fetch(`https://www.virustotal.com/api/v3/urls/${urlId}`, {
      headers: { "x-apikey": CONFIG.VIRUSTOTAL_API_KEY },
    });

    if (res.status === 404) {
      await fetch("https://www.virustotal.com/api/v3/urls", {
        method: "POST",
        headers: { "x-apikey": CONFIG.VIRUSTOTAL_API_KEY, "Content-Type": "application/x-www-form-urlencoded" },
        body: `url=${encodeURIComponent(url)}`,
      });
      return { check: "virustotal", status: "submitted", suspicious: false, message: "Submitted for analysis — rescan shortly" };
    }

    const data = await res.json();
    const stats = data?.data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;

    return {
      check: "virustotal",
      malicious,
      suspiciousEngines: suspicious,
      harmless: stats.harmless || 0,
      undetected: stats.undetected || 0,
      totalEngines: (stats.malicious || 0) + (stats.suspicious || 0) + (stats.harmless || 0) + (stats.undetected || 0),
      reputation: data?.data?.attributes?.reputation || 0,
      suspicious: malicious > 0 || suspicious > 2,
    };
  } catch (e) {
    return { check: "virustotal", error: e.message, suspicious: false };
  }
}

// ─────────────────────────────────────────────
// CHECK 5: PHISHTANK
// Free key at phishtank.org/api_info.php
// Community-verified phishing database
// ─────────────────────────────────────────────
async function checkPhishTank(url) {
  if (!CONFIG.USE_PHISHTANK)
    return { check: "phishtank", skipped: true, message: "Get free key at phishtank.org", suspicious: false };

  try {
    const body = new URLSearchParams({
      url: btoa(url),
      format: "json",
      app_key: CONFIG.PHISHTANK_API_KEY,
    });

    const res = await fetch("https://checkurl.phishtank.com/checkurl/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    const data = await res.json();
    const r = data?.results;

    return {
      check: "phishtank",
      inDatabase: r?.in_database || false,
      isPhishing: r?.valid || false,
      verified: r?.verified || false,
      phishId: r?.phish_id || null,
      suspicious: (r?.in_database && r?.valid) || false,
    };
  } catch (e) {
    return { check: "phishtank", error: e.message, suspicious: false };
  }
}

// ─────────────────────────────────────────────
// CHECK 6: URLHAUS by abuse.ch
// NO API KEY NEEDED — works right away
// Tracks active malware-distributing URLs
// ─────────────────────────────────────────────
async function checkURLhaus(url) {
  if (!CONFIG.USE_URLHAUS)
    return { check: "urlhaus", skipped: true, suspicious: false };

  try {
    const res = await fetch("https://urlhaus-api.abuse.ch/v1/url/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `url=${encodeURIComponent(url)}`,
    });

    const data = await res.json();
    const isMalware = data.query_status === "is_malware";

    return {
      check: "urlhaus",
      queryStatus: data.query_status,
      suspicious: isMalware,
      threat: data.threat || null,
      tags: data.tags || [],
      dateAdded: data.date_added || null,
      urlStatus: data.url_status || null,
    };
  } catch (e) {
    return { check: "urlhaus", error: e.message, suspicious: false };
  }
}

// ─────────────────────────────────────────────
// CHECK 7: OPENPHISH
// NO API KEY NEEDED — uses hourly cached feed
// Active phishing URLs reported by community
// ─────────────────────────────────────────────
async function checkOpenPhish(url) {
  if (!CONFIG.USE_OPENPHISH)
    return { check: "openphish", skipped: true, suspicious: false };

  await refreshOpenPhishFeed();

  const base = url.split("?")[0].split("#")[0];
  const found = openPhishFeed.has(url) || openPhishFeed.has(base);

  return {
    check: "openphish",
    suspicious: found,
    feedSize: openPhishFeed.size,
    feedLoaded: openPhishLastLoaded > 0,
    message: found
      ? "⚠ URL found in OpenPhish active phishing feed!"
      : openPhishFeed.size > 0
      ? `Checked against ${openPhishFeed.size} known phishing URLs — not found`
      : "Feed not yet loaded",
  };
}

// ─────────────────────────────────────────────
// CHECK 8: IPINFO — hosting & geolocation
// Free at ipinfo.io (50k req/month)
// ─────────────────────────────────────────────
async function checkIPInfo(domain) {
  if (!CONFIG.USE_IPINFO)
    return { check: "ip_info", skipped: true, message: "Get free token at ipinfo.io", suspicious: false };

  try {
    const res = await fetch(`https://ipinfo.io/${domain}/json?token=${CONFIG.IPINFO_TOKEN}`);
    const data = await res.json();

    const riskyASNs = ["AS9009","AS60068","AS206728","AS49453","AS59711","AS35624","AS24961"];
    const isRiskyASN = riskyASNs.includes(data.org?.split(" ")[0]);

    return {
      check: "ip_info",
      ip: data.ip,
      country: data.country,
      region: data.region,
      city: data.city,
      org: data.org,
      hostname: data.hostname,
      isRiskyASN,
      suspicious: isRiskyASN,
    };
  } catch (e) {
    return { check: "ip_info", error: e.message, suspicious: false };
  }
}

// ─────────────────────────────────────────────
// RISK SCORING ENGINE
// ─────────────────────────────────────────────
function calculateRiskScore(results, data) {
  let score = 0;

  for (const r of results) {
    if (!r || r.error || r.skipped) continue;
    switch (r.check) {
      case "heuristics":
        r.flags?.forEach((f) => {
          score += f.severity === "high" ? 25 : f.severity === "medium" ? 12 : 5;
        });
        break;
      case "ssl_domain":
        if (!r.isHTTPS) score += 15;
        if (r.flags?.includes("punycode_domain")) score += 30;
        if (r.flags?.includes("phishing_pattern_domain")) score += 20;
        break;
      case "domain_age":
        if (r.ageDays !== undefined) {
          if (r.ageDays < 7) score += 30;
          else if (r.ageDays < 30) score += 20;
          else if (r.ageDays < 90) score += 5;
        }
        break;
      case "virustotal":
        if (r.malicious > 0) score += Math.min(r.malicious * 15, 60);
        if (r.suspiciousEngines > 2) score += 10;
        break;
      case "phishtank":
        if (r.suspicious) score += 65;
        break;
      case "urlhaus":
        if (r.suspicious) score += 60;
        break;
      case "openphish":
        if (r.suspicious) score += 60;
        break;
      case "ip_info":
        if (r.isRiskyASN) score += 20;
        break;
    }
  }

  // Amplifier: sensitive form on already suspicious domain
  if ((data.hasLoginForm || data.hasCreditCardField) && score > 20) score += 20;

  return Math.min(score, 100);
}

function getVerdict(score) {
  if (score >= 60) return "DANGEROUS";
  if (score >= 30) return "SUSPICIOUS";
  return "SAFE";
}

// ─────────────────────────────────────────────
// BADGE
// ─────────────────────────────────────────────
function setBadge(tabId, text, color) {
  chrome.action.setBadgeText({ tabId, text });
  chrome.action.setBadgeBackgroundColor({ tabId, color });
}

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId === 0) setBadge(details.tabId, "…", "#888");
});
