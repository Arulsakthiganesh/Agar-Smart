from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ULPINRecord, ActivityLog
from app.schemas import ULPINGenerateRequest, ULPINRecordOut
from app.ulpin.generator import generate_3d_ulpin, generate_qr_code_base64

router = APIRouter(prefix="/ulpin", tags=["3D ULPIN Generator"])

@router.post("/generate", response_model=ULPINRecordOut)
def generate_ulpin_endpoint(data: ULPINGenerateRequest, db: Session = Depends(get_db)):
    # Calculate 3D ULPIN string
    ulpin_str = generate_3d_ulpin(
        state=data.state,
        district=data.district,
        locality=data.village,
        survey_number=data.survey_number,
        parcel_number=data.parcel_number,
        building_id=data.building_id,
        floor_number=data.floor_number,
        unit_number=data.unit_number,
        lat=data.latitude,
        lon=data.longitude,
        elevation=data.elevation or 0.0
    )
    
    spatial_level = "Surface Parcel"
    if data.unit_number:
        spatial_level = "Vertical Unit (Apartment)"
    elif data.floor_number is not None:
        spatial_level = "Building Floor Level"
    elif data.building_id:
        spatial_level = "Building Structure"
        
    qr_b64 = generate_qr_code_base64(ulpin_str)
    
    existing = db.query(ULPINRecord).filter(ULPINRecord.ulpin == ulpin_str).first()
    if existing:
        return existing
        
    record = ULPINRecord(
        ulpin=ulpin_str,
        spatial_level=spatial_level,
        state=data.state,
        district=data.district,
        locality=data.village,
        parcel_id=data.parcel_number,
        building_id=data.building_id,
        floor_id=str(data.floor_number) if data.floor_number is not None else None,
        unit_id=data.unit_number,
        latitude=data.latitude,
        longitude=data.longitude,
        elevation=data.elevation or 0.0,
        qr_code_path=qr_b64
    )
    
    db.add(record)
    db.commit()
    db.refresh(record)
    
    db.add(ActivityLog(
        action="GENERATE_ULPIN",
        title="3D ULPIN Generated",
        description=f"Generated ULPIN {ulpin_str} for {spatial_level}"
    ))
    db.commit()
    
    return record

@router.get("/search", response_model=List[ULPINRecordOut])
def search_ulpins(query: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ULPINRecord)
    if query:
        fmt = f"%{query}%"
        q = q.filter(
            (ULPINRecord.ulpin.like(fmt)) |
            (ULPINRecord.locality.like(fmt)) |
            (ULPINRecord.parcel_id.like(fmt))
        )
    return q.limit(50).all()

@router.get("/{ulpin}", response_model=ULPINRecordOut)
def get_ulpin_details(ulpin: str, db: Session = Depends(get_db)):
    rec = db.query(ULPINRecord).filter(ULPINRecord.ulpin == ulpin).first()
    if not rec:
        raise HTTPException(status_code=404, detail="ULPIN record not found")
    return rec
