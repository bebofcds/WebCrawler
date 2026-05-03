from fastapi import APIRouter, Query, Request
from fastapi.responses import JSONResponse
from services.crawler import BFS as crawl_url
from db.mongodb import insert_data, find_all_data, findByUrl ,findById
import traceback
from services.parser import parser
router = APIRouter()

@router.post("/crawl")
async def crawl(request: Request):
    try:
        body = await request.json()
        url = body.get("url")
        depth = body.get("depth", 1)

        if not url:
            return JSONResponse(
                content={"error": "url is required"},
                status_code=400
            )

        existing = await findByUrl(url)

        if existing:
            return JSONResponse(content={
                "_id" : str(existing["_id"])
            }, status_code=200)

        result, parser_object = crawl_url(url, max_depth=depth)
        #Empty the static fields
        parser.failed_links=[]
        parser.outgoing_links=[]
        response = await insert_data(result, parser_object , url)

        if "error" in response:
            return JSONResponse(content=response, status_code=500)

        return JSONResponse(
            content={"_id": response["_id"]},
            status_code=201
        )

    except Exception as e:
        traceback.print_exc()
        return JSONResponse(
            content={"error": str(e)},
            status_code=500
        )


@router.get("/history")
async def history(id: str = Query(None)):
    print(id)
    try:
        if id:
            doc = await findById(id)
            print(doc)

            if not doc:
                return JSONResponse(
                    content={"error": "URL not found"},
                    status_code=404
                )

            return JSONResponse(content=doc) 

        data = await find_all_data()

        return JSONResponse(
            content={"history": data}
        )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e)},
            status_code=400
        )