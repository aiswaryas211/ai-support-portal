from pydantic import BaseModel, EmailStr

class AdminCreateUser(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str   # admin | agent



class UpdateUserRole(BaseModel):
    role: str   # admin | agent | customer


from pydantic import BaseModel, EmailStr

class FAQCreate(BaseModel):
    question: str
    answer: str

class FAQOut(FAQCreate):
    id: int
