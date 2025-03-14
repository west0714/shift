import mysql.connector
import datetime
import calendar
import os
from dotenv import load_dotenv

# .envファイルの内容を読み込む
load_dotenv()

#DB接続
def get_db():
    conn = mysql.connector.connect(
        host = os.getenv("host"),
        user = os.getenv("user"),
        password = os.getenv("password"),
        database = os.getenv("database")
    )
    return conn


#login jwt
def db_login(number):
    conn = get_db()
    cur = conn.cursor()
    sql = "SELECT password,user_role from user WHERE smile_number = %s"
    cur.execute(sql, (number,))
    row = cur.fetchone()
    conn.close()
    return row[0], row[1]   


#シフト登録
def insert_itmes(event_id, title, date, user_id, jikan):
    conn = get_db()
    cur = conn.cursor()
    sql = "INSERT INTO shift_events(event_id, title, date, user_id, times) VALUES(%s, %s, %s, %s, %s)"
    cur.execute(sql, (event_id, title, date, user_id, jikan,))
    conn.commit()
    conn.close()

#削除
def delet_items(event_id):
    conn = get_db()
    cur = conn.cursor()
    sql = "DELETE from shift_events WHERE event_id = %s"
    cur.execute(sql, (event_id,))
    conn.commit()
    conn.close()


#ユーザー登録
def insert_user(number, name, password, role):
    print(role)
    conn = get_db()
    cur = conn.cursor()
    sql = "INSERT INTO user(smile_number, name, password, user_role) VALUES(%s, %s, %s, %s)"
    cur.execute(sql, (number, name, password, role,))
    conn.commit()
    conn.close()
    #return number, name

#登録期間
def register_time():
    today = datetime.date.today()
    year = today.year
    month = today.month
    date = today.day
    startDate = ""
    endDate = ""
    if 4 <= date <= 18:
        new_month = month + 1
        new_year = year
        if new_month == 13:
            new_month = 1
            new_year += 1
        startDate = f'{new_year}-{new_month}-01'
        endDate = f'{new_year}-{new_month}-16'
    else:
        new_month = month
        new_year = year
        if 19 <= date:
            new_month += 1
            if (new_month == 13):
                new_month = 1
                new_year += 1
        lastDate = calendar.monthrange(new_year,new_month)[1]
        startDate = f'{new_year}-{new_month}-17'
        endDate = f'{new_year}-{new_month}-{lastDate}'
    startDate = datetime.datetime.strptime(startDate, "%Y-%m-%d")
    endDate = datetime.datetime.strptime(endDate, "%Y-%m-%d")
    return startDate, endDate

#勤務時間
def total_times(id):
    startDate, endDate = register_time()
    conn = get_db()
    cur = conn.cursor()
    sql = "select sec_to_time(sum(time_to_sec(times))) as total_times from shift_events where user_id=%s AND date BETWEEN %s AND %s"
    cur.execute(sql, (id, startDate, endDate))
    times = cur.fetchone()
    conn.close()
    return times[0]

#登録されたシフト確認
def get_itmes(id):
    conn = get_db()
    cur = conn.cursor()
    sql = "SELECT event_id,title,date,user_id from shift_events WHERE user_id = %s"
    cur.execute(sql, (id,))
    rows = cur.fetchall()
    conn.close()

    times = total_times(id)
    return rows, times

#全員分のシフト
def all_shift():
    conn = get_db()
    cur = conn.cursor()
    sql = "SELECT name,event_id,title,date from shift_events JOIN user ON user.smile_number = shift_events.user_id ORDER BY STR_TO_DATE(SUBSTRING_INDEX(title, '-', 1), '%H:%i')" #開始時刻のみ抜き出して、時間に変更⇒order by
    cur.execute(sql)
    rows = cur.fetchall()
    conn.close()
    return rows

#確定シフト一覧
def kakutei_shift(start, end):
    conn = get_db()
    cur = conn.cursor()
    sql = "SELECT smile_number,name,title, STR_TO_DATE(date, '%Y-%m-%d') AS shift_date from shift_events JOIN user ON user.smile_number = shift_events.user_id  WHERE user_role=0 AND STR_TO_DATE(date, '%Y-%m-%d')  BETWEEN %s AND %s  ORDER BY smile_number, shift_date"
    cur.execute(sql, (start, end,))
    rows = cur.fetchall()
    conn.close()
    return rows    


#login用
def get_user(number):
    conn = get_db()
    cur = conn.cursor()
    sql = "SELECT name,user_role from user WHERE smile_number = %s"
    cur.execute(sql, (number,))
    row = cur.fetchone()
    conn.close()
    return row[0], row[1]

#登録済みユーザー
def all_user():
    conn = get_db()
    cur = conn.cursor()
    sql = "SELECT smile_number,name,IF(user_role=0, 'ユーザー', '管理者')AS roles from user order by smile_number"
    cur.execute(sql)
    rows = cur.fetchall()
    conn.close()
    return rows

#ユーザー削除
def deletUser(id):
    conn = get_db()
    cur = conn.cursor()
    sql = "DELETE FROM user WHERE smile_number=%s"
    cur.execute(sql, (id,))
    conn.commit()
    conn.close()

#権限変更
def edituser(id):
    conn = get_db()
    cur = conn.cursor()
    sql = "UPDATE user SET user_role=IF(user_role = 1, 0, 1) WHERE smile_number=%s"
    cur.execute(sql, (id,))
    conn.commit()
    conn.close()