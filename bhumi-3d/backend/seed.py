import sys
import os

# Add backend directory to sys.path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from datetime import datetime
from app.database import engine, SessionLocal, Base
from app.models import (
    User, Parcel, Building, Floor, Unit, UndergroundAsset,
    ULPINRecord, ValidationIssue, ProcessingJob, ActivityLog
)
from app.utils.auth import hash_password
from app.ulpin.generator import generate_3d_ulpin, generate_qr_code_base64

def seed_database():
    print("Recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Seeding Users...")
        admin = User(
            name="Admin Officer",
            email="admin@bhumi3d.gov.in",
            password_hash=hash_password("admin123"),
            role="administrator"
        )
        officer = User(
            name="Rajesh Kumar (DoLR Officer)",
            email="officer@bhumi3d.gov.in",
            password_hash=hash_password("officer123"),
            role="govt_officer"
        )
        surveyor = User(
            name="Suresh Nathan (Senior GIS Surveyor)",
            email="surveyor@bhumi3d.gov.in",
            password_hash=hash_password("surveyor123"),
            role="surveyor"
        )
        db.add_all([admin, officer, surveyor])
        db.commit()

        print("Seeding Land Parcels in Chennai...")
        # Base coordinates: Adyar, Chennai (13.0067° N, 80.2206° E)
        parcels_data = [
            {
                "parcel_id": "PCL-0001",
                "survey_number": "SY-104/2A",
                "area": 12500.0, # sq ft
                "latitude": 13.0067,
                "longitude": 80.2206,
                "elevation": 12.5,
                "village": "Adyar",
                "property_type": "Mixed Residential",
                "owner_name": "BHUMI Housing Development Corp",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [80.2200, 13.0062],
                        [80.2212, 13.0062],
                        [80.2212, 13.0072],
                        [80.2200, 13.0072],
                        [80.2200, 13.0062]
                    ]]
                }
            },
            {
                "parcel_id": "PCL-0002",
                "survey_number": "SY-104/2B",
                "area": 8400.0,
                "latitude": 13.0075,
                "longitude": 80.2218,
                "elevation": 12.8,
                "village": "Adyar",
                "property_type": "Commercial",
                "owner_name": "Cauvery Commercial Trust",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [80.2213, 13.0070],
                        [80.2223, 13.0070],
                        [80.2223, 13.0080],
                        [80.2213, 13.0080],
                        [80.2213, 13.0070]
                    ]]
                }
            },
            {
                "parcel_id": "PCL-0003",
                "survey_number": "SY-218/1",
                "area": 16200.0,
                "latitude": 13.0827,
                "longitude": 80.2707,
                "elevation": 14.2,
                "village": "Anna Nagar",
                "property_type": "Government Infrastructure",
                "owner_name": "Greater Chennai Corporation",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [80.2700, 13.0820],
                        [80.2715, 13.0820],
                        [80.2715, 13.0835],
                        [80.2700, 13.0835],
                        [80.2700, 13.0820]
                    ]]
                }
            },
            {
                "parcel_id": "PCL-0004",
                "survey_number": "SY-309/4C",
                "area": 9800.0,
                "latitude": 12.9789,
                "longitude": 80.2204,
                "elevation": 9.8,
                "village": "Velachery",
                "property_type": "Residential",
                "owner_name": "Velachery Co-op Housing Society",
                "geometry": {
                    "type": "Polygon",
                    "coordinates": [[
                        [80.2200, 12.9785],
                        [80.2208, 12.9785],
                        [80.2208, 12.9793],
                        [80.2200, 12.9793],
                        [80.2200, 12.9785]
                    ]]
                }
            }
        ]

        parcels_objs = []
        for pd in parcels_data:
            ulpin_str = generate_3d_ulpin(
                state="Tamil Nadu",
                district="Chennai",
                locality=pd["village"],
                survey_number=pd["survey_number"],
                parcel_number=pd["parcel_id"],
                lat=pd["latitude"],
                lon=pd["longitude"],
                elevation=pd["elevation"]
            )
            pcl = Parcel(
                parcel_id=pd["parcel_id"],
                ulpin=ulpin_str,
                survey_number=pd["survey_number"],
                area=pd["area"],
                latitude=pd["latitude"],
                longitude=pd["longitude"],
                elevation=pd["elevation"],
                state="Tamil Nadu",
                district="Chennai",
                taluk="Mylapore-Triplicane",
                village=pd["village"],
                property_type=pd["property_type"],
                owner_name=pd["owner_name"],
                geometry=pd["geometry"],
                status="Verified"
            )
            db.add(pcl)
            parcels_objs.append(pcl)
        db.commit()

        print("Seeding Buildings & Multi-storey Apartments...")
        # Building 1: BHUMI Residency on Parcel 1 (8 floors, 32 units)
        bhumi_bldg = Building(
            building_id="BLD-0001",
            parcel_id=parcels_objs[0].id,
            name="BHUMI Residency",
            height=26.5, # meters (approx 8 stories)
            floors_count=8,
            built_up_area=42000.0,
            ai_confidence=98.4,
            status="Verified",
            geometry={"type": "Polygon", "coordinates": [[[80.2202, 13.0064], [80.2210, 13.0064], [80.2210, 13.0070], [80.2202, 13.0070], [80.2202, 13.0064]]]}
        )
        # Building 2: Cauvery Heights on Parcel 2 (5 floors)
        cauvery_bldg = Building(
            building_id="BLD-0002",
            parcel_id=parcels_objs[1].id,
            name="Cauvery Heights",
            height=16.8,
            floors_count=5,
            built_up_area=22000.0,
            ai_confidence=95.2,
            status="Verified",
            geometry={"type": "Polygon", "coordinates": [[[80.2215, 13.0072], [80.2221, 13.0072], [80.2221, 13.0078], [80.2215, 13.0078], [80.2215, 13.0072]]]}
        )
        db.add_all([bhumi_bldg, cauvery_bldg])
        db.commit()

        print("Seeding Floors and Vertical Units for BHUMI Residency...")
        owners_list = [
            "Anand Chandrasekar", "Priya Sundaram", "Dr. K. Ramanathan", "Meena Krishnan",
            "Karthik Swaminathan", "Deepa Venkatesh", "Sanjay Raghavan", "Lakshmi Narayanan",
            "Vikram Sethuraman", "Radhika Balaji", "Ganesh Natesan", "Subhashini Varadhan"
        ]
        
        # 8 Floors for BHUMI Residency
        for f in range(1, 9):
            flr = Floor(
                building_id=bhumi_bldg.id,
                floor_number=f,
                height=3.2 * f, # floor height offset
                area=4800.0,
                status="Verified"
            )
            db.add(flr)
            db.commit()
            
            # 4 units per floor (A, B, C, D)
            unit_types = [
                ("A", 1250.0, "3 BHK Apartment"),
                ("B", 980.0, "2 BHK Apartment"),
                ("C", 1100.0, "2.5 BHK Apartment"),
                ("D", 890.0, "2 BHK Apartment")
            ]
            
            for idx, (letter, u_area, p_type) in enumerate(unit_types):
                unit_num = f"{letter}-{f}0{idx+1}"
                owner = owners_list[(f * 4 + idx) % len(owners_list)]
                u_ulpin = generate_3d_ulpin(
                    state="Tamil Nadu",
                    district="Chennai",
                    locality="Adyar",
                    survey_number="SY-104/2A",
                    parcel_number="PCL-0001",
                    building_id="BLD-0001",
                    floor_number=f,
                    unit_number=unit_num,
                    lat=13.0067,
                    lon=80.2206,
                    elevation=12.5 + (3.2 * f)
                )
                
                status_val = "Verified" if not (f == 7 and idx == 2) else "Conflict Mismatch"
                
                u_obj = Unit(
                    floor_id=flr.id,
                    unit_number=unit_num,
                    area=u_area,
                    property_type=p_type,
                    ulpin=u_ulpin,
                    ownership_status="Owned",
                    owner_name=owner,
                    status=status_val
                )
                db.add(u_obj)
                
                # Also save to ULPIN Record table
                u_rec = ULPINRecord(
                    ulpin=u_ulpin,
                    spatial_level="Vertical Unit (Apartment)",
                    state="Tamil Nadu",
                    district="Chennai",
                    locality="Adyar",
                    parcel_id="PCL-0001",
                    building_id="BLD-0001",
                    floor_id=str(f),
                    unit_id=unit_num,
                    latitude=13.0067,
                    longitude=80.2206,
                    elevation=12.5 + (3.2 * f),
                    qr_code_path=generate_qr_code_base64(u_ulpin)
                )
                db.add(u_rec)
        db.commit()

        print("Seeding Underground Subsurface Infrastructure Assets...")
        assets = [
            UndergroundAsset(
                asset_id="UG-WATER-00127",
                name="Adyar Main Water Pipeline Network",
                type="Water Pipeline",
                depth=4.8, # meters
                length=1.8, # km
                owner_agency="Chennai Metropolitan Water Supply and Sewerage Board (CMWSSB)",
                status="Operational",
                last_inspection="2026-08-12",
                geometry={"type": "LineString", "coordinates": [[80.2195, 13.0055], [80.2215, 13.0067], [80.2230, 13.0078]]}
            ),
            UndergroundAsset(
                asset_id="UG-SEWER-0084",
                name="Adyar Trunk Sewerage Line",
                type="Sewage Pipeline",
                depth=6.2,
                length=2.4,
                owner_agency="CMWSSB",
                status="Operational",
                last_inspection="2026-07-28",
                geometry={"type": "LineString", "coordinates": [[80.2190, 13.0052], [80.2210, 13.0064], [80.2225, 13.0075]]}
            ),
            UndergroundAsset(
                asset_id="UG-POWER-00312",
                name="TANGEDCO 33kV Underground Power Conduit",
                type="Electrical Cable",
                depth=2.2,
                length=3.1,
                owner_agency="Tamil Nadu Generation and Distribution Corporation (TANGEDCO)",
                status="Operational",
                last_inspection="2026-08-04",
                geometry={"type": "LineString", "coordinates": [[80.2201, 13.0061], [80.2218, 13.0069], [80.2235, 13.0081]]}
            ),
            UndergroundAsset(
                asset_id="UG-METRO-LINE2",
                name="Chennai Metro Phase-2 Underground Tunnel",
                type="Tunnel / Metro",
                depth=18.5,
                length=8.6,
                owner_agency="Chennai Metro Rail Limited (CMRL)",
                status="Operational",
                last_inspection="2026-08-18",
                geometry={"type": "LineString", "coordinates": [[80.2180, 13.0040], [80.2220, 13.0070], [80.2260, 13.0100]]}
            )
        ]
        db.add_all(assets)
        db.commit()

        print("Seeding Intelligent Topology Validation Issues...")
        issues = [
            ValidationIssue(
                entity_type="Unit",
                entity_id="A-703",
                issue_type="Boundary Mismatch",
                severity="Warning",
                description="Unit A-703 floor area in building plan (1100 sq.ft) deviates by 2.4% from drone 3D point cloud scan.",
                status="Open"
            ),
            ValidationIssue(
                entity_type="Parcel",
                entity_id="PCL-0002",
                issue_type="Parcel Overlap",
                severity="Critical",
                description="Spatial polygon for PCL-0002 overlaps by 0.8 meters with public road reserve buffer.",
                status="Open"
            ),
            ValidationIssue(
                entity_type="Floor",
                entity_id="BLD-0001-F04",
                issue_type="Elevation Bounds Mismatch",
                severity="Info",
                description="Floor 4 slab thickness sensor report shows 0.15m height variance from original structural drawing.",
                status="Open"
            )
        ]
        db.add_all(issues)
        db.commit()

        print("Seeding Initial Activity Logs...")
        logs = [
            ActivityLog(action="SYSTEM_INIT", title="BHUMI³D System Started", description="Initialized 3D Cadastral Intelligence Platform database."),
            ActivityLog(action="GENERATE_ULPIN", title="3D ULPIN Generated", description="Generated ULPIN IN-TN-CHN-ADY-00482-B03-F07-U21-X7 for BHUMI Residency Unit A-703."),
            ActivityLog(action="AI_PROCESSING", title="Drone Scan AI Segmentation", description="Extracted 4 multi-storey building footprints with 96.4% confidence score.")
        ]
        db.add_all(logs)
        db.commit()

        print("[SUCCESS] Database seeding completed successfully!")

    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
