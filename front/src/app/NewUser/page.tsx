"use client";
import React, { useState } from "react";
import axios from "axios";
import { newUserURL } from "@/patern/Patern";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";

const schema = z.object({
    usernumber: z.number().min(1, "入力は必須です"),
    username: z.string().min(1, "入力は必須です"),
    password: z
        .string()
        .min(8, "8文字以上入力してください")
        .max(16, "16文字以内で入力してください")
        .regex(/[a-zA-Z]/,"半角英字を一文字以上含めてください")
        .regex(/\d/,"数字を１つ以上含めてください")
        .regex(/[!?$&@-]/, "!?$&@- のうちどれか１つの記号を含めてください"),
    role: z.string().min(1, "選択は必須です"),
});

type LoginForm = z.infer<typeof schema>

export default function User() {
    const { register, handleSubmit, formState: {errors}} = useForm({ resolver: zodResolver(schema)})
    const [ errorMessage, setErrorMessage ] = useState("");

    const router = useRouter();

    //ユーザーをDBに保存
    const registarUser = async(data: LoginForm) => {
        try {
            const payload = {
                number: data.usernumber,
                name: data.username,
                password: data.password,
                role: data.role
            };
            const response = await axios.post(newUserURL, payload );
            console.log("送信完了：", response.data);
            alert(`登録されました`);
            router.push("/login");
        } catch (error:any) {
            if (error.response) {
                setErrorMessage(error.response.data.detail);
            } else {
                setErrorMessage("入力が間違っています")
            }
        }
    };

    return (
        <>
            <div className="flex min-h-screen items-center justify-center bg-gray-100">
                <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-xl">
                    <h1 className="text-2xl font-bold text-center text-gray-800">新規登録</h1>
                    <form onSubmit={handleSubmit(registarUser)}>
                        <div>
                            <label className="p-1">従業員番号</label>
                            <input
                                type="number"
                                placeholder="従業員番号"
                                {...register("usernumber", {valueAsNumber: true})}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.usernumber && <span>{errors.usernumber.message}</span>}
                        </div>
                        <div>
                            <label className="p-1">名前</label>
                            <input
                                type="text"
                                placeholder="例：山田"
                                {...register("username")}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.username && <span>{errors.username.message}</span>}
                        </div>
                        <div>
                            <label className="p-1">パスワード</label>
                            <input
                                type="text"
                                placeholder="パスワード(半角英数字8-16文字 !?$&@-１つ以上)"
                                {...register("password")}
                                className="mt-1 w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.password && <span>{errors.password.message}</span>}
                        </div>
                        <div>
                        <select
                            {...register("role")}
                            className="text-lg border border-gray-300 shadow-sm rounded-sm focus:outline-none focus:ring-2 focus:ring-blue-400 mt-2 p-1"
                        >
                            <option value="" disabled>--権限--</option>
                            {["ユーザー"].map((m) => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                        </div>
                        {errors.role && <span>{errors.role.message}</span>}
                        <button 
                            type="submit"
                            className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                        >
                            登録
                        </button>
                    </form>
                    {errorMessage && <p className='pt-2 text-red-600'>{errorMessage}</p>}
                </div>
            </div>
        </>
    );
}