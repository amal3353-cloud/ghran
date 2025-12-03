from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class BehaviorBase(BaseModel):
    studentId: str
    type: str  # positive, negative
    description: str
    points: int

class BehaviorCreate(BehaviorBase):
    pass

class Behavior(BehaviorBase):
    id: str = Field(alias="_id")
    teacherId: str
    teacherName: str
    date: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "studentId": "507f1f77bcf86cd799439011",
                "type": "positive",
                "description": "مشاركة فعالة في الحصة",
                "points": 10,
                "teacherId": "507f1f77bcf86cd799439012",
                "teacherName": "نورة أحمد"
            }
        }