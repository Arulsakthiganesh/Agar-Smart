from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ProcessingJob, ActivityLog
from app.schemas import ProcessingJobOut
from app.ai.pipeline import process_drone_image_simulation

router = APIRouter(prefix="/ai", tags=["AI Geospatial Intelligence"])

@router.post("/analyze-image", response_model=ProcessingJobOut)
async def analyze_image(
    file: Optional[UploadFile] = File(None),
    job_type: str = Form("Drone Image Building Extraction"),
    db: Session = Depends(get_db)
):
    contents = None
    filename = "demo_drone_scan_adyar.jpg"
    if file:
        filename = file.filename
        contents = await file.read()
        
    result = process_drone_image_simulation(contents, filename)
    
    job = ProcessingJob(
        filename=filename,
        job_type=job_type,
        status="Completed",
        progress=100,
        result=result,
        confidence_scores={
            "building_detection": 96.4,
            "parcel_boundary": 97.1,
            "floor_segmentation": 93.7,
            "topology_validation": 98.2
        }
    )
    
    db.add(job)
    db.commit()
    db.refresh(job)
    
    db.add(ActivityLog(
        action="AI_ANALYSIS",
        title="AI Drone Image Analyzed",
        description=f"Completed {job_type} for {filename} with 96.4% building confidence"
    ))
    db.commit()
    
    return job

@router.get("/jobs", response_model=List[ProcessingJobOut])
def get_processing_jobs(db: Session = Depends(get_db)):
    jobs = db.query(ProcessingJob).order_by(ProcessingJob.id.desc()).all()
    return jobs

@router.get("/jobs/{id}", response_model=ProcessingJobOut)
def get_processing_job_by_id(id: int, db: Session = Depends(get_db)):
    job = db.query(ProcessingJob).filter(ProcessingJob.id == id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job
