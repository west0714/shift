"use client";
import { useEffect, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import timeGridPlugin from '@fullcalendar/timegrid'
import Header from "../../components/Header";
import axios from "axios";
import { submitURL, deletURL, Operatedate } from "../../patern/Patern";
import { oneUser, allUser } from "../../patern/oneUser";
import { mutate } from "swr";
import { useUser } from "@/context/Context";


interface Events {
    name: string;
    id: string;
    title: string;
    date: string;
}

export default function Calendar() {
    const { user } = useUser();
    const [selectedDate, setSelectedDate] = useState(""); //クリックされた日
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [selectedView, setSlectedView] = useState(null);
    const [userID, setUserID] = useState<number | null>(null);

    //選択された時間
    const [startHour, setStartHour] = useState("8");
    const [startMinutes, setStarMinutes] = useState("00");
    const [endHour, setEndHour] = useState("8");
    const [endMinutes, setEndMinutes] = useState("00");

    //popup
    const [popupOpen, setPopupOpen] = useState<boolean>(false);
    const [editerPopup, setEditerPopup] = useState<boolean>(false);

    useEffect(() => {
        if (user?.number) {
            setUserID(user.number);
            console.log("oneuser:",userID);
        }
    }, [user]);
    //useSWR
    const { total_times, event } = oneUser(userID);
    const { totalEvents } = allUser();

    const [operateStart, operateEnd] = Operatedate();

    const [selectedDateEvents, setSelectedDateEvents] = useState<Events[]>([]); //クリックされた日に登録されているイベント

    const targetStart = new Date(operateStart);
    targetStart.setHours(0,0,0,0);
    const targetEnd = new Date(operateEnd);
    targetEnd.setHours(0,0,0,0);

     //クリックした日付
    const handleDateClick = (info: any) => {
        setSelectedDate(info.dateStr);
        const sortevents = totalEvents?.filter((item) => item.date === info.dateStr); //クリックされた日をソート
        setSelectedDateEvents(sortevents ?? []); //ソートの結果がない⇒[]になる
        const clickday = new Date(info.dateStr);
        clickday.setHours(0,0,0,0);
        if (clickday >= targetStart && clickday <= targetEnd) {
            setPopupOpen(true);
        }
    };

    //追加ボタンでイベント追加
    const addEvent = async() => {
        const conectTimes = `${startHour}:${startMinutes}-${endHour}:${endMinutes}` //タイトルに時間を表示

        const newEvent = {
            id: Date.now().toString(),
            title: conectTimes,
            date: selectedDate,
            user_id: user?.number
        }; //追加イベント

        try {
            const response = await axios.post(submitURL, newEvent);
            console.log("成功", response.data);
        } catch (error) {
            alert("失敗しました");
        }
        mutate(`http://localhost:8000/get_shift/${user?.number}`);
        mutate('http://localhost:8000/total_shift');
        setSelectedDate(""); //選択している日付を削除
        setPopupOpen(false); //popupを閉じる
    };

    //閉じるボタンが押されたとき
    const closePop = () => {
        setSelectedDate(""); //選択している日付を削除
        setPopupOpen(false); //popupを閉じる
        setEditerPopup(false);
    };

    //クリックしたイベントを選択
    const handleEventClick = (info:any) => {
        setSelectedEvent(info.event.id);
        setSlectedView(info.event.title);
        setEditerPopup(true);
    };

    //イベント削除
    const deletEvent = async() => {
        const eventID = selectedEvent;

        try {
            const response = await axios.get(deletURL, {
                params: { event_id: eventID}
            });
            console.log("成功", response.data);
        } catch (error) {
            alert("失敗しました");
        }
        mutate(`http://localhost:8000/get_shift/${user?.number}`);
        mutate('http://localhost:8000/total_shift');
        setEditerPopup(false);
    };
    

    return (
        <div>
            <Header />
            <p className="text-lg ... p-1">従業員番号：{user?.number}<span className="absolute right-4">合計時間 {total_times === "N" ? 0 : total_times}</span></p>
            <div className="flex min-h-screen flex-col items-center">
                <FullCalendar 
                    plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="dayGridMonth"
                    initialDate={operateStart}
                    height="auto"
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    events={event}
                    selectable={true}
                    dayCellClassNames={(arg) => {
                        const date = new Date(arg.date);
                        date.setHours(0,0,0,0); //時間をリセットすることで時間の影響をなくす

                        if (date >= targetStart && date <= targetEnd) {
                            return "";
                        }
                        return "highlight-range";
                    }}
                />
            </div>


            {/*popup*/}
            {popupOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <div className="text-right">
                            <button 
                                onClick={closePop} 
                                className="rounded-md border border-transparent text-lg font-bold"
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-lg ... p-1">日付：{selectedDate}</p>
                        <label className="text-lg ... p-1">開始</label>
                        <select
                            value={startHour}
                            onChange={(e) => setStartHour(e.target.value)}
                        >
                            {Array.from({ length: 16}, (_, i) => i + 8).map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                        <select
                            value={startMinutes}
                            onChange={(e) => setStarMinutes(e.target.value)}
                        >
                            {["00","15","30","45"].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        <label className="text-lg ... p-1">終了</label>
                        <select
                            value={endHour}
                            onChange={(e) => setEndHour(e.target.value)}
                        >
                            {Array.from({ length: 16}, (_, i) => i + 8).map((h) => (
                                <option key={h} value={h}>{h}</option>
                            ))}
                        </select>
                        <select
                            value={endMinutes}
                            onChange={(e) => setEndMinutes(e.target.value)}
                        >
                            {["00","15","30","45"].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>                
                        <button onClick={addEvent} className="mt-3 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">追加</button>
                        <p className="my-4 text-center border-b">登録済みシフト</p>
                        <ul>
                            {selectedDateEvents.map((item) => (
                                <li key={item.id}>
                                    {item.name}: {item.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}

            {/*editer*/}
            {editerPopup && selectedEvent && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <p className="text-center p-2">このシフト " {selectedView} " を削除しますか</p>
                        <div className="flex justify-center items-center gap-10">
                            <button onClick={deletEvent} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-sm">削除</button>
                            <button onClick={closePop} className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow-sm">閉じる</button>
                        </div>
                        <p className="my-4 text-center border-b">登録済みシフト</p>
                        <ul>
                            {selectedDateEvents.map((item) => (
                                <li key={item.id}>
                                    {item.name}: {item.title}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}