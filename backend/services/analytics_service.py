from sqlalchemy.orm import Session, joinedload
from models import Application, ActivityLog


def get_dashboard_data(user_id: int, db: Session) -> dict:
    apps = (
        db.query(Application)
        .options(joinedload(Application.company))
        .filter(Application.user_id == user_id)
        .order_by(Application.applied_date.desc())
        .all()
    )

    total = len(apps)
    applied = sum(1 for a in apps if a.status == "Applied")
    interview = sum(1 for a in apps if a.status == "Interview")
    offer = sum(1 for a in apps if a.status == "Offer")
    rejected = sum(1 for a in apps if a.status == "Rejected")
    conversion_rate = round((offer / total) * 100, 1) if total > 0 else 0.0

    logs = (
        db.query(ActivityLog)
        .options(joinedload(ActivityLog.application).joinedload(Application.company))
        .filter(ActivityLog.user_id == user_id)
        .order_by(ActivityLog.changed_at.desc())
        .limit(10)
        .all()
    )

    recent_activity = []
    for log in logs:
        recent_activity.append({
            "id": log.id,
            "application_id": log.application_id,
            "old_status": log.old_status,
            "new_status": log.new_status,
            "changed_at": log.changed_at,
            "job_title": log.application.job_title if log.application else "Deleted",
            "company_name": log.application.company.name if log.application and log.application.company else "Unknown",
        })

    return {
        "total": total,
        "applied": applied,
        "interview": interview,
        "offer": offer,
        "rejected": rejected,
        "conversion_rate": conversion_rate,
        "recent": apps[:5],
        "recent_activity": recent_activity,
    }