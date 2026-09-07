from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Building, Floor, Unit
from app.schemas import BuildingOut

router = APIRouter(prefix="/buildings", tags=["Buildings"])

@router.get("", response_model=List[BuildingOut])
def get_buildings(parcel_id: Optional[int] = None, db: Session = Depends(get_db)):
    query = db.query(Building)
    if parcel_id:
        query = query.filter(Building.parcel_id == parcel_id)
    return query.all()

@router.get("/{id}", response_model=BuildingOut)
def get_building_by_id(id: int, db: Session = Depends(get_db)):
    bldg = db.query(Building).filter(Building.id == id).first()
    if not bldg:
        raise HTTPException(status_code=404, detail="Building not found")
    return bldg
