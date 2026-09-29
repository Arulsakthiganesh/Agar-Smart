import sys, os
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "../..")))

import asyncio
from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.router import api_router

from app.websocket.connection_manager import ws_manager
from app.database.session import engine, Base, SessionLocal
from app.db_init import init_db

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="AI/ML-Based Severe Thunderstorm & Lightning Nowcasting Command Platform for SIH 2026 (MoES / IMD)",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount API routes
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        init_db(db)
    finally:
        db.close()
    asyncio.create_task(background_websocket_simulator())

async def background_websocket_simulator():
    """Background worker broadcasting periodic live lightning and radar updates to connected WebSockets."""
    while True:
        await asyncio.sleep(settings.WS_HEARTBEAT_INTERVAL)
        if ws_manager.active_connections:
            msg = {
                "event": "LIVE_HEARTBEAT",
                "timestamp": datetime.utcnow().isoformat(),
                "data_mode": settings.DATA_MODE,
                "message": "Live radar pulse & lightning telemetry synced."
            }
            await ws_manager.broadcast(msg)

@app.websocket("/ws/live")
async def websocket_endpoint(websocket: WebSocket):
    await ws_manager.connect(websocket)
    try:
        await websocket.send_json({
            "event": "CONNECTED",
            "message": "Connected to STORMCAST AI Command Feed",
            "data_mode": settings.DATA_MODE
        })
        while True:
            data = await websocket.receive_text()
            # Respond to client ping
            await websocket.send_json({"event": "PONG", "received": data})
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)

@app.get("/")
def root():
    return {
        "platform": settings.PROJECT_NAME,
        "subtitle": "AI/ML-Based Thunderstorm & Lightning Nowcasting Platform",
        "organization": "Ministry of Earth Sciences (MoES) / India Meteorological Department (IMD)",
        "status": "OPERATIONAL",
        "data_mode": settings.DATA_MODE,
        "documentation": "/docs"
    }
