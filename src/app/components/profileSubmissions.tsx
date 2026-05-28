'use client';

import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";

type Submission = {
  id: number;
  incidentType: string;
  location: string;
  datetime: Date;
  description: string;
  createdAt: Date;
};

export function ProfileSubmissions({ submissions }: { submissions: Submission[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className='rounded-2xl border border-white/10 bg-white/[0.06] p-4 shadow-xl'>
      <button type='button' onClick={() => setOpen(!open)} className='flex w-full items-center justify-between text-left'>
        <div>
          <h2 className='text-md font-semibold text-white'>View Submissions</h2>
          <p className='text-xs text-gray-400'>{submissions.length} evidence submission{submissions.length === 1 ? '' : 's'}</p>
        </div>
        <ChevronDown className={`h-5 w-5 text-gray-300 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className='mt-4 space-y-3'>
          {submissions.length === 0 ? (
            <p className='text-sm text-gray-400'>No submissions found.</p>
          ) : submissions.map(submission => (
            <div key={submission.id} className='rounded-xl border border-white/10 bg-zinc-950/40 p-3'>
              <div className='flex items-center gap-2 text-sm font-semibold text-white'>
                <FileText className='h-4 w-4' />
                <p>{submission.incidentType}</p>
              </div>
              <p className='mt-2 text-xs text-gray-400'>{submission.location} - {new Date(submission.datetime).toLocaleString()}</p>
              <p className='mt-2 line-clamp-2 text-sm text-gray-300'>{submission.description}</p>
              <p className='mt-2 text-xs text-gray-500'>You cannot view the attachments, due to security reasons</p>
              <p className='mt-2 text-xs text-gray-500'>Submitted {new Date(submission.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}