# now frist to create the models in the moddels.py frist we import the base from the database .py file 
from database import Base
from sqlalchemy import Column , Integer, String, Boolean, ForeignKey#we can import this to create the coloumn of table and use the integer, string and boolin to devine the type of the databse 




class User(Base):

    __tablename__="user"

    id=Column(Integer, primary_key= True, index= True)
    email = Column(String,unique=True)
    username = Column(String, unique= True)
    frist_name = Column(String)
    last_name = Column(String)
    hashed_password=Column(String)
    is_active = Column(Boolean, default=True)
    role =Column(String)



class Todos(Base):
    __tablename__='todos' # we use this argument to give the table name in the database 
    # now we creating the column for the tablees 
    id = Column(Integer, primary_key= True, index= True)
    tittle = Column(String)
    discription = Column(String)
    priority=Column(String)
    complete = Column(Boolean, default= False)
    due_date = Column(String, nullable=True)
    
    owner_id= Column(Integer,ForeignKey("user.id"))


