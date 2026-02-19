from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    companies = relationship("Company", back_populates="owner", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")


class Company(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    owner = relationship("User", back_populates="companies")
    applications = relationship("Application", back_populates="company", cascade="all, delete-orphan")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    job_title = Column(String(255), nullable=False)
    status = Column(String(50), default="Applied")  # Applied, Interview, Offer, Rejected
    applied_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    notes = Column(Text, default="")
    company_id = Column(Integer, ForeignKey("companies.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    company = relationship("Company", back_populates="applications")
    user = relationship("User", back_populates="applications")



class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    old_status = Column(String(50), nullable=False)
    new_status = Column(String(50), nullable=False)
    changed_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    application = relationship("Application")
    user = relationship("User")