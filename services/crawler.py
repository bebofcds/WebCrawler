from collections import deque
from urllib.parse import urljoin
from services import scraper, parser
import requests
from bs4 import BeautifulSoup
from services.failed_links import failed_links,append_failed_links



def BFS(start_url, max_pages=10,max_depth=4):

    graph = {}
    visited = set()
    queue = deque([(start_url,0)])
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    res = requests.get(start_url, headers=headers, timeout=10)
    soup = BeautifulSoup(res.text , "html.parser")
    res.raise_for_status()
    while queue and len(visited) < max_pages:
        current_url,depth = queue.popleft()

        if current_url in visited:
            continue
        if depth>max_depth:
            continue
        try:
            res = requests.get(current_url, headers=headers, timeout=10)
            res.raise_for_status()
        except Exception as e:
            append_failed_links(current_url)
            continue

        visited.add(current_url)

        result = scraper.scrape_page(res)

        if not result or len(result) != 2:
            append_failed_links(current_url)
            continue

        data, child_title = result
        raw_children = parser.get_links(current_url, res)

        clean_children = []
        
        if depth<max_depth:
            for link in raw_children:
                if link not in visited:
                    queue.append((link,depth+1))
                clean_children.append(link)

        graph[current_url] = {
            "title":child_title,
            "data": data,
            "children": clean_children,
        }
    title_tag=soup.title
    title_text=title_tag.string.strip() if title_tag and title_tag.string else ""
    return {
        "graph" : graph,
        "title" : title_text
    }