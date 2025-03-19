"user client"
import { ReactNode, useEffect } from "react";
import axios from "axios";
import { useUser } from "./Context";
import useSWR from "swr";
import { reloadURL } from "@/patern/Patern";

async function fetcher(key:string) {
    return axios(key, { withCredentials: true }).then((res) => res.data);
  }

export default function ContentUser({ children }: { children: ReactNode}) {
    const { user, setUser } = useUser();
    const { data, error } = useSWR(reloadURL, fetcher, { revalidateOnFocus: false });

    useEffect(() => {
        if (data) {
          setUser(data);
          console.log("useSWR",data);
        }
      }, [data, setUser]);
    
    return (
        <>{children}</>
    );
}