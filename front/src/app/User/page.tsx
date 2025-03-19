"use client";
import axios from "axios";
import { getUserURL } from "@/patern/Patern";
import useSWR, { mutate } from "swr";
import Header from "@/components/Header";

type UserItem = {
    number: number;
    name: string;
    role: string;
};

async function fetcher(key:string) {
    return axios(key, { withCredentials: true }).then((res) => res.data as Promise<UserItem[]>);
};

export default function UserIchiran() {
    const { data, error } = useSWR(getUserURL, fetcher);

    const deletUser = async(id:number) => {
        if (!confirm("削除しますか？")) return;
        try {
            const response = await axios.get(`http://localhost:8000/deletUser/${id}`);
            console.log(response.data);
            mutate(getUserURL);
        } catch (error) {
            console.log(error);
            alert("失敗しました");
        }
    };

    const editRole = async(id:number) => {
        try {
            const response = await axios.get(`http://localhost:8000/editrole/${id}`);
            console.log(response.data);
            mutate(getUserURL);
        } catch (error) {
            console.log(error);
            alert("失敗しました");
        }
    };

    return (
        <>
            <Header />
            <div className="bg-white p-8 rounded-lg w-full justify-center">
                <h2 className="pb-4 text-2xl font-bold text-center text-gray-800">登録ユーザー一覧</h2>
                <table className="min-w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border p-2">従業員番号</th>
                            <th className="border p-2">名前</th>
                            <th className="border p-2">権限</th>
                            <th className="border p-2">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.map((item) => (
                            <tr key={item.number} className="text-center">
                                <td className="border p-2">{item.number}</td>
                                <td className="border p-2">{item.name}</td>
                                <td className="border p-2">
                                    <button 
                                        onClick={() => editRole(item.number)}
                                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                    >
                                        {item.role}
                                    </button>
                                </td>
                                <td className="border p-2">
                                    <button
                                        onClick={() => deletUser(item.number)}
                                        className="bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                                    >削除</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}