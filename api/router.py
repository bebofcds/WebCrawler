from fastapi import APIRouter, Query,Request
from fastapi.responses import JSONResponse
from services.crawler import BFS as crawl_url
from services.parser import parser
from db.mongodb import insert_data,find_all_data,find_one
router= APIRouter()
@router.post("/crawl")
async def crawl(request:Request):
    try:
        body=await request.json()
        url=body["url"]
        depth=body["depth"]
        result=crawl_url(url,max_depth=depth)
        error=await insert_data(result)
        if error:
            return JSONResponse(content=error, status_code=400)
        return {
        "result: ":result,
        "failed links: ":parser.failed_links,
        "outgoing links: ":parser.outgoing_links
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
@router.get("/history")
async def history(url:str=Query(None)):
    if url:
        doc=await find_one(url)
        if not doc:
            return JSONResponse(content={"error":"Didn't find the requested url"},status_code=404)
        doc["_id"] = str(doc["_id"])
        return doc
    try:
        data=await find_all_data()
        return {"history":data}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
