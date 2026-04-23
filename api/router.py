from fastapi import APIRouter,Request
from fastapi.responses import JSONResponse
from services.crawler import BFS as crawl_url
from services.failed_links import failed_links
from db.mongodb import insert_data,find_all_data
router= APIRouter()
@router.post("/crawl")
async def crawl(request:Request):
    try:
        body=await request.json()
        url=body["url"]
        result=await crawl_url(url)
        error=await insert_data(result)
        if error:
            return JSONResponse(content=error, status_code=400)
        return {
        "result: ":result,
        "failed links: ":failed_links
        }
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)
@router.get("/history")
async def history():
    try:
        data=await find_all_data()
        return {"history":data}
    except Exception as e:
        return JSONResponse(content={"error": str(e)}, status_code=400)