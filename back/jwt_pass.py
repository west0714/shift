#jwt生成、検証
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import JWTError, jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
import os
from dotenv import load_dotenv

# .envファイルの内容を読み込む
load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
EXPORE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#ハッシュ化
def hash_pass(password):
    return pwd_context.hash(password)

#トークン生成
def create_token(data: dict):
    encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=EXPORE_MINUTES) #有効期限
    encode.update({"exp": expire})
    encode_jwt = jwt.encode(encode, SECRET_KEY, algorithm=ALGORITHM)
    return encode_jwt

#トークン検証
def token_kensyo(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM]) #tokenを受け取る
        usernumber = payload.get("sub") #"sub"を取得 生成の時に含めた個人を認識できる情報
        usernumber = int(usernumber)
        return usernumber
    except JWTError:
        raise None