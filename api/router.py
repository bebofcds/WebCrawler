from fastapi import APIRouter, Query,Request
from fastapi.responses import JSONResponse
from services.crawler import BFS as crawl_url
from services.parser import parser
from db.mongodb import insert_data,find_all_data,find_one
import traceback
router= APIRouter()


@router.post("/crawl")
async def crawl(request: Request):
    try:
        body = await request.json()

        url = body.get("url")
        depth = body.get("depth")
        
        if not url or not depth:
            return JSONResponse(
                content={"error": "url and depth are required"},
                status_code=400
            )

        existing = await find_one(url)
        if existing:
            existing["_id"] = str(existing["_id"])
            return JSONResponse(content={"_id": existing["_id"]}, status_code=200)

        result, parser_object = crawl_url(url, max_depth=depth)

        response = await insert_data(result, parser_object)

        if "error" in response:
            return JSONResponse(content={"error": response["error"]}, status_code=500)

        return JSONResponse(content={"_id": response["_id"]}, status_code=201)

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(content={"error": str(e)}, status_code=500) 

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
