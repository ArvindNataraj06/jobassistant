from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.models import User, Job, Message
from app.routes.auth import router as auth_router
from app.routes.jobs import router as jobs_router
from app.routes.ai import router as ai_router

app = FastAPI(title="Job Assistant API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173",
                   "http://localhost:5174"
                   "http://localhost:5175",
                   ], # By default browsers block cross-origin requests for security reasons. This middleware allows requests from the specified origin (your frontend) to access the backend API.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine) # This line creates all the tables in the database based on the models defined using SQLAlchemy's declarative base. It checks if the tables already exist and creates them if they don't. This is typically done at application startup to ensure the database schema is in place before handling any requests.

app.include_router(auth_router)
app.include_router(jobs_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Job Assistant API is running!"}

@app.get("/health")
def health():
    return {"status": "healthy"}