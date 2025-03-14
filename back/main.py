from fastapi import FastAPI, Query, HTTPException, Response, Request
from pydantic import BaseModel, Field, field_validator
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from passlib.context import CryptContext
import calendar
import datetime
import re
from db import insert_itmes, insert_user, get_user, get_itmes, all_user, delet_items, all_shift, kakutei_shift, db_login, deletUser, edituser
from jwt_pass import hash_pass, create_token, token_kensyo

app = FastAPI()

#fastapi アクセス認証（ここからのアクセスならOK）
app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:3000"],  # Vue.jsのURLを指定
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class Validators:
    @staticmethod
    def validate_pass(value: str) -> str:
        if not re.search(r"[a-zA-Z]", value):
            raise ValueError("半角英字が１つ以上必要です")
        if not re.search(r"[0-9]", value):
            raise ValueError("半角数字が１つ以上必要です")
        if not re.search(r"[!?$&@-]", value):
            raise ValueError("!?$&@-のうち１つ以上必要です")
        return value

class Items(BaseModel):
    number: int = Field(..., ge=1, le=10000)
    name: str = Field(..., min_length=1)
    password: str = Field(..., min_length=8, max_length=16)
    role: str

    @field_validator("password")
    @classmethod
    def check_pass(cls, value):
        return Validators.validate_pass(value)

class Events(BaseModel):
    id: str
    title: str
    date: str
    user_id: int

class Login(BaseModel):
    usernumber: int = Field(..., ge=1, le=10000)
    password: str = Field(..., min_length=8, max_length=16)

    @field_validator("password")
    @classmethod
    def check_pass(cls, value):
        return Validators.validate_pass(value)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

#login用 jwt生成
@app.post("/login")
async def login(request: Login):
    try :
        db_pass, role = db_login(request.usernumber) #入力された番号（メールアドレスとか）被らないものがＤＢにあるか、あったらパスワードを返す
        if not db_pass:
            raise HTTPException(status_code=401, detail="従業員番号が間違っています")
        if not pwd_context.verify(request.password, db_pass):
            raise HTTPException(status_code=401, detail="パスワードが間違っています")
        
        sub = str(request.usernumber) #文字型
        #入力がどちらもあってたらトークン生成
        token = create_token({"sub": sub}) #生成に含む情報を辞書型で渡す, 有効期限
        if role == 1:
            user_role = "admin"
        elif role == 0:
            user_role = "user"

        response = JSONResponse(content={"number": request.usernumber, "role": user_role})

        #Cookieにセット (ローカルと本番環境の設定に注意)
        response.set_cookie(
            key="access_token",
            value=token,
            httponly=True,
            secure=True,
            samesite="None",
            max_age=1800, #1800秒=30分
            path="/",
        )
        return response
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

#ログイン状態を確認
@app.get("/user")
async def check_user(request: Request):
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="再ログインしてください")
    
    usernumber = token_kensyo(token)
    username, role = get_user(usernumber)
    if not username:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")
    
    if role == 1:
        user_role = "admin"
    elif role == 0:
        user_role = "user"
    
    return JSONResponse(content={"number": usernumber, "role": user_role})

#logout
@app.post("/logout")
def logout(response: Response):
    response.delete_cookie("access_token", path="/")
    return JSONResponse(content={"message":"success"})


#シフト登録
@app.post("/submit")
def register_shift(events: Events):
    start, end = events.title.split("-")
    start_time = datetime.datetime.strptime(start, "%H:%M")
    end_time = datetime.datetime.strptime(end, "%H:%M")
    jikan = end_time - start_time

    insert_itmes(events.id, events.title, events.date, events.user_id, jikan)
    return JSONResponse(content={"message": "seccess"})

#シフト削除
@app.get("/delet")
def delet_shift(event_id: str = Query(...)):
    delet_items(event_id)
    return JSONResponse(content={"message": "success"})


#ユーザー登録
@app.post("/newUser")
def register_user(item: Items):
    try:
        create_pass = hash_pass(item.password)
        if item.role == "管理者":
            role = 1
        elif item.role == "ユーザー":
            role = 0
        print(role)
        insert_user(item.number, item.name, create_pass, role)
        return JSONResponse(content={"name": item.name})
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


#登録されたシフト確認
@app.get("/get_shift/{id}")
async def get_shift(id: int):
    rows, times = get_itmes(id)
    times = str(times)[:-3]
    response_data = {
        "total_time": times,
        "data": [
            {"id": row[0], "title": row[1], "date": row[2], "user_id": row[3]} for row in rows
        ]
    }
    return JSONResponse(content=response_data)

#全員分のシフト確認
@app.get("/total_shift")
def total_shift():
    rows = all_shift()
    return JSONResponse(content=[
        {"name": row[0], "id": row[1], "title": row[2], "date": row[3]} for row in rows
    ])    

#確定のシフト一覧
@app.get("/kakutei_shift/{date}")
def kakutei(date: str):
    kikan = date[-2]
    year, month = date[:-2].split("-")
    last_day = calendar.monthrange(int(year), int(month))[1] #月末
    if kikan == "前": #str型
        start = year+"-"+month+"-1"
        end = year+"-"+month+"-16"
    else:
        start = year+"-"+month+"-17"
        end = year+"-"+month+"-"+str(last_day)
    rows = kakutei_shift(start, end)
    users = all_user()

    #date型
    startdate = datetime.datetime.strptime(start, "%Y-%m-%d")
    enddate = datetime.datetime.strptime(end, "%Y-%m-%d")
    difdate = (enddate - startdate).days #差の日数

    dates = [(startdate + datetime.timedelta(days=i)).strftime("%Y-%m-%d")[8:] for i in range(difdate+1)]
    shifts = []
    for i in users:
        kojin = {}
        kojin["user_id"] = i[0]
        kojin["name"] = i[1]
        for j in dates:
            kojin[j] = ""
        for num in rows:
            if num[0] == kojin["user_id"]:
                kojin[num[3].strftime('%Y-%m-%d')[8:]] =  num[2]
        shifts.append(kojin)
    return JSONResponse(content={"dates": dates, "shifts": shifts})


#登録済みユーザー
@app.get("/allUser")
def get_allUsers():
    rows = all_user()
    return JSONResponse(content=[
        {"number": row[0], "name": row[1], "role": row[2]} for row in rows
    ])

@app.get("/deletUser/{id}")
def delet_User(id: int):
    deletUser(id)
    return JSONResponse(content={"message": "success"})

@app.get("/editrole/{id}")
def Edit_User(id: int):
    edituser(id)
    return JSONResponse(content={"message": "success"})