"""
HRMS Lite - Database Connection Module
Handles MongoDB connection using Motor async driver
"""

import os
import ssl
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI", "mongodb://localhost:27017/hrms_lite")

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    """Initialize MongoDB connection and create indexes"""
    global client, db

    # For cloud deployments like Render, allow invalid certificates
    # only if NOT running locally
    is_local = "localhost" in MONGODB_URI or "127.0.0.1" in MONGODB_URI
    
    mongo_options = {
        "serverSelectionTimeoutMS": 30000,
        "connectTimeoutMS": 30000,
    }
    
    if not is_local:
        mongo_options["tls"] = True
        mongo_options["tlsAllowInvalidCertificates"] = True
    
    client = AsyncIOMotorClient(
        MONGODB_URI,
        **mongo_options
    )

    db = (
        client.get_default_database()
        if "hrms_lite" in MONGODB_URI
        else client.hrms_lite
    )

    # Create indexes for employees collection
    await db.employees.create_index("employee_id", unique=True)
    await db.employees.create_index("email", unique=True)

    # Create composite index for attendance (one record per employee per day)
    await db.attendance.create_index([("employee_id", 1), ("date", 1)], unique=True)

    print("[OK] Connected to MongoDB")


async def close_mongo_connection():
    """Close MongoDB connection"""
    global client
    if client:
        client.close()
        print("[OK] Disconnected from MongoDB")


def get_database():
    """Get database instance"""
    return db
