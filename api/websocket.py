from fastapi import APIRouter,WebSocket
from services.crawler import BFS as crawl_url
from services.failed_links import failed_links
router= APIRouter()
@router.websocket("/crawl")
async def crawl(websocket: WebSocket):
    await websocket.accept()
    try:    
        while True:
            json_req = await websocket.receive_json()
            url=json_req.get("url")
            if url:
                result = crawl_url(url)
                await websocket.send_json({"result": result, "failed_links": failed_links})
            else:
                await websocket.send_json({"error": "No URL provided"})
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        await websocket.close()