from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from pydantic import BaseModel, EmailStr
from typing import Optional
import uuid
from datetime import datetime
from ..utils.auth import verify_password, get_password_hash, create_access_token
from ..utils.dependencies import get_current_user
import os

router = APIRouter(prefix="/auth", tags=["Authentication"])

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str
    phone: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict

from ..server import db

@router.post("/register", response_model=Token)
async def register(user_data: UserRegister):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create user
    user_id = str(uuid.uuid4())
    hashed_password = get_password_hash(user_data.password)
    
    user = {
        "_id": user_id,
        "name": user_data.name,
        "email": user_data.email,
        "password": hashed_password,
        "role": user_data.role,
        "phone": user_data.phone,
        "created_at": datetime.utcnow()
    }
    
    # If student, create student record
    if user_data.role == "student":
        student_count = await db.students.count_documents({})
        student_id = f"S{(student_count + 1):03d}"
        user["studentId"] = student_id
    
    await db.users.insert_one(user)
    
    # Create access token
    access_token = create_access_token(data={"sub": user_id})
    
    # Remove password from response
    user.pop("password")
    user["id"] = user.pop("_id")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.post("/login", response_model=Token)
async def login(credentials: UserLogin):
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Verify password
    if not verify_password(credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    
    # Create access token
    access_token = create_access_token(data={"sub": user["_id"]})
    
    # Remove password from response
    user.pop("password")
    user["id"] = user.pop("_id")
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

@router.get("/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    user = current_user.copy()
    user.pop("password", None)
    user["id"] = user.pop("_id", user.get("id"))
    return user