from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Company, User
from schemas import CompanyCreate, CompanyOut
from auth import get_current_user

router = APIRouter()


@router.post("/", response_model=CompanyOut, status_code=201)
def create_company(company: CompanyCreate, db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    new_company = Company(name=company.name, user_id=user.id)
    db.add(new_company)
    db.commit()
    db.refresh(new_company)
    return new_company


@router.get("/", response_model=list[CompanyOut])
def get_companies(db: Session = Depends(get_db), user: User = Depends(get_current_user)):
    return db.query(Company).filter(Company.user_id == user.id).all()
