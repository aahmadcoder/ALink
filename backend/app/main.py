from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import engine, Base
from app.controllers import auth, student, alumni, admin
from app.models import user, profile, activity
import os

Base.metadata.create_all(bind=engine)

app = FastAPI(title="ALink API", description="Alumni-Student Connection Platform API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(os.path.dirname(BASE_DIR), "frontend")

uploads_dir = os.path.join(BASE_DIR, "uploads")
if os.path.exists(uploads_dir):
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

assets_dir = os.path.join(FRONTEND_DIR, "assets")
if os.path.exists(assets_dir):
    app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

pages_dir = os.path.join(FRONTEND_DIR, "pages")
if os.path.exists(pages_dir):
    app.mount("/pages", StaticFiles(directory=pages_dir), name="pages")

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(student.router, prefix="/student", tags=["Student"])
app.include_router(alumni.router, prefix="/alumni", tags=["Alumni"])
app.include_router(admin.router, prefix="/admin", tags=["Admin"])


@app.get("/")
def read_root():
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))


@app.get("/{full_path:path}")
def catch_all(full_path: str):
    file_path = os.path.join(FRONTEND_DIR, "pages", full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
    return FileResponse(os.path.join(FRONTEND_DIR, "index.html"))
