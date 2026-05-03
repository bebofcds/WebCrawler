from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
from bson import ObjectId

client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["WebCrawlerForFCDS"]
collection = db["history"]


# Save crawled data
async def insert_data(data, parser_object , base_url):
    try:
        result = await collection.insert_one({
            "base_url" : base_url,
            "result": data.copy() if data else {},
            "failed_links": getattr(parser_object, "failed_links", [])
        })

        return {"_id": str(result.inserted_id)}

    except DuplicateKeyError:
        return {"error": "Duplicate entry detected"}


async def find_all_data():
    docs = await collection.find().to_list(length=None)
    for doc in docs:
        doc["_id"] = str(doc["_id"])

    return docs


async def findById(id: str):
    try:
        doc = await collection.find_one({"_id": ObjectId(id)})
        if not doc:
            return None
        doc["_id"] = str(doc["_id"])  
        return doc
    
    except Exception:
        return None
    

async def findByUrl(base_url: str):
    try:
        doc = await collection.find_one({"base_url": base_url})
        if not doc:
            return None
        doc["_id"] = str(doc["_id"])  
        return doc
    
    except Exception:
        return {
            "message" : "failed to fatch the Url"
        }