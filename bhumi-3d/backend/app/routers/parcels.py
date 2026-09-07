from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Parcel, ActivityLog
from app.schemas import ParcelOut, ParcelCreate
from app.ulpin.generator import generate_3d_ulpin

router = APIRouter(prefix="/parcels", tags=["Land Parcels"])

@router.get("", response_model=List[ParcelOut])
def get_parcels(
    district: Optional[str] = None,
    village: Optional[str] = None,
    status: Optional[str] = None,
    property_type: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Parcel)
    if district:
        query = query.filter(Parcel.district == district)
    if village:
        query = query.filter(Parcel.village == village)
    if status:
        query = query.filter(Parcel.status == status)
    if property_type:
        query = query.filter(Parcel.property_type == property_type)
    if search:
        search_fmt = f"%{search}%"
        query = query.filter(
            (Parcel.parcel_id.like(search_fmt)) |
            (Parcel.survey_number.like(search_fmt)) |
            (Parcel.ulpin.like(search_fmt)) |
            (Parcel.owner_name.like(search_fmt))
        )
    return query.all()

@router.get("/{id}", response_model=ParcelOut)
def get_parcel_by_id(id: int, db: Session = Depends(get_db)):
    parcel = db.query(Parcel).filter(Parcel.id == id).first()
    if not parcel:
        raise HTTPException(status_code=404, detail="Parcel not found")
    return parcel

@router.post("", response_model=ParcelOut)
def create_parcel(data: ParcelCreate, db: Session = Depends(get_db)):
    count = db.query(Parcel).count()
    parcel_id = f"PCL-{str(count + 1).zfill(4)}"
    
    # Generate ULPIN for parcel
    ulpin_str = generate_3d_ulpin(
        state=data.state,
        district=data.district,
        locality=data.village,
        survey_number=data.survey_number,
        parcel_number=parcel_id,
        lat=data.latitude,
        lon=data.longitude,
        elevation=data.elevation
    )
    
    new_parcel = Parcel(
        parcel_id=parcel_id,
        ulpin=ulpin_str,
        survey_number=data.survey_number,
        area=data.area,
        latitude=data.latitude,
        longitude=data.longitude,
        elevation=data.elevation,
        state=data.state,
        district=data.district,
        taluk=data.taluk,
        village=data.village,
        property_type=data.property_type,
        owner_name=data.owner_name,
        geometry=data.geometry,
        status="Verified"
    )
    
    db.add(new_parcel)
    db.commit()
    db.refresh(new_parcel)
    
    # Activity Log
    db.add(ActivityLog(
        action="CREATE_PARCEL",
        title="Land Parcel Registered",
        description=f"Created parcel {parcel_id} with ULPIN {ulpin_str}"
    ))
    db.commit()
    
    return new_parcel
