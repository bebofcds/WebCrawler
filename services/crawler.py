from collections import deque
from services.parser import parser
from urllib.parse import urljoin
def BFS(start_url, max_pages=30,max_depth=4):
    graph = {}
    visited = set()
    queue = deque([(start_url,0)])
    while queue and len(visited) < max_pages:
        current,depth = queue.popleft()

        if current in visited:
            continue
        if depth>max_depth:
            continue
        visited.add(current)
        current=parser(current)
        result = current.get_data()
        if not result or len(result) != 2:
            current.add_failed_links()
            continue

        data, child_title = result
        raw_children = current.get_links()

        clean_children = []
        
        for link in raw_children:
            if link not in visited:
                queue.append((link,depth+1))
            clean_children.append((link, depth+1))

        graph[current.url] = {
            "title":child_title,
            "data": data,
            "children": clean_children,
        }
    title_tag=current.soup.title
    title_text=title_tag.string.strip() if title_tag and title_tag.string else ""
    return {
        "graph" : graph,
        "title" : title_text
    },current