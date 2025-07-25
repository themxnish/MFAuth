'use client'

import { useState, useEffect } from 'react';
import { Clock, MapPin, Globe, Terminal, Wifi } from "lucide-react";

interface Log {
    id: number;
    event: string;
    ip: string;
    location: string;
    isp: string;
    loggedAt: string;
}

export default function Activity() {
    const [ logs, setLogs ] = useState([] as Log[]);

    useEffect(() => {
        const fetchLogs = async () => {
            const response = await fetch('/api/profile/activity');
            const data = await response.json();
            setLogs(data.logs);
        }
        fetchLogs();
    }, [])

    return(
        <div className='p-4'>
            <div className='flex items-center justify-center mt-4'>
                <h1 className='text-2xl font-bold text-white mb-6'>User Activity Logs</h1>
            </div>

        <div className='px-8 py-6'>
            {logs.length === 0 ? (
                <p className='text-gray-500 text-sm'>No activity logs found as of now.</p>
            ) : (
                <ul className='space-y-3 mt-4'>
                {logs.map(log => (
                <li key={log.id} className='bg-[#3B3B3B] text-white rounded-xl p-3 shadow-xl flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between md:space-x-6 space-y-2 md:space-y-0'>
                    <div className='flex items-center gap-2 font-semibold'>
                        <Terminal className='w-4 h-4' />
                        {log.event}
                    </div>  
                    {log.ip && (
                        <div className='flex items-center text-sm gap-2'>
                            <Globe className='w-4 h-4' />
                            <span className='font-semibold'>IP: </span><p className='text-gray-400'>{log.ip}</p>
                        </div>  
                    )}
                    {log.location && (
                        <div className='flex items-center text-sm gap-2'>
                            <MapPin className='w-4 h-4' />
                            <span className='font-semibold'>Location: </span><p className='text-gray-400'>{log.location}</p>
                        </div>
                    )}
                    {log.isp && (
                        <div className='flex items-center text-sm gap-2'>
                            <Wifi className='w-4 h-4' />
                            <span className='font-semibold'>ISP: </span><p className='text-gray-400'>{log.isp}</p>
                        </div>
                    )}
                    <div className='flex items-center text-sm gap-2 truncate'>
                        <Clock className='w-4 h-4' />
                        <span className='font-semibold'>Time: </span><p className='text-gray-400 '>{new Date(log.loggedAt).toLocaleString()}</p>
                    </div>
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    )
}