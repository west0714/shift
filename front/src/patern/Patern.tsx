export const newUserURL = "http://localhost:8000/newUser"

export const getUserURL = "http://localhost:8000/allUser"

export const submitURL = "http://localhost:8000/submit"

export const registerdURL = "http://localhost:8000/get_shift"

export const deletURL = "http://localhost:8000/delet"

export const reloadURL = "http://localhost:8000/user"

export const logoutURL = "http://localhost:8000/logout"


export const MonthOptions = [
    {key: "01", value: "1"},
    {key: "02", value: "2"},
    {key: "03", value: "3"},
    {key: "04", value: "4"},
    {key: "05", value: "5"},
    {key: "06", value: "6"},
    {key: "07", value: "7"},
    {key: "08", value: "8"},
    {key: "09", value: "9"},
    {key: "10", value: "10"},
    {key: "11", value: "11"},
    {key: "12", value: "12"},
]

export const Operatedate = () => {
    const now = new Date(); //今日
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const date = now.getDate();
    //const date = 5

    let startDate = ""
    let endDate = ""
    
    if (4 <= date && date <= 18 ) {
      let new_month = month + 1;
      let new_year = year;
      if (new_month === 13) { //年が変わる
        new_month = 1;
        new_year += 1;
      }
      startDate = `${new_year}-${String(new_month).padStart(2,"0")}-01`
      endDate = `${new_year}-${String(new_month).padStart(2, "0")}-16`
    } else {
      let new_month = month;
      let new_year = year;
      if (19 <= date) {
        new_month += 1;
        if (new_month === 13) { //年が変わる
          new_month = 1;
          new_year += 1;
        }
      }
      const lastDate = new Date(new_year,new_month,0).getDate();
      startDate = `${new_year}-${String(new_month).padStart(2,"0")}-17`
      endDate = `${new_year}-${String(new_month).padStart(2, "0")}-${lastDate}`
    }
    return [startDate, endDate];
}