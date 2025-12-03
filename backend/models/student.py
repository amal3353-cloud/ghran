from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class StudentBase(BaseModel):
    name: str
    stage: str  # first_middle, second_middle, third_middle
    class_name: str = Field(alias="class")  # أ، ب، ج

class StudentCreate(StudentBase):
    pass

class Student(StudentBase):
    id: str = Field(alias="_id")
    totalPoints: int = 0
    email: Optional[str] = None
    userId: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_schema_extra = {
            "example": {
                "name": "فاطمة علي",
                "stage": "first_middle",
                "class": "أ",
                "totalPoints": 85
            }
        }

class StudentImport(BaseModel):
    stage: str
    class_name: str = Field(alias="class")
    names: list[str]