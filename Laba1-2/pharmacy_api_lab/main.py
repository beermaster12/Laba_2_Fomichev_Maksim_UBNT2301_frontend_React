from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine
import models
from routers import medicines, stats

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="API аптеки", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(medicines.router)
app.include_router(stats.router)

@app.get("/")
def root():
    return {"message": "API аптеки работает"}
