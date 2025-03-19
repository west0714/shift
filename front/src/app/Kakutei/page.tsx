"use client";
import { useState } from "react";
import { MonthOptions } from "../../patern/Patern";
import Header from "@/components/Header";
import axios from "axios";

interface Shifts {
    dates: string[];
    shifts: {user_id: number; name: string; [key: string]: string | number}[];
}

export default function Kakutei() {
    const [selectMonth, setSelectMonth] = useState("");
    const [selectYear, setSelectYear] = useState("");
    const [section, setSection] = useState("前半");
    const [kakutei, setKakutei] = useState<Shifts>(); 

    const now = new Date();
    const year = now.getFullYear() -1 ;

    //一覧
    const handlekakutei = async () => {
        const date = selectYear + "-" + selectMonth + section
        try {
            const response = await axios.get(`http://localhost:8000/kakutei_shift/${date}`)
            setKakutei(response.data)
        } catch (error) {
            console.error("送信エラー：", error);
            alert("失敗しました");
        }
        console.log(kakutei)
    };

    return (
        <div>
            <Header />
            <h1 className="text-center font-bold text-xl mt-2 text-gray-800">確定シフト</h1>
            <div className="flex mx-3 gap-2">
                <select
                    value={selectYear}
                    onChange={(e) => setSelectYear(e.target.value)}
                >
                    <option value="" disabled>--年--</option>
                    {Array.from({ length: 2}, (_, i) => i + year).map((h) => (
                        <option key={h} value={h}>{h}</option>
                    ))}
                </select>
                <select
                    value={selectMonth}
                    onChange={(e) => setSelectMonth(e.target.value)}
                >
                    <option value="" disabled>--月--</option>
                    {MonthOptions.map((m) => (
                        <option key={m.key} value={m.key}>{m.value}月</option>
                    ))}
                </select>
                <select
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                >
                    {["前半","後半"].map((m) => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
                <button 
                    onClick={handlekakutei}
                    className="rounded-md px-4 py-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                    検索
                </button>
            </div>
            <div className="flex justify-center m-1">
                <p>{selectYear}/</p>
                <p>{selectMonth}</p>
            </div>
            <table className="w-full table-fixed border-collapse border border-gray-300">
                <thead>
                    <tr>
                        <th className="border-collapse border border-gray-300 w-[55px]">従業員番号</th>
                        <th className="border-collapse border border-gray-300 w-[60px]">名前</th>
                        {kakutei?.dates?.map((date) => (
                            <th key={date} className="border-collapse border border-gray-300">{date}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {kakutei?.shifts?.map((shift) => (
                        <tr key={shift.user_id}>
                            <td className="border-collapse border border-gray-300 text-center ">{shift.user_id}</td>
                            <td className="border-collapse border border-gray-300 text-center">{shift.name}</td>
                            {kakutei.dates?.map((date) => (
                                <td key={`${shift.user_id}-${date}`} className="border-collapse border border-gray-300 text-center">{shift[date] || ""}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
};