from fastapi import FastAPI,Depends,HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import  Client
from schemas.users import UserCreate
from db.settings import get_supabase
from utils import hash_password
import sys
sys.path.append("/Users/petarvukovic/Desktop/AI_EMAIL_AGENT/back")
def get_db() -> Client:
    supabase = get_supabase()
    return supabase

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post('/register')
def register(user:UserCreate,supabase: Client = Depends(get_db)):
    try:
        response = supabase.table("users").insert({
        "username": user.username,
        "email": user.email,
        "password_hash": hash_password(user.password)
    }).execute()
        print(user)
        if user is None:
            return {"message":"user not created"}
        return {"message":"user created"}
    except HTTPException as e:
        return {"message":str(e.detail)}
    
    








