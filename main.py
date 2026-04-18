from fastapi import FastAPI,WebSocket
from api.websocket import router as websocket_router
import uvicorn #install uvicorn[standard] for websocket support
import os
from dotenv import load_dotenv
load_dotenv()  # Load environment variables from .env file
port = int(os.getenv("PORT", 8000))  # Get PORT from environment variables, default to 8000 if not set
app = FastAPI()
app.include_router(websocket_router)
uvicorn.run(app, host="localhost", port=port)