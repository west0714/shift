"use client"
import { useUser } from '@/context/Context';
import { logoutURL } from '@/patern/Patern';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import React from 'react';

export default function Header() {
    const { user, setUser } = useUser();

    const router = useRouter();
    const handlelogout = async() => {
        try {
            await axios.post(logoutURL, {}, { withCredentials: true });
            setUser(null);
            console.log("logout");
            router.push("/login");
        } catch (error) {
            console.log("error", error);
        }
    };

    return (
        <header className="bg-gray-400 text-white shadow-md">
            <div className="mx-auto flex max-w-7xl justify-center p-2">
                <nav>
                    {user?.role == "admin" ? (
                        <>
                            <Link href="/Kakutei">確定</Link> |{' '}
                            <Link href="/User">ユーザー管理</Link>
                        </>
                    ): (
                        <>
                            <Link href="/Calender">シフト提出</Link> |{' '}
                            <Link href="/Kakutei">確定</Link>
                        </>
                    )}
                </nav>
                <button 
                    onClick={handlelogout} 
                    className='absolute right-4'
                >
                    ログアウト
                </button>
            </div>
        </header>
    );
}