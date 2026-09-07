from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Floor
from app.schemas import FloorOut

router = APIRouter(prefix="", tags=["Floors"])

@router.get("/buildings/{building_id}/floors", response_model=List[FloorOut])
def get_building_floors(building_id: int, db: Session = Depends(get_db)):
    floors = db.query(Floor).filter(Floor.building_id == building_id).order_by(Floor.floor_number.desc()).all()
    return floors

@router.get("/floors/{id}", response_model=FloorOut)
def get_floor_by_id(id: int, db: Session = Depends(get_db)):
    flr = db.query(Floor).filter(Floor.id == id).first()
    if not flr:
        raise HTTPException(status_code=404, detail="Floor not found")
    return flr
