from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import ValidationIssue, ActivityLog
from app.schemas import ValidationIssueOut, ValidationResolveRequest

router = APIRouter(prefix="/validation", tags=["Topology Validation"])

@router.get("/issues", response_model=List[ValidationIssueOut])
def get_validation_issues(status: Optional[str] = None, db: Session = Depends(get_db)):
    q = db.query(ValidationIssue)
    if status:
        q = q.filter(ValidationIssue.status == status)
    return q.order_by(ValidationIssue.id.desc()).all()

@router.post("/run")
def run_topology_validation(db: Session = Depends(get_db)):
    """
    Simulates automated topological rules engine check:
    1. Parcel spatial overlap check
    2. Air-rights & floor height bounds mismatch
    3. Duplicate ULPIN verification
    4. Coordinate precision check
    """
    # Count open issues
    critical_cnt = db.query(ValidationIssue).filter(ValidationIssue.severity == "Critical", ValidationIssue.status == "Open").count()
    warning_cnt = db.query(ValidationIssue).filter(ValidationIssue.severity == "Warning", ValidationIssue.status == "Open").count()
    info_cnt = db.query(ValidationIssue).filter(ValidationIssue.severity == "Info", ValidationIssue.status == "Open").count()
    
    db.add(ActivityLog(
        action="TOPOLOGY_VALIDATION",
        title="Topology Audit Executed",
        description=f"Automated 3D cadastral topology validation completed. Found {critical_cnt} critical, {warning_cnt} warnings."
    ))
    db.commit()
    
    return {
        "validation_score": 94.7,
        "critical_issues": critical_cnt,
        "warnings": warning_cnt,
        "info_issues": info_cnt,
        "validated_properties": 8721,
        "status": "Audit Complete"
    }

@router.put("/{id}/resolve", response_model=ValidationIssueOut)
def resolve_issue(id: int, req: ValidationResolveRequest, db: Session = Depends(get_db)):
    issue = db.query(ValidationIssue).filter(ValidationIssue.id == id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Validation issue not found")
        
    issue.status = req.status
    db.commit()
    db.refresh(issue)
    
    db.add(ActivityLog(
        action="RESOLVE_ISSUE",
        title="Validation Conflict Resolved",
        description=f"Resolved issue #{id} ({issue.issue_type}) marked as {req.status}"
    ))
    db.commit()
    
    return issue
