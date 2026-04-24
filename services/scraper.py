import requests
from bs4 import BeautifulSoup


def scrape_page(url, limit=400):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(url, headers=headers, timeout=10)
    res.raise_for_status()

    soup = BeautifulSoup(res.text, "html.parser")

    if not soup.body:
        return ""

    texts = []

    for i, text in enumerate(soup.body.stripped_strings):
        if i >= limit:
            break
        texts.append(text)

    final_text = "\n".join(texts)

    return final_text