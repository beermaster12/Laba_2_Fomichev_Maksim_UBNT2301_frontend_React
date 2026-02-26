from pydantic import BaseModel, Field

class MedicineBase(BaseModel):
    name: str = Field(..., min_length=2)
    manufacturer: str = Field(..., min_length=2)
    price: float = Field(..., gt=0)
    quantity: int = Field(..., ge=0)

class MedicineCreate(MedicineBase):
    pass

class MedicineUpdate(MedicineBase):
    pass

class MedicineResponse(MedicineBase):
    id: int

    class Config:
        orm_mode = True
