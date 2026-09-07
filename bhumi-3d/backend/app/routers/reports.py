from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel
from app.utils.pdf_generator import generate_ulpin_certificate_pdf

router = APIRouter(prefix="/reports", tags=["PDF Reports & Certificates"])

class ULPINReportRequest(BaseModel):
    ulpin: str = "IN-TN-CHN-ADY-00482-B03-F07-U21-X7"
    spatial_level: str = "Vertical Unit (Apartment)"
    state: str = "Tamil Nadu"
    district: str = "Chennai"
    locality: str = "Adyar (Ward 174)"
    parcel_id: str = "PCL-0001 (SY-104/2A)"
    building_name: str = "BHUMI Residency"
    floor_number: int = 7
    unit_number: str = "A-703"
    latitude: float = 13.0067
    longitude: float = 80.2206
    elevation: float = 33.5

@router.post("/ulpin-certificate")
def download_ulpin_certificate(req: ULPINReportRequest):
    pdf_bytes = generate_ulpin_certificate_pdf(req.dict())
    
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename=BHUMI3D_Certificate_{req.ulpin}.pdf"
        }
    )
