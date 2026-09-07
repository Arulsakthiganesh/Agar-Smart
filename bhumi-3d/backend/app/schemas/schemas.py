from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel


# Auth Schemas
class LoginRequest(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserBase(BaseModel):
    name: str
    email: str
    role: str


class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

# Unit Schemas
class UnitOut(BaseModel):
    id: int
    floor_id: int
    unit_number: str
    area: float
    property_type: str
    ulpin: Optional[str] = None
    ownership_status: str
    owner_name: Optional[str] = None
    status: str
    geometry: Optional[Dict[str, Any]] = None
    class Config:
        from_attributes = True

# Floor Schemas
class FloorOut(BaseModel):
    id: int
    building_id: int
    floor_number: int
    height: float
    area: float
    status: str
    units: List[UnitOut] = []
    class Config:
        from_attributes = True

# Building Schemas
class BuildingOut(BaseModel):
    id: int
    building_id: str
    parcel_id: int
    name: str
    height: float
    floors_count: int
    built_up_area: float
    ai_confidence: float
    status: str
    geometry: Optional[Dict[str, Any]] = None
    floors: List[FloorOut] = []
    class Config:
        from_attributes = True

# Parcel Schemas
class ParcelOut(BaseModel):
    id: int
    parcel_id: str
    ulpin: Optional[str] = None
    survey_number: str
    area: float
    latitude: float
    longitude: float
    elevation: float
    state: str
    district: str
    taluk: str
    village: str
    property_type: str
    owner_name: str
    status: str
    geometry: Optional[Dict[str, Any]] = None
    buildings: List[BuildingOut] = []
    class Config:
        from_attributes = True

class ParcelCreate(BaseModel):
    survey_number: str
    area: float
    latitude: float
    longitude: float
    elevation: Optional[float] = 12.5
    state: Optional[str] = "Tamil Nadu"
    district: Optional[str] = "Chennai"
    taluk: Optional[str] = "Mylapore-Triplicane"
    village: Optional[str] = "Adyar"
    property_type: Optional[str] = "Residential"
    owner_name: Optional[str] = "Government Land / Private"
    geometry: Optional[Dict[str, Any]] = None

# Underground Asset Schemas
class UndergroundAssetOut(BaseModel):
    id: int
    asset_id: str
    name: str
    type: str
    depth: float
    length: float
    owner_agency: str
    status: str
    geometry: Optional[Dict[str, Any]] = None
    last_inspection: str
    class Config:
        from_attributes = True

# ULPIN Schemas
class ULPINGenerateRequest(BaseModel):
    state: str = "Tamil Nadu"
    district: str = "Chennai"
    taluk: str = "Mylapore-Triplicane"
    village: str = "Adyar"
    survey_number: str
    parcel_number: str
    property_type: str = "Residential"
    building_id: Optional[str] = None
    floor_number: Optional[int] = None
    unit_number: Optional[str] = None
    latitude: float
    longitude: float
    elevation: Optional[float] = 0.0

class ULPINRecordOut(BaseModel):
    id: int
    ulpin: str
    spatial_level: str
    state: str
    district: str
    locality: str
    parcel_id: Optional[str] = None
    building_id: Optional[str] = None
    floor_id: Optional[str] = None
    unit_id: Optional[str] = None
    latitude: float
    longitude: float
    elevation: float
    qr_code_path: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Validation Schemas
class ValidationIssueOut(BaseModel):
    id: int
    entity_type: str
    entity_id: str
    issue_type: str
    severity: str
    description: str
    status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ValidationResolveRequest(BaseModel):
    status: str # Resolved, Ignored

# AI Schemas
class ProcessingJobOut(BaseModel):
    id: int
    filename: str
    job_type: str
    status: str
    progress: int
    result: Optional[Dict[str, Any]] = None
    confidence_scores: Optional[Dict[str, Any]] = None
    created_at: datetime
    class Config:
        from_attributes = True

# Dashboard Stats Schema
class DashboardStats(BaseModel):
    total_parcels: int
    mapped_3d_properties: int
    total_buildings: int
    floors_mapped: int
    ulpins_generated: int
    underground_assets: int
    validation_issues: int
    ai_processing_jobs: int

# Activity Log Schema
class ActivityLogOut(BaseModel):
    id: int
    action: str
    title: str
    description: str
    user_email: str
    timestamp: datetime
    class Config:
        from_attributes = True
