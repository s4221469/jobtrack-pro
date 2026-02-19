# JobTrack Pro

A full-stack Job Application Tracking Platform to manage your job search — track applications, monitor statuses, and visualize your progress.

Built with FastAPI + React + PostgreSQL, fully containerized with Docker.

![Python](https://img.shields.io/badge/Python-3.11-blue) ![React](https://img.shields.io/badge/React-18-61dafb) ![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791) ![Docker](https://img.shields.io/badge/Docker-Compose-2496ED)

## Features

- **Authentication** — Register & Login with JWT tokens
- **Company Management** — Add and track companies you're applying to
- **Application Tracking** — Create, update status, delete applications
- **Status Workflow** — Applied → Interview → Offer / Rejected
- **Analytics Dashboard** — Stats cards, pie chart, bar chart (Recharts)
- **Activity Log** — Automatic tracking of every status change
- **Search & Filter** — Filter by status, company, or keyword
- **CSV Export** — Download all applications as a spreadsheet
- **Pagination** — Handles large application lists
- **Toast Notifications** — Feedback on every action
- **Confirmation Modals** — Safe deletion with confirm dialogs
- **Responsive Design** — Sidebar layout, works on mobile

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Backend  | Python, FastAPI, SQLAlchemy, Passlib, JWT |
| Frontend | React 18, React Router, Recharts, Axios |
| Database | PostgreSQL 15                       |
| DevOps   | Docker, Docker Compose              |

## Quick Start
```bash
git clone https://github.com/YOUR_USERNAME/jobtrack-pro.git
cd jobtrack-pro
docker-compose up --build
```

| Service    | URL                        |
|------------|----------------------------|
| Frontend   | http://localhost:3000       |
| Backend API| http://localhost:8000       |
| API Docs   | http://localhost:8000/docs  |

## Database Credentials

| Field    | Value       |
|----------|-------------|
| User     | jobtrack    |
| Password | jobtrack123 |
| Database | jobtrackdb  |

## Usage

1. Open http://localhost:3000
2. Register a new account
3. Go to **Add New** → add companies, then add applications
4. Go to **Applications** → filter, search, update statuses, export CSV
5. **Dashboard** shows analytics, charts, and activity log

## Project Structure
```
backend/
├── main.py              # FastAPI app entry
├── database.py          # DB connection
├── models.py            # SQLAlchemy models
├── schemas.py           # Pydantic schemas
├── auth.py              # JWT + password hashing
├── routers/
│   ├── users.py         # Register & Login
│   ├── companies.py     # Company CRUD
│   ├── applications.py  # Application CRUD + export
│   └── dashboard.py     # Analytics endpoint
└── services/
    └── analytics_service.py

frontend/
├── src/
│   ├── App.js           # Routing + sidebar layout
│   ├── api.js           # Axios instance
│   ├── styles.css       # Global styles
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Applications.jsx
│   │   ├── AddNew.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   └── components/
│       ├── ApplicationTable.jsx
│       ├── ApplicationForm.jsx
│       ├── CompanyForm.jsx
│       ├── Toast.jsx
│       ├── ConfirmModal.jsx
│       └── Icons.jsx

docker-compose.yml
.env.example
```

## License

MIT
