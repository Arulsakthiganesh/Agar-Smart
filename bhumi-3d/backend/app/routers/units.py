from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Unit
from app.schemas import UnitOut

router = APIRouter(prefix="", tags=["Units"])

@router.get("/floors/{floor_id}/units", response_model=List[UnitOut])
def get_floor_units(floor_id: int, db: Session = Depends(get_db)):
    units = db.query(Unit).filter(Unit.floor_id == floor_id).all()
    return units

@router.get("/units/{id}", response_model=UnitOut)
def get_unit_by_id(id: int, db: Session = Depends(get_db)):
    u = db.query(Unit).filter(Unit.id == id).first()
    if not u:
        raise HTTPException(status_code=404, detail="Unit not found")
    return u
