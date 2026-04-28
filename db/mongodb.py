from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

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



async def find_one(id: str):
    try:
        doc = await collection.find_one({"_id": ObjectId(id)})

        if not doc:
            return None

        doc["_id"] = str(doc["_id"])  
        return doc

    except Exception:
        return None