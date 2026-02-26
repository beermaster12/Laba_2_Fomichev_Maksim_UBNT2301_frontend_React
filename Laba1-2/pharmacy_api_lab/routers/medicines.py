from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import models, schemas
from database import SessionLocal

router = APIRouter(prefix="/medicines", tags=["Medicines"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=List[schemas.MedicineResponse])
def get_medicines(
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    manufacturer: Optional[str] = None,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(models.Medicine)
    if min_price is not None:
        query = query.filter(models.Medicine.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Medicine.price <= max_price)
    if manufacturer:
        query = query.filter(models.Medicine.manufacturer == manufacturer)
    return query.offset(skip).limit(limit).all()

@router.get("/{medicine_id}", response_model=schemas.MedicineResponse)
def get_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    return medicine

@router.post("/", response_model=schemas.MedicineResponse, status_code=201)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = models.Medicine(**medicine.dict())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.put("/{medicine_id}", response_model=schemas.MedicineResponse)
def update_medicine(medicine_id: int, medicine: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    db_medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    for key, value in medicine.dict().items():
        setattr(db_medicine, key, value)
    db.commit()
    db.refresh(db_medicine)
    return db_medicine

@router.delete("/{medicine_id}")
def delete_medicine(medicine_id: int, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Лекарство не найдено")
    db.delete(medicine)
    db.commit()
    return {"message": "Лекарство удалено"}
