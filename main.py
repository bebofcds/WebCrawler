from fastapi import FastAPI,WebSocket
from api.websocket import router as websocket_router
app = FastAPI()
app.include_router(websocket_router)
