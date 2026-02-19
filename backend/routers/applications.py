import csv
import io
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import or_
from database import get_db
from models import Application, ActivityLog, User
from schemas import ApplicationCreate, ApplicationUpdate, ApplicationOut, PaginatedApplications
from auth import get_current_user

router = APIRouter()


@router.post("/", response_model=ApplicationOut, status_code=201)
def create_application(app: ApplicationCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_app = Application(
        job_title=app.job_title,
        status=app.status,
        notes=app.notes,
        company_id=app.company_id,
        user_id=user.id,
    )
    db.add(new_app)
    db.commit()
    db.refresh(new_app)
    return db.query(Application).options(joinedload(Application.company)).filter(Application.id == new_app.id).first()


@router.get("/", response_model=PaginatedApplications)
def get_applications(
    page: int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    status: str = Query(None),
    company_id: int = Query(None),
    search: str = Query(None),
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user),
):
    query = db.query(Application).options(joinedload(Application.company)).filter(Application.user_id == user.id)

    if status:
        query = query.filter(Application.status == status)
    if company_id:
        query = query.filter(Application.company_id == company_id)
    if search:
        query = query.filter(
            or_(
                Application.job_title.ilike(f"%{search}%"),
                Application.notes.ilike(f"%{search}%"),
            )
        )

    total = query.count()
    pages = max((total + per_page - 1) // per_page, 1)
    items = query.order_by(Application.applied_date.desc()).offset((page - 1) * per_page).limit(per_page).all()

    return {"items": items, "total": total, "page": page, "per_page": per_page, "pages": pages}


@router.put("/{app_id}", response_model=ApplicationOut)
def update_application(app_id: int, updates: ApplicationUpdate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id, Application.user_id == user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    # Log status change
    if updates.status and updates.status != app.status:
        log = ActivityLog(
            application_id=app.id,
            user_id=user.id,
            old_status=app.status,
            new_status=updates.status,
        )
        db.add(log)

    for key, value in updates.model_dump(exclude_unset=True).items():
        setattr(app, key, value)
    db.commit()
    db.refresh(app)
    return db.query(Application).options(joinedload(Application.company)).filter(Application.id == app.id).first()


@router.delete("/{app_id}", status_code=204)
def delete_application(app_id: int, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    app = db.query(Application).filter(Application.id == app_id, Application.user_id == user.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    db.delete(app)
    db.commit()


@router.get("/export")
def export_csv(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    apps = (
        db.query(Application)
        .options(joinedload(Application.company))
        .filter(Application.user_id == user.id)
        .order_by(Application.applied_date.desc())
        .all()
    )

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Job Title", "Company", "Status", "Applied Date", "Notes"])
    for a in apps:
        writer.writerow([a.job_title, a.company.name, a.status, a.applied_date.strftime("%Y-%m-%d"), a.notes])
    output.seek(0)

    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=applications.csv"},
    )