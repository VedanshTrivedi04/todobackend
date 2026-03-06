from fastapi import APIRouter,Depends,HTTPException,Path

from models import Todos
from database import  Sessionlocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel,Field
from .auth import get_current_user


router = APIRouter(
     prefix='/admin',
    tags=['admin']
)


def get_db ():
    db= Sessionlocal()
    try:
        yield db 
        print("DATABASE CONNECTED SUCCESSFULLY")
    finally:
        db.close()



db_dependencies=Annotated[Session,Depends(get_db)]
user_dependencies=Annotated[dict, Depends(get_current_user)]



@router.get("/todos")
async def read_all(user:user_dependencies, db :db_dependencies):
    if user is None or user.get('role') !='admin':
        raise HTTPException(status_code=404, detail="authentication failed")
    return db.query(Todos).all()


@router.delete("/todo/{todo_id}")
async def delete_user(user:user_dependencies,db:db_dependencies, todo_id:int=Path(gt=0)):
    if user is None or user.get('role') !='admin':
        raise HTTPException(status_code=404, detail="authentication failed")
    todo_model= db.query(Todos).filter(Todos.id== todo_id).first()
    if todo_model is None:
        raise HTTPException(status_code=404, detail="user not found")
    db.query(Todos).filter(todo_id==Todos.id).delete()
    db.commit()
    

                      