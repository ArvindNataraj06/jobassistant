from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.profile import Profile
from app.schemas.profile import ProfileUpdate, ProfileResponse
from app.routes.auth import get_current_user
from app.models.user import User

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/", response_model=ProfileResponse)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return profile

@router.patch("/", response_model=ProfileResponse)
def update_profile(
    profile_data: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(
        Profile.user_id == current_user.id
    ).first()

    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)

    update_data = profile_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile