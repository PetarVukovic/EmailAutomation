from supabase import create_client, Client
from dotenv import load_dotenv
import os

load_dotenv(dotenv_path="/Users/petarvukovic/Desktop/AI_EMAIL_AGENT/back/.env")

def get_supabase() -> Client:
    supabase_url = os.getenv("SUPABASE_URL")
    supabase_key = os.getenv("SUPABASE_KEY")
    supabase: Client = create_client(supabase_url, supabase_key)
    return supabase
