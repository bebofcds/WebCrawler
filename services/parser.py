from bs4 import BeautifulSoup  # Import BeautifulSoup for parsing HTML pages
import requests  # Import requests to send HTTP requests
from services.failed_links import append_failed_links  # Import your custom module to track failed links (optional)
import logging  # Import logging for better error handling and debugging
from urllib.parse import urljoin  # Import urljoin to convert relative URLs to absolute URLs


logger=logging.getLogger("uvicorn")  # Get the logger for the Uvicorn server (or you can configure your own logger)
# Type: dict
# A dictionary containing HTTP headers to make the request look like it's coming from a real browser
# Type: function
# This function takes a URL and returns all links found on that webpage
def get_links(url , response):  # Parameter 'url' → Type: str

    # Type: list
    # Create an empty list to store the links
    links = []
    try:  # Try block to handle any potential errors gracefully
        # Type: requests.models.Response
        # Send an HTTP GET request with custom headers and timeout

        # Type: int
        # Check if the request was successful (HTTP status code 200 = OK)
        if response.status_code != 200:
            logger.error(f"Failed to retrieve {url} with status code {response.status_code}")
            append_failed_links(url)  # Track failed links 
            return links  # If not successful, return the empty list of links
        # Type: bs4.BeautifulSoup
        # Parse the HTML content of the response into a BeautifulSoup object
        soup = BeautifulSoup(response.text, "html.parser")

        # Type: bs4.element.ResultSet (a list-like object containing Tag objects)
        # Find and extract all <a> (anchor) tags from the parsed HTML
        
    
        for a in soup.find_all("a", attrs={"href": True}):
            href = a.get("href")
            if href:
                full_url = urljoin(url, href).split("#")[0].split("?")[0]
                links.append(full_url)



    except:  # Catch any exception that might occur
        pass  # Silently ignore errors (not recommended in production)

    # Type: bs4.element.ResultSet
    # Return the list of all found link tags
    return links
