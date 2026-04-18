from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto") #sets up bcrypt as the hashing algorithm for passwords. It also marks it as not deprecated, meaning it's still considered secure and recommended for use.

def hash_password(password: str) -> str:
    return pwd_context.hash(password) #takes a plain text password and returns a hashed version 

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password) # when someone logs in this function hashes the new provided password and compare with saved hashed password

def create_access_token(data: dict) -> str: #iif both password is correct it creates a JWT token 
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    to_encode.update({"exp": expire})
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )

def verify_token(token: str) -> str | None: #every protected route calls this function to verify the token sent by the client. It decodes the token using the secret key and algorithm, checks if it's valid and not expired, and returns the user ID if successful. If the token is invalid or expired, it returns None.
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        user_id: str = payload.get("sub")
        if user_id is None:
            return None
        return user_id
    except JWTError:
        return None