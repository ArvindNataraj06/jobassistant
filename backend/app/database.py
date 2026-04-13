from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

engine = create_engine(settings.DATABASE_URL) # is the actual connection to the database postgreSQL

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine) # is a factory that creates database sessions - like session opening and closing a conversation with the DB.

Base = declarative_base()

#this is the fuction FastAPI will use to automatically open DB Session for request and close when done.  

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()