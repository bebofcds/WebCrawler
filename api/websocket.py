from fastapi import APIRouter,WebSocket
router= APIRouter()
@router.websocket("/crawl")
async def crawl(websocket: WebSocket):
    await websocket.accept()
    try:    
        while True:
            json_req = await websocket.receive_json()
            url=json_req.get("url")
    except Exception as e:
        print(f"Error occurred: {e}")
    finally:
        await websocket.close()