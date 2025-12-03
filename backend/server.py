from fastapi import FastAPI, APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone, timedelta
import bcrypt
import jwt


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT Secret
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Security
security = HTTPBearer()

# ==================== Models ====================

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    name: str
    role: str = "teacher"  # teacher or admin
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str
    role: str = "teacher"

class UserLogin(BaseModel):
    email: EmailStr
    password: str
    remember_me: bool = False

class LoginResponse(BaseModel):
    token: str
    user: User

class Student(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    class_name: str
    student_id: str
    behavior_points: int = 0
    achievements: List[str] = []
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StudentCreate(BaseModel):
    name: str
    class_name: str
    student_id: str

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None
    student_id: Optional[str] = None
    behavior_points: Optional[int] = None
    achievements: Optional[List[str]] = None

class DeletedStudent(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    original_student: dict
    deleted_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    deleted_by: str

class BehaviorRecord(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    student_id: str
    student_name: str
    behavior_type: str  # positive, negative
    points: int
    description: str
    teacher_id: str
    teacher_name: str
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BehaviorRecordCreate(BaseModel):
    student_id: str
    behavior_type: str
    points: int
    description: str

class Teacher(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    subject: str
    is_fake: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class TeacherCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    is_fake: bool = False

class Statistics(BaseModel):
    total_students: int = 0
    total_behavior_records: int = 0
    average_points: float = 0.0
    top_students: List[dict] = []

# ==================== Helper Functions ====================

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def create_token(user_id: str, remember_me: bool = False) -> str:
    expires = timedelta(days=30 if remember_me else 1)
    payload = {
        'user_id': user_id,
        'exp': datetime.now(timezone.utc) + expires
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get('user_id')
        
        user = await db.users.find_one({"id": user_id}, {"_id": 0})
        if not user:
            raise HTTPException(status_code=401, detail="مستخدم غير موجود")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="انتهت صلاحية الجلسة")
    except Exception:
        raise HTTPException(status_code=401, detail="غير مصرح")

# ==================== Auth Routes ====================

@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="البريد الإلكتروني مسجل مسبقاً")
    
    # Create user
    user = User(
        email=user_data.email,
        name=user_data.name,
        role=user_data.role
    )
    
    # Hash password and store
    user_doc = user.model_dump()
    user_doc['password'] = hash_password(user_data.password)
    user_doc['created_at'] = user_doc['created_at'].isoformat()
    
    await db.users.insert_one(user_doc)
    return user

@api_router.post("/auth/login", response_model=LoginResponse)
async def login(credentials: UserLogin):
    # Find user
    user_doc = await db.users.find_one({"email": credentials.email})
    if not user_doc:
        raise HTTPException(status_code=401, detail="البريد الإلكتروني أو كلمة المرور غير صحيحة")
    
    # Verify password
    if not verify_password(credentials.password, user_doc['password']):
        raise HTTPException(status_code=401, detail="البريد الإلكتروني أو كلمة المرور غير صحيحة")
    
    # Create token
    token = create_token(user_doc['id'], credentials.remember_me)
    
    # Remove password from response
    user_doc.pop('password')
    user_doc.pop('_id')
    if isinstance(user_doc.get('created_at'), str):
        user_doc['created_at'] = datetime.fromisoformat(user_doc['created_at'])
    
    return LoginResponse(token=token, user=User(**user_doc))

@api_router.get("/auth/me", response_model=User)
async def get_me(current_user: dict = Depends(get_current_user)):
    if isinstance(current_user.get('created_at'), str):
        current_user['created_at'] = datetime.fromisoformat(current_user['created_at'])
    return User(**current_user)

# ==================== Students Routes ====================

@api_router.get("/students", response_model=List[Student])
async def get_students(current_user: dict = Depends(get_current_user)):
    students = await db.students.find({}, {"_id": 0}).to_list(1000)
    
    for student in students:
        if isinstance(student.get('created_at'), str):
            student['created_at'] = datetime.fromisoformat(student['created_at'])
        if isinstance(student.get('updated_at'), str):
            student['updated_at'] = datetime.fromisoformat(student['updated_at'])
    
    return students

@api_router.post("/students", response_model=Student)
async def create_student(student_data: StudentCreate, current_user: dict = Depends(get_current_user)):
    # Check if student_id exists
    existing = await db.students.find_one({"student_id": student_data.student_id})
    if existing:
        raise HTTPException(status_code=400, detail="رقم الطالبة موجود مسبقاً")
    
    student = Student(**student_data.model_dump())
    doc = student.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.students.insert_one(doc)
    return student

@api_router.put("/students/{student_id}", response_model=Student)
async def update_student(student_id: str, student_data: StudentUpdate, current_user: dict = Depends(get_current_user)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="الطالبة غير موجودة")
    
    update_data = {k: v for k, v in student_data.model_dump().items() if v is not None}
    update_data['updated_at'] = datetime.now(timezone.utc).isoformat()
    
    await db.students.update_one({"id": student_id}, {"$set": update_data})
    
    updated_student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if isinstance(updated_student.get('created_at'), str):
        updated_student['created_at'] = datetime.fromisoformat(updated_student['created_at'])
    if isinstance(updated_student.get('updated_at'), str):
        updated_student['updated_at'] = datetime.fromisoformat(updated_student['updated_at'])
    
    return Student(**updated_student)

@api_router.delete("/students/{student_id}")
async def delete_student(student_id: str, current_user: dict = Depends(get_current_user)):
    student = await db.students.find_one({"id": student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="الطالبة غير موجودة")
    
    # Save to deleted_students for undo
    deleted_student = DeletedStudent(
        original_student=student,
        deleted_by=current_user['id']
    )
    doc = deleted_student.model_dump()
    doc['deleted_at'] = doc['deleted_at'].isoformat()
    
    await db.deleted_students.insert_one(doc)
    await db.students.delete_one({"id": student_id})
    
    return {"message": "تم حذف الطالبة بنجاح", "can_undo": True}

@api_router.post("/students/undo")
async def undo_delete_student(current_user: dict = Depends(get_current_user)):
    # Get last deleted student
    deleted = await db.deleted_students.find_one(
        {"deleted_by": current_user['id']},
        {"_id": 0},
        sort=[("deleted_at", -1)]
    )
    
    if not deleted:
        raise HTTPException(status_code=404, detail="لا توجد طالبة محذوفة للاستعادة")
    
    # Restore student
    student = deleted['original_student']
    await db.students.insert_one(student)
    
    # Remove from deleted_students
    await db.deleted_students.delete_one({"id": deleted['id']})
    
    return {"message": "تم استعادة الطالبة بنجاح", "student": student}

# ==================== Behavior Routes ====================

@api_router.get("/behaviors", response_model=List[BehaviorRecord])
async def get_behaviors(current_user: dict = Depends(get_current_user)):
    behaviors = await db.behavior_records.find({}, {"_id": 0}).to_list(1000)
    
    for behavior in behaviors:
        if isinstance(behavior.get('date'), str):
            behavior['date'] = datetime.fromisoformat(behavior['date'])
    
    return behaviors

@api_router.post("/behaviors", response_model=BehaviorRecord)
async def create_behavior(behavior_data: BehaviorRecordCreate, current_user: dict = Depends(get_current_user)):
    # Get student
    student = await db.students.find_one({"id": behavior_data.student_id}, {"_id": 0})
    if not student:
        raise HTTPException(status_code=404, detail="الطالبة غير موجودة")
    
    # Create behavior record
    behavior = BehaviorRecord(
        student_id=behavior_data.student_id,
        student_name=student['name'],
        behavior_type=behavior_data.behavior_type,
        points=behavior_data.points,
        description=behavior_data.description,
        teacher_id=current_user['id'],
        teacher_name=current_user['name']
    )
    
    doc = behavior.model_dump()
    doc['date'] = doc['date'].isoformat()
    
    await db.behavior_records.insert_one(doc)
    
    # Update student points
    new_points = student['behavior_points'] + behavior_data.points
    await db.students.update_one(
        {"id": behavior_data.student_id},
        {"$set": {"behavior_points": new_points}}
    )
    
    return behavior

@api_router.delete("/behaviors/clear")
async def clear_behaviors(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="غير مصرح - يجب أن تكون مديراً")
    
    result = await db.behavior_records.delete_many({})
    return {"message": f"تم حذف {result.deleted_count} سجل سلوك"}

# ==================== Teachers Routes ====================

@api_router.get("/teachers", response_model=List[Teacher])
async def get_teachers(current_user: dict = Depends(get_current_user)):
    teachers = await db.teachers.find({}, {"_id": 0}).to_list(1000)
    
    for teacher in teachers:
        if isinstance(teacher.get('created_at'), str):
            teacher['created_at'] = datetime.fromisoformat(teacher['created_at'])
    
    return teachers

@api_router.post("/teachers", response_model=Teacher)
async def create_teacher(teacher_data: TeacherCreate, current_user: dict = Depends(get_current_user)):
    teacher = Teacher(**teacher_data.model_dump())
    doc = teacher.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.teachers.insert_one(doc)
    return teacher

@api_router.delete("/teachers/clear-fake")
async def clear_fake_teachers(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="غير مصرح - يجب أن تكون مديراً")
    
    result = await db.teachers.delete_many({"is_fake": True})
    return {"message": f"تم حذف {result.deleted_count} معلمة وهمية"}

# ==================== Statistics Routes ====================

@api_router.get("/statistics/dashboard", response_model=Statistics)
async def get_dashboard_stats(current_user: dict = Depends(get_current_user)):
    total_students = await db.students.count_documents({})
    total_behaviors = await db.behavior_records.count_documents({})
    
    students = await db.students.find({}, {"_id": 0}).to_list(1000)
    
    avg_points = 0
    if students:
        avg_points = sum(s['behavior_points'] for s in students) / len(students)
    
    # Get top 10 students
    top_students = sorted(students, key=lambda x: x['behavior_points'], reverse=True)[:10]
    top_students_data = [
        {
            "id": s['id'],
            "name": s['name'],
            "class_name": s['class_name'],
            "points": s['behavior_points']
        }
        for s in top_students
    ]
    
    return Statistics(
        total_students=total_students,
        total_behavior_records=total_behaviors,
        average_points=round(avg_points, 2),
        top_students=top_students_data
    )

@api_router.delete("/statistics/clear")
async def clear_statistics(current_user: dict = Depends(get_current_user)):
    if current_user['role'] != 'admin':
        raise HTTPException(status_code=403, detail="غير مصرح - يجب أن تكون مديراً")
    
    # Reset all student points to 0
    await db.students.update_many({}, {"$set": {"behavior_points": 0, "achievements": []}})
    
    return {"message": "تم مسح جميع الإحصائيات"}

# ==================== Root Route ====================

@api_router.get("/")
async def root():
    return {"message": "رواد القيم - API"}

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
