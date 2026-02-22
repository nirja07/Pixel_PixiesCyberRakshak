// content.js — runs on every page the user visits
// Scrapes page signals and sends to background.js for analysis

(function () {
  if (window.__phishguardInjected) return;
  window.__phishguardInjected = true;

  function scrapePageData() {
    const url = window.location.href;
    const domain = window.location.hostname;
    const protocol = window.location.protocol;

    // ── Forms ──
    const forms = [...document.querySelectorAll("form")];
    const hasPasswordField = !!document.querySelector('input[type="password"]');
    const hasLoginForm = forms.some(
      (f) =>
        f.querySelector('input[type="password"]') ||
        /login|signin|sign-in|account|auth/i.test(f.action + f.innerHTML)
    );
    const hasCreditCardField = [...document.querySelectorAll("input")].some((i) =>
      /card|credit|cvv|cvc|ccnum|cc-?number/i.test(i.name + i.id + i.placeholder)
    );

    // ── Links ──
    const allLinks = [...document.querySelectorAll("a[href]")].map((a) => a.href);
    const externalLinks = allLinks.filter(
      (h) => h.startsWith("http") && !h.includes(domain)
    );
    const suspiciousLinks = allLinks.filter((h) =>
      /bit\.ly|tinyurl|goo\.gl|t\.co|ow\.ly|is\.gd|buff\.ly|rb\.gy/i.test(h)
    );

    // ── Scripts ──
    const externalScripts = [...document.querySelectorAll("script[src]")]
      .map((s) => s.src)
      .filter((s) => s && !s.includes(domain));

    // ── iFrames ──
    const iframes = [...document.querySelectorAll("iframe")];
    const suspiciousIframes = iframes.filter((f) => f.src && !f.src.includes(domain));

    // ── Hidden elements ──
    const hiddenElements = document.querySelectorAll(
      '[style*="display:none"],[style*="display: none"],[hidden],[style*="visibility:hidden"]'
    ).length;

    // ── Page metadata ──
    const pageTitle = document.title;
    const htmlLang = document.documentElement.lang || "unknown";
    const metaDescription = document.querySelector('meta[name="description"]')?.content || "";

    // ── Body text analysis ──
    const bodyText = document.body?.innerText?.toLowerCase() || "";

    const urgencyKeywords = [
      "verify your account",
      "confirm your identity",
      "account will be suspended",
      "click here immediately",
      "limited time offer",
      "act now",
      "you have been selected",
      "congratulations you won",
      "update your payment",
      "unusual activity detected",
      "unauthorized access",
      "your account has been compromised",
      "immediate action required",
      "your password has expired",
    ];
    const foundUrgencyKeywords = urgencyKeywords.filter((kw) => bodyText.includes(kw));

    // ── Brand impersonation detection ──
    const brands = [
      "paypal","google","amazon","apple","microsoft","facebook",
      "instagram","netflix","bank of america","chase","wells fargo",
      "citibank","irs","fedex","ups","dhl","ebay","twitter","linkedin",
    ];
    const mentionedBrands = brands.filter(
      (b) => bodyText.includes(b) || pageTitle.toLowerCase().includes(b)
    );
    const domainContainsBrand = brands.filter(
      (b) => domain.toLowerCase().includes(b) && !domain.toLowerCase().endsWith(`${b}.com`)
    );

    return {
      url,
      domain,
      protocol,
      isHTTPS: protocol === "https:",
      pageTitle,
      htmlLang,
      metaDescription,
      hasLoginForm,
      hasPasswordField,
      hasCreditCardField,
      forms: forms.length,
      externalLinks: externalLinks.length,
      externalLinksUrls: externalLinks.slice(0, 10),
      suspiciousLinks: suspiciousLinks.length,
      suspiciousLinksUrls: suspiciousLinks.slice(0, 5),
      externalScripts: externalScripts.length,
      hiddenElements,
      iframes: iframes.length,
      suspiciousIframes: suspiciousIframes.length,
      foundUrgencyKeywords,
      mentionedBrands,
      domainContainsBrand,
      hasBeforeUnload: !!window.onbeforeunload,
      timestamp: Date.now(),
    };
  }

  // Wait for page to fully render
  setTimeout(() => {
    try {
      chrome.runtime.sendMessage({ type: "PAGE_DATA", data: scrapePageData() });
    } catch (e) {
      console.warn("[PhishGuard] Could not send page data:", e);
    }
  }, 1500);

  // Listen for popup requesting fresh data
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "GET_PAGE_DATA") {
      try {
        sendResponse({ data: scrapePageData() });
      } catch (e) {
        sendResponse({ error: e.message });
      }
    }
  });
})();
