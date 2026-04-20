from pydantic import BaseModel
from datetime import datetime
from uuid import UUID
from typing import Optional

class MessageCreate(BaseModel):
    content: str

class MessageResponse(BaseModel):
    id: UUID
    job_id: UUID
    user_id: UUID
    role: str
    content: str
    created_at: datetime

    class Config:
        from_attributes = True

class ChatResponse(BaseModel):
    user_message: MessageResponse
    assistant_message: MessageResponse