from bs4 import BeautifulSoup 
import requests
import logging  
from urllib.parse import urljoin 
class parser:	
	logger=logging.getLogger("uvicorn")
	headers={"User-Agent":"Mozilla/5.0"}
	failed_links=set()
	outgoing_links=[]
	def __init__(self,url):
		self.soup = None
		self.url=url
		try: 
			response = requests.get(url,headers=parser.headers,timeout=5)
			if response.status_code != 200:
				parser.logger.error(f"Failed to retrieve {url} with status code {response.status_code}")
				self.add_failed_links()
				return
			self.soup = BeautifulSoup(response.text, "html.parser")
		except Exception as e: 
			parser.logger.error(f"Error fetching {url}: {e}")
			self.add_failed_links()

	def get_links(self):  
		if self.soup is None: 
			return []
		links=[]
		for a in self.soup.find_all("a", attrs={"href": True}):
			href = a.get("href")
			if href:
				full_url = urljoin(self.url, href).split("#")[0].split("?")[0]
				links.append(full_url)
		if not links and self.url not in parser.failed_links:
			self.outgoing_links.append(self.url)
		return links

	def get_data(self, limit=400):
		try:
			if not self.soup.body:
				return ""
			texts = []
			for i, text in enumerate(self.soup.body.stripped_strings):
				if i >= limit:
					break
				texts.append(text)
			final_text = "\n".join(texts)
			return final_text,self.soup.title.string
		except:
			return None,None
	def add_failed_links(self):
		self.failed_links.add(self.url)