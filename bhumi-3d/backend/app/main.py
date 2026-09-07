from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base
from app.routers import (
    auth, parcels, buildings, floors, units,
    ulpin, underground, ai_router, upload, validation, dashboard, reports
)

# Initialize Database tables if not existing
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend REST API for BHUMI³D - 3D ULPIN & Vertical Property Intelligence Platform (SIH2026 Problem Statement ID: SIH26011)",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(parcels.router, prefix=settings.API_PREFIX)
app.include_router(buildings.router, prefix=settings.API_PREFIX)
app.include_router(floors.router, prefix=settings.API_PREFIX)
app.include_router(units.router, prefix=settings.API_PREFIX)
app.include_router(ulpin.router, prefix=settings.API_PREFIX)
app.include_router(underground.router, prefix=settings.API_PREFIX)
app.include_router(ai_router.router, prefix=settings.API_PREFIX)
app.include_router(upload.router, prefix=settings.API_PREFIX)
app.include_router(validation.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "status": "Online",
        "system": "BHUMI³D - 3D ULPIN & Vertical Property Intelligence Platform",
        "version": settings.VERSION,
        "organization": "Department of Land Resources (DoLR), Ministry of Rural Development",
        "docs": "/docs",
        "disclaimer": "BHUMI³D is a prototype developed for Smart India Hackathon 2026. Demonstration data and prototype ULPIN logic are fictional and must not be treated as official government land records."
    }
