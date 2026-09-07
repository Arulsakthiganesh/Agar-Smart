from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, ForeignKey, JSON, Boolean
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(String(50), default="viewer") # administrator, govt_officer, surveyor, viewer
    created_at = Column(DateTime, default=datetime.utcnow)

class Parcel(Base):
    __tablename__ = "parcels"

    id = Column(Integer, primary_key=True, index=True)
    parcel_id = Column(String(50), unique=True, index=True, nullable=False)
    ulpin = Column(String(100), unique=True, index=True, nullable=True)
    survey_number = Column(String(50), nullable=False)
    area = Column(Float, nullable=False) # sq ft
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=12.5) # meters
    state = Column(String(50), default="Tamil Nadu")
    district = Column(String(50), default="Chennai")
    taluk = Column(String(50), default="Mylapore-Triplicane")
    village = Column(String(50), default="Adyar")
    property_type = Column(String(50), default="Residential") # Residential, Commercial, Mixed, Infrastructure
    owner_name = Column(String(100), default="Government Land / Private")
    status = Column(String(30), default="Verified") # Verified, Pending, Conflict
    geometry = Column(JSON, nullable=True) # GeoJSON polygon format
    created_at = Column(DateTime, default=datetime.utcnow)

    buildings = relationship("Building", back_populates="parcel", cascade="all, delete-orphan")

class Building(Base):
    __tablename__ = "buildings"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(String(50), unique=True, index=True, nullable=False)
    parcel_id = Column(Integer, ForeignKey("parcels.id"), nullable=False)
    name = Column(String(100), nullable=False)
    height = Column(Float, nullable=False) # meters
    floors_count = Column(Integer, nullable=False, default=1)
    built_up_area = Column(Float, nullable=False) # sq ft
    ai_confidence = Column(Float, default=95.0) # percentage
    status = Column(String(30), default="Verified")
    geometry = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    parcel = relationship("Parcel", back_populates="buildings")
    floors = relationship("Floor", back_populates="building", cascade="all, delete-orphan")

class Floor(Base):
    __tablename__ = "floors"

    id = Column(Integer, primary_key=True, index=True)
    building_id = Column(Integer, ForeignKey("buildings.id"), nullable=False)
    floor_number = Column(Integer, nullable=False)
    height = Column(Float, nullable=False, default=3.0) # meters elevation from base of building
    area = Column(Float, nullable=False) # sq ft
    status = Column(String(30), default="Verified")
    geometry = Column(JSON, nullable=True)

    building = relationship("Building", back_populates="floors")
    units = relationship("Unit", back_populates="floor", cascade="all, delete-orphan")

class Unit(Base):
    __tablename__ = "units"

    id = Column(Integer, primary_key=True, index=True)
    floor_id = Column(Integer, ForeignKey("floors.id"), nullable=False)
    unit_number = Column(String(50), nullable=False)
    area = Column(Float, nullable=False) # sq ft
    property_type = Column(String(50), default="Apartment")
    ulpin = Column(String(100), unique=True, index=True, nullable=True)
    ownership_status = Column(String(50), default="Owned")
    owner_name = Column(String(100), nullable=True)
    status = Column(String(30), default="Verified")
    geometry = Column(JSON, nullable=True)

    floor = relationship("Floor", back_populates="units")

class UndergroundAsset(Base):
    __tablename__ = "underground_assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    type = Column(String(50), nullable=False) # Water Pipeline, Sewage Pipeline, Electrical Cable, Gas Line, Tunnel
    depth = Column(Float, nullable=False) # meters below surface
    length = Column(Float, nullable=False) # km or meters
    owner_agency = Column(String(100), default="Chennai Metropolitan Water Supply and Sewerage Board")
    status = Column(String(30), default="Operational")
    geometry = Column(JSON, nullable=True)
    last_inspection = Column(String(30), default="2026-08-15")

class ULPINRecord(Base):
    __tablename__ = "ulpin_records"

    id = Column(Integer, primary_key=True, index=True)
    ulpin = Column(String(100), unique=True, index=True, nullable=False)
    spatial_level = Column(String(50), nullable=False) # Surface Parcel, Building, Floor, Vertical Unit, Subsurface Asset
    state = Column(String(50), nullable=False)
    district = Column(String(50), nullable=False)
    locality = Column(String(50), nullable=False)
    parcel_id = Column(String(50), nullable=True)
    building_id = Column(String(50), nullable=True)
    floor_id = Column(String(50), nullable=True)
    unit_id = Column(String(50), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation = Column(Float, default=0.0)
    qr_code_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ValidationIssue(Base):
    __tablename__ = "validation_issues"

    id = Column(Integer, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False) # Parcel, Building, Floor, Unit, Asset
    entity_id = Column(String(50), nullable=False)
    issue_type = Column(String(100), nullable=False) # Parcel Overlap, Elevation Bounds Mismatch, Duplicate ULPIN, Boundary Conflict
    severity = Column(String(20), nullable=False) # Critical, Warning, Info
    description = Column(Text, nullable=False)
    status = Column(String(20), default="Open") # Open, Resolved, Ignored
    created_at = Column(DateTime, default=datetime.utcnow)

class ProcessingJob(Base):
    __tablename__ = "processing_jobs"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String(255), nullable=False)
    job_type = Column(String(50), nullable=False) # Drone Image Analysis, Floor Plan Extraction, LiDAR Point Cloud
    status = Column(String(30), default="Processing") # Pending, Processing, Completed, Failed
    progress = Column(Integer, default=0) # 0 to 100
    result = Column(JSON, nullable=True)
    confidence_scores = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    action = Column(String(50), nullable=False)
    title = Column(String(150), nullable=False)
    description = Column(Text, nullable=False)
    user_email = Column(String(100), default="admin@bhumi3d.gov.in")
    timestamp = Column(DateTime, default=datetime.utcnow)
