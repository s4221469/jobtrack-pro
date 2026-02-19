from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import users, companies, applications, dashboard

Base.metadata.create_all(bind=engine)

app = FastAPI(title="JobTrack Pro API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(companies.router, prefix="/api/companies", tags=["Companies"])
app.include_router(applications.router, prefix="/api/applications", tags=["Applications"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["Dashboard"])


@app.get("/")
def root():
    return {"message": "JobTrack Pro API"}
