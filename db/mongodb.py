from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError
from services import failed_links

client = AsyncIOMotorClient("mongodb://localhost:27017/")
db = client["WebCrawlerForFCDS"]
collection = db["history"]

async def insert_data(data):
    copy_data = data.copy()  # Create a copy of the data to avoid modifying the original
    try:
        await collection.insert_one({"result": copy_data,"failed_links": failed_links.failed_links})
    except DuplicateKeyError:
        return {"error": "Data with the same _id already exists in the database."}
async def find_all_data(collection_name="history"):
    collection = db[collection_name]
    cursor = collection.find({})
    docs = await cursor.to_list(length=20)
    for doc in docs:
        doc["_id"] = str(doc["_id"])  
    return docs  
async def find_one(url):
    return await collection.find_one({"result.graph":url})