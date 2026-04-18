from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["webcrawler"]
def insert_data(data,collection_name="history"):
    collection = db[collection_name]
    collection.insert_one(data)
def find_data(query,collection_name="history"):
    collection = db[collection_name]
    return collection.find_one(query)