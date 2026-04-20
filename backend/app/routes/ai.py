from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from groq import Groq
from app.database import get_db
from app.models.job import Job
from app.models.message import Message
from app.schemas.message import MessageCreate, MessageResponse, ChatResponse
from app.routes.auth import get_current_user
from app.models.user import User
from app.config import settings

router = APIRouter(prefix="/ai", tags=["AI"])

client = Groq(api_key=settings.GROQ_API_KEY)

async def call_groq(system_prompt: str, messages: list) -> str:
    try:
        formatted_messages = [
            {"role": "system", "content": system_prompt}
        ]
        for msg in messages:
            formatted_messages.append({
                "role": msg["role"],
                "content": msg["content"]
            })

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=formatted_messages,
            max_tokens=1024,
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI service error: {str(e)}"
        )


@router.post("/cover-letter/{job_id}")
async def generate_cover_letter(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    system_prompt = """You are an expert career coach with 15 years of experience 
helping developers land jobs at top tech companies. You write cover letters that:
- Sound human and genuine, not AI-generated
- Are specific to the company and role, not generic
- Highlight technical skills with concrete examples
- Show personality and genuine enthusiasm
- Are concise and impactful — every sentence earns its place
- End with a confident call to action

Format the letter professionally with proper paragraphs.
Never use placeholder text. Always use the exact name provided."""

    messages = [
    {
        "role": "user",
        "content": f"""Write a compelling cover letter for this position.

POSITION DETAILS:
- Company: {job.company}
- Role: {job.role}
- Job Description: {job.description}

CANDIDATE:
- Full Name: {current_user.name}
- Background: Master's student in Applied Computer Science in Germany
- Key Skills: React.js, JavaScript, Python, FastAPI, PostgreSQL, Docker, CI/CD, Jest, Cypress
- Experience: Software Developer intern at DeepInsightsX Berlin, building AI-driven web apps
- Current Project: AI-powered traffic monitoring dashboard (Master's thesis)
- Strengths: Frontend development, testing, Agile workflows, startup experience

INSTRUCTIONS:
1. Opening: Strong hook that shows genuine interest in {job.company} specifically
2. Paragraph 2: Why {job.company} — show you know the company, connect their mission to your goals  
3. Paragraph 3: Match YOUR skills directly to THEIR requirements from the job description
4. Closing: Confident, specific call to action
5. Sign off with: {current_user.name}

Make it sound like a real person wrote it, not an AI. Be specific, not generic."""
    }
]

    cover_letter = await call_groq(system_prompt, messages)
    return {"cover_letter": cover_letter, "job_id": job_id}


@router.post("/chat/{job_id}", response_model=ChatResponse)
async def chat_about_job(
    job_id: str,
    message_data: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    history = db.query(Message).filter(
        Message.job_id == job_id
    ).order_by(Message.created_at).all()

    messages = [
        {"role": msg.role, "content": msg.content}
        for msg in history
    ]

    messages.append({
        "role": "user",
        "content": message_data.content
    })

    system_prompt = f"""You are a helpful career assistant helping {current_user.name} 
    with their job application to {job.company} for the role of {job.role}.
    
Job Description: {job.description}

Help with: interview preparation, cover letters, salary negotiation, 
company research, and application strategy. Be specific and practical."""

    ai_response = await call_groq(system_prompt, messages)

    user_message = Message(
        job_id=job_id,
        user_id=current_user.id,
        role="user",
        content=message_data.content
    )
    db.add(user_message)

    assistant_message = Message(
        job_id=job_id,
        user_id=current_user.id,
        role="assistant",
        content=ai_response
    )
    db.add(assistant_message)
    db.commit()
    db.refresh(user_message)
    db.refresh(assistant_message)

    return {
        "user_message": user_message,
        "assistant_message": assistant_message
    }


@router.get("/chat/{job_id}", response_model=List[MessageResponse])
def get_chat_history(
    job_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    job = db.query(Job).filter(
        Job.id == job_id,
        Job.user_id == current_user.id
    ).first()

    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )

    messages = db.query(Message).filter(
        Message.job_id == job_id
    ).order_by(Message.created_at).all()

    return messages