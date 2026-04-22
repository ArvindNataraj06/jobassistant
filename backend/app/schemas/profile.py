from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class ProfileUpdate(BaseModel):
    current_role: Optional[str] = None
    skills: Optional[str] = None
    experience: Optional[str] = None
    education: Optional[str] = None
    bio: Optional[str] = None

class ProfileResponse(BaseModel):
    id: UUID
    user_id: UUID
    current_role: Optional[str]
    skills: Optional[str]
    experience: Optional[str]
    education: Optional[str]
    bio: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True