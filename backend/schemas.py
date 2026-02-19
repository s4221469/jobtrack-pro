from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional


# --- User ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str


# --- Company ---
class CompanyCreate(BaseModel):
    name: str


class CompanyOut(BaseModel):
    id: int
    name: str
    user_id: int

    class Config:
        from_attributes = True


# --- Application ---
class ApplicationCreate(BaseModel):
    job_title: str
    status: str = "Applied"
    notes: str = ""
    company_id: int


class ApplicationUpdate(BaseModel):
    job_title: Optional[str] = None
    status: Optional[str] = None
    notes: Optional[str] = None
    company_id: Optional[int] = None


class ApplicationOut(BaseModel):
    id: int
    job_title: str
    status: str
    applied_date: datetime
    notes: str
    company_id: int
    user_id: int
    company: CompanyOut

    class Config:
        from_attributes = True


# --- Paginated Applications ---
class PaginatedApplications(BaseModel):
    items: list[ApplicationOut]
    total: int
    page: int
    per_page: int
    pages: int


# --- Activity Log ---
class ActivityLogOut(BaseModel):
    id: int
    application_id: int
    old_status: str
    new_status: str
    changed_at: datetime
    job_title: str = ""
    company_name: str = ""

    class Config:
        from_attributes = True

# --- Dashboard ---
class DashboardOut(BaseModel):
    total: int
    applied: int
    interview: int
    offer: int
    rejected: int
    conversion_rate: float
    recent: list[ApplicationOut]
    recent_activity: list[ActivityLogOut]