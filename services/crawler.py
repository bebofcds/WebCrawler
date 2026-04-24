from collections import deque
from urllib.parse import urljoin
from services import scraper, parser


def BFS(start_url, max_pages=10):

    graph = {}
    visited = set()
    queue = deque([start_url])

    while queue and len(visited) < max_pages:

        current_url = queue.popleft()

        if current_url in visited:
            continue

        visited.add(current_url)

        data = scraper.scrape_page(current_url)
        raw_children = parser.get_links(current_url)

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

    return graph