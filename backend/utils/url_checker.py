import re

SUSPICIOUS_TLDS = [
    ".xyz", ".top", ".click", ".online", ".site",
    ".gq", ".tk", ".ml", ".cf"
]

URL_SHORTENERS = [
    "bit.ly", "tinyurl.com", "goo.gl",
    "t.co", "is.gd", "buff.ly"
]


def extract_urls(text):
    """
    Extracts URLs from text using regex.
    """

    url_pattern = r'(https?://[^\s]+|www\.[^\s]+)'
    urls = re.findall(url_pattern, text)

    return urls


# =========================
# 3. Check if IP-based URL
# =========================

def is_ip_address(url):
    ip_pattern = r'https?://\d{1,3}(\.\d{1,3}){3}'
    return re.search(ip_pattern, url) is not None


# =========================
# 4. URL Risk Scoring
# =========================

def analyze_urls(text):

    urls = extract_urls(text)

    score = 0
    indicators = []

    for url in urls:
        url_lower = url.lower()

        # Suspicious TLD check
        for tld in SUSPICIOUS_TLDS:
            if tld in url_lower:
                score += 20
                indicators.append(f"Suspicious TLD: {tld}")

        # Shortener check
        for shortener in URL_SHORTENERS:
            if shortener in url_lower:
                score += 25
                indicators.append("URL Shortener Used")

        # IP-based URL
        if is_ip_address(url_lower):
            score += 25
            indicators.append("IP Address Based URL")

        # Too many subdomains
        if url_lower.count('.') > 3:
            score += 10
            indicators.append("Too Many Subdomains")

    return {
        "url_score": score,
        "detected_urls": urls,
        "url_indicators": indicators
    }