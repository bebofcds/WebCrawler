from bs4 import BeautifulSoup  # Import BeautifulSoup for parsing HTML pages
import requests  # Import requests to send HTTP requests

# Type: dict
# A dictionary containing HTTP headers to make the request look like it's coming from a real browser
headers = {
    "User-Agent": "Mozilla/5.0"
}


# Type: function
# This function takes a URL and returns all links found on that webpage
def get_links(url):  # Parameter 'url' → Type: str

    # Type: list
    # Create an empty list to store the links
    links = []

    try:  # Try block to handle any potential errors gracefully
        # Type: requests.models.Response
        # Send an HTTP GET request with custom headers and timeout
        response = requests.get(url, headers=headers, timeout=5)

        # Type: int
        # Check if the request was successful (HTTP status code 200 = OK)
        if response.status_code != 200:
            return links  # Return empty list if request failed

        # Type: bs4.BeautifulSoup
        # Parse the HTML content of the response into a BeautifulSoup object
        soup = BeautifulSoup(response.text, "html.parser")

        # Type: bs4.element.ResultSet (a list-like object containing Tag objects)
        # Find and extract all <a> (anchor) tags from the parsed HTML
        links = soup.find_all("a")

    except:  # Catch any exception that might occur
        pass  # Silently ignore errors (not recommended in production)

    # Type: bs4.element.ResultSet
    # Return the list of all found link tags
    return links
