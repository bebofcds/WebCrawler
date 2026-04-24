from collections import deque
from urllib.parse import urljoin
from services import scraper, parser
import requests
from bs4 import BeautifulSoup



def BFS(start_url, max_pages=10):

    graph = {}
    visited = set()
    queue = deque([start_url])
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(start_url, headers=headers, timeout=10)
    soup = BeautifulSoup(res.text , "html.parser")
    res.raise_for_status()
    while queue and len(visited) < max_pages:

        current_url = queue.popleft()

        if current_url in visited:
            continue

        visited.add(current_url)

        data = scraper.scrape_page(res)
        raw_children = parser.get_links(current_url ,res)

        clean_children = []

        for href in raw_children:
            full_url = urljoin(current_url, href).split("#")[0].split("?")[0]

            clean_children.append(full_url)

            if full_url not in visited:
                queue.append(full_url)

        graph[current_url] = {
            "data": data,
            "children": clean_children
        }

    return {
        "graph" : graph,
        "title" : soup.title.string
    }