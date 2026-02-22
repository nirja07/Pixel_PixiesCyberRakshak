# 🛡 PhishGuard v2 — Browser Extension

Real-time phishing & malware detection. Works out of the box with **zero API keys** using URLhaus and OpenPhish. Optionally add more keys for deeper coverage.

---

## Files

```
phishguard-extension/
├── manifest.json        ← Extension config (Manifest V3)
├── content.js           ← Runs on every page, scrapes 20+ signals
├── background.js        ← 8-check analysis engine
├── popup.html           ← Dark-themed popup UI with tabs
├── popup.js             ← Popup rendering logic
├── generate-icons.js    ← Optional: generate placeholder icons
└── icons/
    ├── icon16.png
    ├── icon48.png
    └── icon128.png
```

---

## Quick Start (No API Keys Needed)

1. Create the `icons/` folder with 16×16, 48×48, 128×128 PNGs  
   (or run `npm install canvas && node generate-icons.js`)
2. Go to `chrome://extensions/`
3. Enable **Developer mode** (top-right toggle)
4. Click **Load unpacked** → select this folder
5. Done! Browse any site and click the shield icon.

URLhaus and OpenPhish work immediately — no keys required.

---

## All 8 Checks

| # | Check | API Key? | What It Detects |
|---|-------|----------|-----------------|
| 1 | **Heuristic Analysis** | ❌ None | IP domains, brand lookalikes, bad TLDs, urgency language, leet-speak, hidden elements, iframes |
| 2 | **SSL & Domain Structure** | ❌ None | No HTTPS, punycode IDN homograph attacks, phishing URL patterns |
| 3 | **URLhaus (abuse.ch)** | ❌ None | Active malware-distributing URLs |
| 4 | **OpenPhish** | ❌ None | Active phishing URLs (feed refreshed hourly) |
| 5 | **PhishTank** | ✅ Free | Community-verified phishing URLs |
| 6 | **VirusTotal** | ✅ Free | 70+ antivirus engines scan |
| 7 | **WHOIS Domain Age** | ✅ Free | Newly registered domains (huge phishing signal) |
| 8 | **IPInfo** | ✅ Free | Hosting provider, bulletproof ASNs, geolocation |

---

## Adding API Keys (Optional)

Open `background.js` and edit the `CONFIG` block at the top:

```js
const CONFIG = {
  // VirusTotal — virustotal.com (free, 4 req/min)
  VIRUSTOTAL_API_KEY: "paste_key_here",
  USE_VIRUSTOTAL: true,   // ← change to true

  // PhishTank — phishtank.org/api_info.php (free, no credit card)
  PHISHTANK_API_KEY: "paste_key_here",
  USE_PHISHTANK: true,

  // WHOIS XML API — whoisxmlapi.com (free, 500 req/month)
  WHOIS_API_KEY: "paste_key_here",
  USE_WHOIS: true,

  // IPInfo — ipinfo.io (free, 50,000 req/month)
  IPINFO_TOKEN: "paste_token_here",
  USE_IPINFO: true,

  // These are always on (no key needed):
  USE_URLHAUS: true,
  USE_OPENPHISH: true,
};
```

---

## Risk Score & Verdict

| Score | Badge | Verdict |
|-------|-------|---------|
| 0–29  | 🟢 ✓  | SAFE — no significant threats |
| 30–59 | 🟠 !  | SUSPICIOUS — avoid entering sensitive data |
| 60–100| 🔴 ✗  | DANGEROUS — do NOT enter credentials or payment |

---

## Popup UI Tabs

- **API Checks** — status of each detection engine (FREE badge = no key needed)
- **Issues** — flagged problems with severity (HIGH / MEDIUM / LOW)  
- **Page Info** — raw data scraped from the page

---

## Security Note

> Never hardcode API keys in a published extension. For a production/public release, proxy all API calls through your own backend server so keys stay private.
