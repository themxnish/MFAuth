'use client'

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Globe, Terminal, Wifi, Trash2, Loader2 } from "lucide-react";
import { toast } from 'react-hot-toast';

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
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ deletingLogId, setDeletingLogId ] = useState<number | null>(null);
    const [ isClearing, setIsClearing ] = useState(false);
    const logsPerPage = 5;
    const totalPages = Math.ceil(logs.length / logsPerPage);
    const startIndex = (currentPage - 1) * logsPerPage;
    const currentLogs = logs.slice(startIndex, startIndex + logsPerPage);

    const fetchLogs = async () => {
        const response = await fetch('/api/profile/activity');
        const data = await response.json();
        if (response.ok) {
            setLogs(data.logs);
            setCurrentPage(1);
        } else {
            toast.error(data.message);
        }
    }

    useEffect(() => {
        fetchLogs();
    }, [])

    useEffect(() => {
        if (currentPage > 1 && currentPage > totalPages) {
            setCurrentPage(totalPages || 1);
        }
    }, [currentPage, totalPages])

    const deleteLog = async (logId: number) => {
        const confirmed = confirm('Delete this activity log?');
        if (!confirmed) return;

        setDeletingLogId(logId);
        try {
            const response = await fetch('/api/profile/activity', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ logId }),
            });
            const data = await response.json();

            if (response.ok) {
                setLogs(prev => prev.filter(log => log.id !== logId));
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete activity log');
        } finally {
            setDeletingLogId(null);
        }
    }

    const clearLogs = async () => {
        const confirmed = confirm('Delete all of your activity logs? This cannot be undone.');
        if (!confirmed) return;

        setIsClearing(true);
        try {
            const response = await fetch('/api/profile/activity', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (response.ok) {
                setLogs([]);
                setCurrentPage(1);
                toast.success(data.message);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to delete activity logs');
        } finally {
            setIsClearing(false);
        }
    }

    return(
        <div className='mx-auto max-w-6xl p-4'>
            <div className='flex flex-col items-center justify-center mt-4'>
                <h1 className='text-3xl font-black text-white'>User Activity Logs</h1>
                <p className="mb-6 mt-2 text-center text-sm text-gray-400">
                    Review your recent activities for security insights. If you notice any unfamiliar actions, please change your password immediately.
                </p>
            </div>

            <div className='rounded-3xl border border-white/10 mt-3 bg-zinc-950/60 px-4 py-6 shadow-2xl shadow-black/30 backdrop-blur sm:px-8'>
                {logs.length === 0 ? (
                    <p className='text-gray-400 text-sm text-center'>No activity logs found as of now.</p>
                ) : (
                    <>
                    <div className='mb-5 flex justify-end'>
                        <button type='button' disabled={isClearing} onClick={clearLogs} className='inline-flex items-center gap-2 rounded-xl border border-red-300/20 bg-red-400/15 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-400/25 disabled:cursor-not-allowed disabled:opacity-50'>
                            {isClearing ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
                            Clear logs
                        </button>
                    </div>
                    {totalPages > 1 && (
                        <div className='mb-6 flex flex-col items-center justify-between gap-3 sm:flex-row'>
                            <p className='text-sm text-gray-400'>
                                Showing {startIndex + 1}-{Math.min(startIndex + logsPerPage, logs.length)} of past {logs.length} activities
                            </p>

                            <div className='flex items-center gap-2'>
                                <button type='button' disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className='rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40'>
                                    <ChevronLeft className='h-4 w-4' />
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => (
                                    <button key={index + 1} type='button' onClick={() => setCurrentPage(index + 1)} className={`rounded-xl border px-3 py-2 text-sm font-semibold ${currentPage === index + 1 ? 'border-white bg-white text-black' : 'border-white/10 bg-white/[0.06] text-white hover:bg-white/[0.1]'}`}>
                                        {index + 1}
                                    </button>
                                ))}

                                <button type='button' disabled={currentPage === totalPages} onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className='rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-sm text-white hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-40'>
                                    <ChevronRight className='h-4 w-4' />
                                </button>
                            </div>
                        </div>
                    )}
                    <ul className='space-y-3 mt-4'>
                    {currentLogs.map(log => (
                    <li key={log.id} className='border border-white/10 bg-white/[0.06] text-white rounded-2xl p-4 shadow-xl flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-between md:space-x-6 space-y-2 md:space-y-0'>
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
                        <button type='button' disabled={deletingLogId === log.id || isClearing} onClick={() => deleteLog(log.id)} className='inline-flex items-center justify-center gap-2 rounded-xl border border-red-300/20 bg-red-400/15 px-3 py-2 text-sm font-semibold text-red-100 hover:bg-red-400/25 disabled:cursor-not-allowed disabled:opacity-50'>
                            {deletingLogId === log.id ? <Loader2 className='h-4 w-4 animate-spin' /> : <Trash2 className='h-4 w-4' />}
                            Delete
                        </button>
                    </li>
                    ))}
                    </ul>
                    </>
                )}
            </div>
        </div>
    )
}
