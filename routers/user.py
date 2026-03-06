from fastapi import APIRouter,Depends,HTTPException,Path

from models import Todos, User
from database import  Sessionlocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel,Field
from .auth import get_current_user
from passlib.context import CryptContext

router = APIRouter(
     prefix='/user',
    tags=['user']
)


def get_db ():
    db= Sessionlocal()
    try:
        yield db 
        print("DATABASE CONNECTED SUCCESSFULLY")
    finally:
        db.close()

class Userverification(BaseModel):
    password:str
    new_password:str = Field(min_length=6)

class Updateinformation(BaseModel):
    email:str
    username:str
    frist_name:str
    last_name:str
   

db_dependencies=Annotated[Session,Depends(get_db)]
user_dependencies=Annotated[dict, Depends(get_current_user)]
bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated="auto" )


@router.get('/',status_code= status.HTTP_200_OK)
async def get_user(user:user_dependencies, db : db_dependencies):
    if user is None:
        raise HTTPException(status_code=404 , detail="Authenticcation failed  ")
    return db.query(User).filter(User.id==user.get('id')).first()

@router.put("/Change_pass",status_code=status.HTTP_204_NO_CONTENT)
async def forget_pass(user:user_dependencies,db:db_dependencies, user_verification:Userverification):
    if user is None:
        raise HTTPException(status_code=404 , detail="Authentication failed")
    user_model=db.query(User).filter(User.id==user.get('id')).first()

    if not bcrypt_context.verify(user_verification.password, user_model.hashed_password):
        return HTTPException(status_code=404, detail="password dose not matched with previous password")
    user_model.hashed_password= bcrypt_context.hash(user_verification.new_password)
    db.add(user_model)
    db.commit() 

@router.put("/changeInfo")
async def change_user_info(user:user_dependencies, db:db_dependencies,update_info:Updateinformation):
    if user is None:
        raise HTTPException(status_code=404 , detail="Authentication failed")
    user_model=db.query(User).filter(User.id==user.get('id')).first()

    user_model.email=update_info.email
    user_model.username=update_info.username
    user_model.frist_name=update_info.frist_name
    user_model.last_name=update_info.last_name

    db.add(user_model)
    db.commit()