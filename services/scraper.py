import requests
from bs4 import BeautifulSoup


def scrape_page(res, limit=400):
    try:
        soup = BeautifulSoup(res.text, "html.parser")
        if not soup.body:
            return ""
        texts = []

        for i, text in enumerate(soup.body.stripped_strings):
            if i >= limit:
                break
            texts.append(text)

        final_text = "\n".join(texts)

        return final_text,soup.title.string
    except:
        return None,None