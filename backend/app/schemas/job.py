from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class JobCreate(BaseModel):
    company: str
    role: str
    description: Optional[str] = None
    status: Optional[str] = "saved"

class JobUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None

class JobResponse(BaseModel):
    id: UUID
    user_id: UUID
    company: str
    role: str
    description: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True