from fastapi import  APIRouter,HTTPException,Depends
from pydantic import BaseModel
from models import User
from starlette import status
#imports for pass hashing
from passlib.context import CryptContext
from database import  Sessionlocal
from sqlalchemy.orm import Session
from typing import Annotated
from fastapi.security import OAuth2PasswordRequestForm ,OAuth2PasswordBearer#this is slightly secure and will have own portel for swagger 
#now for jwt install the "python-jose[cryptography]"
from jose import jwt
from datetime import timedelta, datetime, timezone
from jose import JWTError
import os
from dotenv import load_dotenv

load_dotenv()



router = APIRouter(
    prefix='/auth',
    tags=['auth']
)
#openssl rand -hex 32-> this command is use for creating the secrate key 
SECRETE_KEY= os.getenv("SECRETE_KEY")
ALGORITHEM='HS256'
bcrypt_context=CryptContext(schemes=['bcrypt'],deprecated="auto" )
oauth2_bearer= OAuth2PasswordBearer(tokenUrl="auth/token")



class CreateuserRequest(BaseModel):
    email:str
    username:str
    frist_name:str
    last_name:str
    password:str
    role:str

class Token(BaseModel):
    access_token:str
    token_type:str

def get_db ():
    db= Sessionlocal()
    try:
        yield db
        print("Database conected") 
    finally:
        db.close()

db_dependencies=Annotated[Session,Depends(get_db)]


def autenticate_user(username:str,password:str ,db):
    user= db.query(User).filter(User.username==username).first()
    if not user :
        return False
    if not bcrypt_context.verify(password, user.hashed_password):
        return False
    return user


def create_access_token(username:str, User_id:int, role: str, expires_delta:timedelta):
    encode={'sub':username,'id':User_id,'role':role}
    expires= datetime.now(timezone.utc)+ expires_delta
    encode.update({'exp':expires})
    return jwt.encode (encode,SECRETE_KEY, algorithm=ALGORITHEM)

async def get_current_user ( token: Annotated[str, Depends(oauth2_bearer)]):
    try:
        payload = jwt.decode(token, SECRETE_KEY,algorithms=[ALGORITHEM])
        username:str = payload.get('sub')
        user_id: int = payload.get('id')
        role:str=payload.get('role')
        if username is None or id is None:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="coul    d not a vlid user ")
        return{'username':username,'id':user_id,'role':role}
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="could not a vlid user ")
    

#if we have to hash our password so frist we have to install the 2 dependencies 1 is passlib abd the 2 one is bcript of versio 4.0.1
@router.post("/createuser",status_code=status.HTTP_201_CREATED)
async def create_user(db:db_dependencies
                      ,create_user_request:CreateuserRequest):
    create_user_model=User(
        email=create_user_request.email,
        username = create_user_request.username,
        frist_name=create_user_request.frist_name,
        last_name=create_user_request.last_name,
        role=create_user_request.role,
        hashed_password= bcrypt_context.hash(create_user_request.password),
        is_active=True
        )
    db.add(create_user_model) 
    db.commit()
    return({'detail':"user created ",
            'email':create_user_model.email,
            'role':create_user_model.role})


@router.post("/token", response_model= Token)
async def login_for_token(form_data:Annotated[OAuth2PasswordRequestForm,Depends()],db:db_dependencies):
    user = autenticate_user(form_data.username,form_data.password,db)
    
    if not user:
         raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="could not a vlid user ")
    token= create_access_token(user.username,user.id,user.role,timedelta(days=60))
    return {'access_token': token,'token_type':'bearer'}
