from fastapi import APIRouter, HTTPException, Depends, Query
from typing import Optional, List
from pydantic import BaseModel
import uuid
from datetime import datetime
from ..utils.dependencies import get_current_user
from ..server import db

router = APIRouter(prefix="/students", tags=["Students"])

class StudentCreate(BaseModel):
    name: str
    stage: str
    class_name: str

class StudentImport(BaseModel):
    stage: str
    class_name: str
    names: List[str]

class StudentRestore(BaseModel):
    student_id: str

@router.get("")
async def get_students(
    stage: Optional[str] = None,
    class_name: Optional[str] = Query(None, alias="class"),
    search: Optional[str] = None,
    current_user: dict = Depends(get_current_user)
):
    query = {"deleted_at": {"$exists": False}}
    
    if stage and stage != "all":
        query["stage"] = stage
    if class_name and class_name != "all":
        query["class"] = class_name
    if search:
        query["name"] = {"$regex": search, "$options": "i"}
    
    students = await db.students.find(query).sort("name", 1).to_list(1000)
    
    # Convert _id to id
    for student in students:
        student["id"] = student.pop("_id")
    
    return students

@router.post("")
async def create_student(
    student_data: StudentCreate,
    current_user: dict = Depends(get_current_user)
):
    # Only principal and teachers can add students
    if current_user["role"] not in ["principal", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    student_count = await db.students.count_documents({})
    student_id = f"S{(student_count + 1):03d}"
    
    student = {
        "_id": student_id,
        "name": student_data.name,
        "stage": student_data.stage,
        "class": student_data.class_name,
        "totalPoints": 0,
        "created_at": datetime.utcnow()
    }
    
    await db.students.insert_one(student)
    student["id"] = student.pop("_id")
    
    return student

@router.post("/import")
async def import_students(
    import_data: StudentImport,
    current_user: dict = Depends(get_current_user)
):
    # Only principal and teachers can import
    if current_user["role"] not in ["principal", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    student_count = await db.students.count_documents({})
    students = []
    
    for i, name in enumerate(import_data.names):
        if not name or len(name.strip()) < 2:
            continue
        
        student_id = f"S{(student_count + i + 1):03d}"
        student = {
            "_id": student_id,
            "name": name.strip(),
            "stage": import_data.stage,
            "class": import_data.class_name,
            "totalPoints": 0,
            "created_at": datetime.utcnow()
        }
        students.append(student)
    
    if students:
        await db.students.insert_many(students)
    
    return {"count": len(students), "message": f"تم استيراد {len(students)} طالبة بنجاح"}

@router.delete("/{student_id}")
async def delete_student(
    student_id: str,
    current_user: dict = Depends(get_current_user)
):
    # Only principal and teachers can delete
    if current_user["role"] not in ["principal", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    # Soft delete - mark as deleted instead of removing
    result = await db.students.update_one(
        {"_id": student_id},
        {
            "$set": {
                "deleted_at": datetime.utcnow(),
                "deleted_by": current_user["_id"]
            }
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"message": "تم حذف الطالبة بنجاح"}

@router.post("/restore")
async def restore_student(
    restore_data: StudentRestore,
    current_user: dict = Depends(get_current_user)
):
    # Only principal and teachers can restore
    if current_user["role"] not in ["principal", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    result = await db.students.update_one(
        {"_id": restore_data.student_id},
        {"$unset": {"deleted_at": "", "deleted_by": ""}}
    )
    
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return {"message": "تم استعادة الطالبة بنجاح"}

@router.get("/deleted")
async def get_deleted_students(
    current_user: dict = Depends(get_current_user)
):
    # Only principal and teachers can view deleted
    if current_user["role"] not in ["principal", "teacher"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    
    students = await db.students.find(
        {"deleted_at": {"$exists": True}}
    ).sort("deleted_at", -1).to_list(100)
    
    for student in students:
        student["id"] = student.pop("_id")
    
    return students