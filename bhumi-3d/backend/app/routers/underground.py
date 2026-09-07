from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import UndergroundAsset
from app.schemas import UndergroundAssetOut

router = APIRouter(prefix="/underground", tags=["Underground Infrastructure"])

@router.get("/assets", response_model=List[UndergroundAssetOut])
def get_underground_assets(db: Session = Depends(get_db)):
    assets = db.query(UndergroundAsset).all()
    return assets

@router.get("/assets/{id}", response_model=UndergroundAssetOut)
def get_underground_asset_by_id(id: int, db: Session = Depends(get_db)):
    asset = db.query(UndergroundAsset).filter(UndergroundAsset.id == id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Underground asset not found")
    return asset
