import os
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ActivityLog

router = APIRouter(prefix="/data", tags=["Data Upload & Management"])

UPLOAD_DIR = "./uploaded_data"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_data_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    allowed_exts = [".jpg", ".jpeg", ".png", ".geojson", ".kml", ".csv", ".las", ".laz", ".tiff", ".tif", ".pdf"]
    ext = os.path.splitext(file.filename)[1].lower()
    
    if ext not in allowed_exts:
        raise HTTPException(status_code=400, detail=f"Unsupported file format '{ext}'. Allowed: {', '.join(allowed_exts)}")
        
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    contents = await file.read()
    
    with open(file_path, "wb") as f:
        f.write(contents)
        
    db.add(ActivityLog(
        action="FILE_UPLOAD",
        title="Spatial Dataset Uploaded",
        description=f"Uploaded {file.filename} ({len(contents) / 1024:.1f} KB)"
    ))
    db.commit()
    
    return {
        "status": "Success",
        "filename": file.filename,
        "size_bytes": len(contents),
        "file_type": ext[1:].upper(),
        "path": file_path,
        "message": f"Successfully parsed and ingested {file.filename}"
    }

@router.get("/files")
def list_uploaded_files():
    if not os.path.exists(UPLOAD_DIR):
        return []
    files = []
    for f in os.listdir(UPLOAD_DIR):
        p = os.path.join(UPLOAD_DIR, f)
        if os.path.isfile(p):
            files.append({
                "filename": f,
                "size_bytes": os.path.getsize(p),
                "file_type": os.path.splitext(f)[1].replace(".", "").upper()
            })
    return files
