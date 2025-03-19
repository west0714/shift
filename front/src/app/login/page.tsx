"use client"
import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';
import { useUser } from '@/context/Context';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from 'next/link';

const schema = z.object({
  usernumber: z.number().min(1, "入力が必須です"),
  password: z
    .string()
    .min(8, "8文字以上入力してください")
    .max(16, "16文字以内で入力してください"),
});

type LoginForm = z.infer<typeof schema>

export default function Login() {
    const { user, setUser } = useUser();
    const { register, handleSubmit, formState: {errors}} = useForm({ resolver: zodResolver(schema)});
    const [ errorMessage, setErrorMessage] = useState("");

    const router = useRouter();

    ///userの情報が残っていたらページ移動
    useEffect(() => {
      if (user?.role === 'admin') {
        router.push("/Kakutei");
      } else if (user?.role === 'role') {
        router.push("/Calender");
      }
    }, [user])

    const onSubmit = async(data: LoginForm) => {
      try {
        const response = await axios.post("http://localhost:8000/login",
            {"usernumber":data.usernumber, "password":data.password},
            {
                headers: {"Content-Type": "application/json",},
                withCredentials: true,
            }
        );
        console.log("login:",response.data);
        setUser(response.data);
        if (response.data.role === 'admin') {
          console.log("admin")
          router.push("/Kakutei");
        } else if (response.data.role === 'user'){
          console.log("user")
          router.push("/Calender");
        }
      } catch (error:any) {
        if (error.response) {
          setErrorMessage(error.response.data.detail);
        } else {
          setErrorMessage("入力が間違っています")
        }
      }
    };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
          <form onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <input
                    type='number'
                    placeholder='従業員番号'
                    {...register("usernumber", {valueAsNumber: true})}
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.usernumber && <span className=''>{errors.usernumber.message}</span>}
                </div>
                <div>
                  <input
                    type='password'
                    placeholder='パスワード(半角英数字8-16文字)'
                    {...register("password")}
                    className="mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {errors.password && <span className=''>{errors.password.message}</span>}
                </div>
                <button
                  type='submit' 
                  className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
                >
                  ログイン
                </button>
          </form>
          {errorMessage && <p className='pt-2 text-red-600'>{errorMessage}</p>}
          <div className='pt-5 text-center'>
            <Link href="/NewUser" className='font-medium text-blue-600 dark:text-blue-500 hover:underline'>新規登録</Link>
          </div>
        </div>
      </div>
    );
}