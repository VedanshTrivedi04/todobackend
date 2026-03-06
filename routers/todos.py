from fastapi import APIRouter,Depends,HTTPException,Path

from models import Todos
from database import  Sessionlocal
from typing import Annotated
from sqlalchemy.orm import Session
from starlette import status
from pydantic import BaseModel,Field
from .auth import get_current_user
from typing import Optional


router = APIRouter(
)


def get_db ():
    db= Sessionlocal()
    try:
        yield db 
        print("DATABASE CONNECTED SUCCESSFULLY")
    finally:
        db.close()

class TodosRequest(BaseModel):
    tittle :str= Field(min_length=2)
    discription:str=Field(min_length=3 , max_length=100 )
    priority:str= Field(max_length=9)
    complete:bool
    due_date: Optional[str] = None




db_dependencies=Annotated[Session,Depends(get_db)]
user_dependencies=Annotated[dict, Depends(get_current_user)]



#depens means the dependenfcies enjection means we need to do before we execute what we re trying to execute  and that will alow ud to be able to do something behind secens and then enject the dependencies that the function is relies on    
@router.get("/read", status_code= status.HTTP_200_OK)
async def read_all(user:user_dependencies,db:db_dependencies):
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,detail="user is unauthorized")
    return db.query(Todos).filter(Todos.owner_id==user.get('id')).all() # iska matlab ye hei ki hamkp sare todos return karne hei 


@router.get('/todo/read/{todos_id}', status_code=status.HTTP_200_OK)
async def Read_data_by_id(user: user_dependencies,db: db_dependencies,todos_id:int=Path(gt=0)):
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,detail="user is unauthorized")
    todos_models= db.query(Todos)\
        .filter(Todos.id==todos_id)\
        .filter(Todos.owner_id==user.get('id')).first()

    if todos_models is not None:
        return todos_models
    
    raise HTTPException(status_code=404, detail="Todo is not found ")



@router.post("/todos",status_code=status.HTTP_201_CREATED)
async def add_data(user:user_dependencies, db:db_dependencies, tots_request:TodosRequest):
    if user is None:
        raise HTTPException(status.HTTP_401_UNAUTHORIZED,detail="user is unauthorized")
    
    todos_model= Todos(**tots_request.model_dump(),owner_id = user.get('id'))

    db.add(todos_model)
    db.commit()


@router.put("/todo/{todo_id}")
async def update_list(user:user_dependencies,db:db_dependencies, todo_request:TodosRequest,todo_id:int=Path(gt=0) ):
    todo_model=db.query(Todos).filter(Todos.id== todo_id).filter(Todos.owner_id==user.get('id')).first()#step1 find the tod of the given id 

    if todo_model is None:
        raise HTTPException(status_code=404, detail="todo is not found")# in this is trhe todos is not fond thenit raise the exception request
#now in this the changing the information is occur 
    todo_model.tittle= todo_request.tittle
    todo_model.discription= todo_request.discription
    todo_model.priority= todo_request.priority
    todo_model.complete= todo_request.complete
    todo_model.due_date= todo_request.due_date


    db.add(todo_model)
    db.commit()



@router.delete("/todo/{todo_id}")
async def delete_todo(user:user_dependencies,db:db_dependencies, todo_id: int = Path(gt=0)):
    todo_modle=db.query(Todos).filter(Todos.id==todo_id).filter(Todos.owner_id==user.get('id')).first()
    if todo_modle is None:
        raise HTTPException(status_code=404,detail="Todos not found")
    db.query(Todos).filter(Todos.id == todo_id).filter(Todos.owner_id==user.get('id')).delete()
    db.commit()