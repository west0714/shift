"use client"
import { createContext, useState, useContext, ReactNode, useEffect } from "react";

type User = {
    number: number;
    role: string;
} | null;

type ContextType = {
    user: User;
    setUser: (user: User) => void;
};

//デフォルトの値を設定しておく
const defaultValue: ContextType = {
    user: null,
    setUser: () => {},
};

const UserContext = createContext<ContextType>(defaultValue);

export const UserProvider = ({ children }: {children: ReactNode}) => {
    const [user, setUser] = useState<User>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    return context;
};