from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr, model_validator
from typing import List
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class UserType(BaseModel):
    louer: bool = False
    proposer: bool = False

class WaitlistEntry(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    prenom: str
    email: EmailStr
    ville: str
    userType: UserType
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class WaitlistCreate(BaseModel):
    prenom: str
    email: EmailStr
    ville: str
    userType: UserType

    @model_validator(mode='after')
    def check_user_type(self):
        if not self.userType.louer and not self.userType.proposer:
            raise ValueError("Veuillez sélectionner au moins une option (louer ou proposer)")
        return self

class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "ShareMatos API is running"}

@api_router.post("/waitlist", response_model=WaitlistEntry)
async def create_waitlist_entry(input: WaitlistCreate):
    """Create a new waitlist entry"""
    try:
        # Check if email already exists
        existing_entry = await db.waitlist.find_one({"email": input.email})
        if existing_entry:
            raise HTTPException(status_code=400, detail="Cet email est déjà inscrit")
        
        # Create waitlist entry
        entry_dict = input.model_dump()
        entry_obj = WaitlistEntry(**entry_dict)
        
        # Convert to dict and serialize for MongoDB
        doc = entry_obj.model_dump()
        doc['timestamp'] = doc['timestamp'].isoformat()
        doc['userType'] = dict(doc['userType'])
        
        await db.waitlist.insert_one(doc)
        
        return entry_obj
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Error creating waitlist entry: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de l'inscription")

@api_router.get("/waitlist", response_model=List[WaitlistEntry])
async def get_waitlist_entries():
    """Get all waitlist entries"""
    try:
        entries = await db.waitlist.find({}, {"_id": 0}).to_list(1000)
        
        # Convert ISO string timestamps back to datetime objects
        for entry in entries:
            if isinstance(entry['timestamp'], str):
                entry['timestamp'] = datetime.fromisoformat(entry['timestamp'])
        
        return entries
    except Exception as e:
        logging.error(f"Error fetching waitlist entries: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors de la récupération des données")

@api_router.get("/waitlist/count")
async def get_waitlist_count():
    """Get total count of waitlist entries"""
    try:
        count = await db.waitlist.count_documents({})
        return {"count": count}
    except Exception as e:
        logging.error(f"Error counting waitlist entries: {e}")
        raise HTTPException(status_code=500, detail="Erreur lors du comptage")

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

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