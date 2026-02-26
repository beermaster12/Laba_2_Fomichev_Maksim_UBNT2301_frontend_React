from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
import models
from database import SessionLocal

router = APIRouter(prefix="/stats", tags=["Statistics"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/count")
def medicines_count(db: Session = Depends(get_db)):
    return {"count": db.query(func.count(models.Medicine.id)).scalar()}

@router.get("/average-price")
def average_price(db: Session = Depends(get_db)):
    avg = db.query(func.avg(models.Medicine.price)).scalar()
    return {"average_price": round(avg, 2) if avg else 0}
