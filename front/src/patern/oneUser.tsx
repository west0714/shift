import axios from "axios";
import useSWR from "swr";


interface Event {
    id: string;
    title: string;
    date: string;
    user_id: number | null;
};

interface EventsResponse  {
    total_time: string;
    data: Event[];
}

interface Events {
    name: string;
    id: string;
    title: string;
    date: string;
};

async function fetcher(key:string) {
    return axios(key, { withCredentials: true }).then((res) => res.data as Promise<EventsResponse>);
}

async function fetcher_2(key:string) {
    return axios(key, { withCredentials: true }).then((res) => res.data as Promise<Events[]>);
}

export const oneUser = (id: number | null) => {
    const {data, error } = useSWR(id? `http://localhost:8000/get_shift/${id}`: null ,fetcher);
    
    return {
        total_times: data?.total_time,
        event: data?.data,
    };
};

export const allUser =() => {
    const {data, error} = useSWR(
        'http://localhost:8000/total_shift',
        fetcher_2, {
            refreshInterval: 300000 //3分（1分⇒60000ms(ミリ秒)）
        }
    );

    return {
        totalEvents: data,
    }
};