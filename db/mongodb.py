from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError

client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["WebCrawlerForFCDS"]
collection = db["history"]


# Save crawled data
async def insert_data(data, parser_object):
    try:
        result = await collection.insert_one({
            "result": data.copy() if data else {},
            "failed_links": getattr(parser_object, "failed_links", [])
        })

        return {"_id": str(result.inserted_id)}

    except DuplicateKeyError:
        return {"error": "Duplicate entry detected"}


# Get all history
async def find_all_data(limit: int = 20):
    cursor = collection.find({}).limit(limit)
    docs = await cursor.to_list(length=limit)

    for doc in docs:
        doc["_id"] = str(doc["_id"])

    return docs


# Find document by URL inside stored graph
async def find_one(url: str):
    cursor = collection.find({})

    async for doc in cursor:
        result = doc.get("result", {})
        graph = result.get("graph") if isinstance(result, dict) else None

        # Case 1: graph is dict
        if isinstance(graph, dict) and url in graph:
            doc["_id"] = str(doc["_id"])
            return doc

        # Case 2: graph is list of nodes
        if isinstance(graph, list):
            for node in graph:
                if isinstance(node, dict) and node.get("url") == url:
                    doc["_id"] = str(doc["_id"])
                    return doc

        # Case 3: direct match
        if result == url:
            doc["_id"] = str(doc["_id"])
            return doc

    return None