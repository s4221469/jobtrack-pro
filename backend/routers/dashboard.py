from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import DashboardOut
from auth import get_current_user
from services.analytics_service import get_dashboard_data

router = APIRouter()


@router.get("/", response_model=DashboardOut)
def dashboard(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return get_dashboard_data(user.id, db)
