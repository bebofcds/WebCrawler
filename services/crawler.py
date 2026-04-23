from collections import deque  # Import deque for efficient queue operations (FIFO)
from services import parser  # Import your custom module that contains the get_links function
from urllib.parse import urljoin  # Import urljoin to convert relative URLs to absolute URLs

# Type: list
# Global list to store pages that have no outgoing links
outgoing_links = []


# Type: function
# BFS function to crawl pages and build a graph of links
async def BFS(start_url, max_pages=40):  # Parameters: start_url → str, max_pages → int

    # Type: dict
    # Dictionary to store the graph where key = URL, value = list of neighboring URLs
    graph = {}

    # Type: set
    # Set to keep track of visited URLs (for fast lookup and to avoid duplicates)
    visited = set()

    # Type: collections.deque
    # Queue for BFS traversal (FIFO - First In First Out)
    queue = deque([start_url])

    # Type: str (but added to set)
    # Mark the starting URL as visited
    visited.add(start_url)

    # Continue while there are URLs in the queue and we haven't reached the maximum page limit
    while queue and len(visited) < max_pages:

        # Type: str
        # Get the next URL from the front of the queue (FIFO behavior)
        current_url = queue.popleft()

        # Type: list
        # Temporary list to store neighboring URLs of the current page
        neighbors = []

        # Loop through all <a> tags returned by get_links()
        for url in parser.get_links(current_url):

            # Type: str
            # Convert relative URL to absolute URL, then remove fragments (#...) and query parameters (?...)
            full_url = urljoin(current_url, url.get("href")).split("#")[0].split("?")[0]

            # Type: bool (inside the if condition)
            if full_url not in visited:  # Check if this URL hasn't been visited yet

                # Type: str (added to list)
                neighbors.append(full_url)  # Add to neighbors list

                # Type: str (added to set)
                visited.add(full_url)  # Mark as visited

                # Type: str (added to queue)
                queue.append(full_url)  # Add to queue for later exploration

        # Type: bool (inside the if condition)
        if not neighbors:  # If the current page has no outgoing links
            # Type: str (added to list)
            outgoing_links.append(current_url)  # Add this page to the global list of dead-end pages

        # Type: str (key) and list (value)
        # Add the current URL and its neighbors to the graph
        graph[current_url] = neighbors

    # Store the graph in the database after all pages are processed
    # insert_data(graph)
    
    # Type: dict
    # Return the constructed graph
    return graph
