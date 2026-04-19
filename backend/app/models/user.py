from sqlalchemy import Column, String, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base
from datetime import datetime
import uuid

#after seeing this class SQLA1chemy creates the actual table in PostgreSQL with the name "users" and the columns defined below. The id column is a UUID which is a unique identifier, email is a string that must be unique and not null, hashed_password is a string that cannot be null, name is a string that cannot be null, and created_at is a DateTime that defaults to the current time when a new user is created.
class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    name = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    jobs = relationship("Job", back_populates="owner")