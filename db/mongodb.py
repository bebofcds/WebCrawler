from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
from services.parser import parser

client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["WebCrawlerForFCDS"]
collection = db["history"]


async def insert_data(data, parser_object):
    copy_data = data.copy()
    try:
        result = await collection.insert_one({
            "result": copy_data,
            "failed_links": parser_object.failed_links
        })

        return {
            "_id": str(result.inserted_id)
        }

    except DuplicateKeyError:
        return {
            "success": False,
            "error": "Data with the same _id already exists in the database."
        }
async def find_all_data(collection_name="history"):
    collection = db[collection_name]
    cursor = collection.find({})
    docs = await cursor.to_list(length=20)
    for doc in docs:
        doc["_id"] = str(doc["_id"])  
    return docs  
async def find_one(url):
    """Find a document that contains the given `url` inside the stored crawl result.

    The stored `result` is expected to contain a `graph` mapping where keys are
    crawled URLs. Some documents may store the graph in different shapes, so
    iterate the collection and look for a match in common locations.
    """
    cursor = collection.find({})
    async for doc in cursor:
        result = doc.get("result")
        # Case 1: result is a dict with a 'graph' mapping (expected shape from BFS)
        if isinstance(result, dict):
            graph = result.get("graph")
            if isinstance(graph, dict) and url in graph:
                doc["_id"] = str(doc["_id"])
                return doc
            # Case 2: graph might be stored as a list of nodes with a 'url' field
            if isinstance(graph, list):
                for node in graph:
                    if isinstance(node, dict) and node.get("url") == url:
                        doc["_id"] = str(doc["_id"])
                        return doc
        # Case 3: result itself might be a string equal to the url
        if result == url:
            doc["_id"] = str(doc["_id"])
            return doc
    return None