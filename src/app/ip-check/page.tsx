'use client';

import { useState } from 'react';
import type { ElementType, FormEvent } from 'react';
import { Activity, AlertTriangle, CheckCircle2, Globe, Loader2, Network, Radar, Search, Server, ShieldAlert, ShieldCheck, Wifi } from 'lucide-react';
import toast from 'react-hot-toast';

type ReputationData = {
    ipAddress: string;
    isPublic: boolean;
    ipVersion: number;
    isWhitelisted: boolean;
    abuseConfidenceScore: number;
    countryCode: string | null;
    usageType: string | null;
    isp: string | null;
    domain: string | null;
    hostnames: string[];
    totalReports: number;
    numDistinctUsers: number;
    lastReportedAt: string | null;
};

export default function IpCheck() {
    const [ ip, setIp ] = useState('');
    const [ result, setResult ] = useState<ReputationData | null>(null);
    const [ loading, setLoading ] = useState(false);

    const scoreLabel = (score: number) => {
        if (score >= 75) return 'High Risk';
        if (score >= 25) return 'Suspicious';
        return 'Clean';
    }

    const scoreStyle = (score: number) => {
        if (score >= 75) return 'border-red-300/30 bg-red-400/15 text-red-100';
        if (score >= 25) return 'border-yellow-300/30 bg-yellow-400/15 text-yellow-100';
        return 'border-emerald-300/30 bg-emerald-400/15 text-emerald-100';
    }

    const onSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!ip.trim()) {
            toast.error('Please enter an IP address');
            return;
        }

        setLoading(true);
        setResult(null);
        try {
            const response = await fetch(`/api/ip-check?ip=${encodeURIComponent(ip.trim())}`);
            const data = await response.json();

            if (response.ok) {
                setResult(data.data.data);
                toast.success('IP reputation checked');
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Failed to check IP reputation');
        } finally {
            setLoading(false);
        }
    }

    const Detail = ({ icon: Icon, label, value }: { icon: ElementType; label: string; value: string | number | boolean | null | undefined }) => (
        <div className='rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl'>
            <div className='flex items-center gap-2 text-sm font-semibold text-white'>
                <Icon className='h-4 w-4 text-emerald-300' />
                {label}
            </div>
            <p className='mt-2 break-words text-sm text-gray-300'>{value === null || value === undefined || value === '' ? 'Unknown' : String(value)}</p>
        </div>
    );

    return (
        <div className='mx-auto max-w-6xl p-4'>
            <div className='flex flex-col items-center justify-center mt-4'>
                <h1 className='text-3xl font-black text-white'>IP Reputation Check</h1>
                <p className='mb-6 mt-2 text-center text-sm text-gray-400'>
                    Inspect an IP address for abuse reports, network identity, and threat confidence before trusting it.
                </p>
            </div>

            <div className='rounded-3xl border border-white/10 mt-3 bg-zinc-950/70 px-4 py-6 shadow-2xl shadow-black/30 backdrop-blur sm:px-8'>
                <form onSubmit={onSubmit} className='grid gap-3 sm:grid-cols-[1fr_auto]'>
                    <label className='block'>
                        <span className='font-medium text-gray-300 text-sm'>IP Address</span>
                        <input type='text' value={ip} onChange={(e) => setIp(e.target.value)} placeholder='8.8.8.8 or 2001:4860:4860::8888' className='mt-1 w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3 text-sm text-white shadow-xl outline-none focus:ring-2 focus:ring-emerald-300/50' />
                    </label>
                    <button type='submit' disabled={loading} className='inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 text-sm font-bold text-zinc-950 shadow-xl hover:bg-emerald-300 disabled:cursor-not-allowed disabled:opacity-60 sm:self-end'>
                        {loading ? <Loader2 className='h-4 w-4 animate-spin' /> : <Search className='h-4 w-4' />}
                        Check Reputation
                    </button>
                </form>

                {!result && (
                    <div className='mt-6 rounded-2xl border border-white/10 bg-white/[0.04] p-5 text-center'>
                        <Radar className='mx-auto h-8 w-8 text-emerald-300' />
                        <p className='mt-3 text-sm text-gray-400'>Enter an IP address to generate a security reputation snapshot.</p>
                    </div>
                )}

                {result && (
                    <div className='mt-6 space-y-5'>
                        <div className={`rounded-3xl border p-5 ${scoreStyle(result.abuseConfidenceScore)}`}>
                            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
                                <div className='flex items-center gap-3'>
                                    {result.abuseConfidenceScore >= 25 ? <ShieldAlert className='h-8 w-8' /> : <ShieldCheck className='h-8 w-8' />}
                                    <div>
                                        <p className='text-sm font-semibold opacity-80'>Reputation Verdict</p>
                                        <h2 className='text-2xl font-black'>{scoreLabel(result.abuseConfidenceScore)}</h2>
                                    </div>
                                </div>
                                <div className='text-left md:text-right'>
                                    <p className='text-sm font-semibold opacity-80'>Abuse Confidence</p>
                                    <p className='text-4xl font-black'>{result.abuseConfidenceScore}%</p>
                                </div>
                            </div>
                            <div className='mt-4 h-3 overflow-hidden rounded-full bg-black/30'>
                                <div className='h-full rounded-full bg-current transition-all' style={{ width: `${result.abuseConfidenceScore}%` }} />
                            </div>
                        </div>

                        <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
                            <Detail icon={Globe} label='IP Address' value={result.ipAddress} />
                            <Detail icon={Network} label='IP Version' value={`IPv${result.ipVersion}`} />
                            <Detail icon={Activity} label='Total Reports' value={result.totalReports} />
                            <Detail icon={Wifi} label='Distinct Reporters' value={result.numDistinctUsers} />
                        </div>

                        <div className='grid gap-3 md:grid-cols-2'>
                            <Detail icon={Server} label='ISP' value={result.isp} />
                            <Detail icon={Globe} label='Domain' value={result.domain} />
                            <Detail icon={CheckCircle2} label='Public IP' value={result.isPublic ? 'Yes' : 'No'} />
                            <Detail icon={AlertTriangle} label='Whitelisted' value={result.isWhitelisted ? 'Yes' : 'No'} />
                            <Detail icon={Network} label='Usage Type' value={result.usageType} />
                            <Detail icon={Globe} label='Country' value={result.countryCode} />
                        </div>

                        <div className='rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl'>
                            <div className='flex items-center gap-2 text-sm font-semibold text-white'>
                                <Server className='h-4 w-4 text-emerald-300' />
                                Hostnames
                            </div>
                            <div className='mt-3 flex flex-wrap gap-2'>
                                {result.hostnames?.length ? result.hostnames.map(hostname => (
                                    <span key={hostname} className='rounded-full border border-white/10 bg-white/[0.07] px-3 py-1 text-xs text-gray-300'>{hostname}</span>
                                )) : (
                                    <p className='text-sm text-gray-400'>No hostnames found.</p>
                                )}
                            </div>
                        </div>

                        <p className='text-center text-xs text-gray-500'>
                            Last reported: {result.lastReportedAt ? new Date(result.lastReportedAt).toLocaleString() : 'No recent report found'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}