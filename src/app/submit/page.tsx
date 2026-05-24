'use client';
import { useState } from "react";
import { Uploader } from "../components/upload/uploader";
import toast from "react-hot-toast";

export default function Submit() {
  const [ data, setData ] = useState({
    incident_type: '',
    location: '',
    datetime: '',
    description: '',
    comments: '',
  });
  const [uploadedKeys, setUploadedKeys] = useState<string[]>([]);

  function handleUploaded(key: string) {
    setUploadedKeys((prev) => [...prev, key]);
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/file/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evidenceUrls: uploadedKeys,
          incidentType: data.incident_type,
          location: data.location,
          datetime: data.datetime,
          description: data.description,
          comments: data.comments,
        }),
      });

      if (response.ok) {
        toast.success('Evidence submission successful');
        setUploadedKeys([]);
        setData({ incident_type: '', location: '', datetime: '', description: '', comments: '' });
      } else {
        const { message } = await response.json();
        toast.error(message);
      }
    } catch (error) {
      toast.error('An error occurred during submission');
      console.error('Submission error:', error);
    }
  }

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center p-4">
      <div className='flex flex-col items-center justify-center mt-4'>
        <h1 className='text-3xl font-black text-white'>Evidence Submission</h1>
        <p className="mb-6 mt-2 text-center text-sm text-gray-400">
          Please provide accurate details. Your identity is protected by our secure system.
        </p>
      </div>

      <form className='space-y-4 text-white w-full mt-3 rounded-3xl border border-white/10 bg-zinc-950/70 p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8'>
        <h2 className="text-lg font-semibold mb-3 text-center">Incident Details</h2>

        <label className="block mb-3">
          <span className="font-medium text-gray-300 text-sm">Type of Incident*</span>
          <select name="incident_type" required className="w-full border border-white/10 bg-white/[0.07] text-sm mt-1 p-3 rounded-xl focus:ring-2 focus:ring-emerald-300/50" value={data.incident_type} onChange={e => setData({ ...data, incident_type: e.target.value })}>
            <option value="">Select...</option>
            <option value="crime">Crime</option>
            <option value="corruption">Corruption</option>
            <option value="safety_violation">Safety Violation</option>
            <option value="harassment">Harassment</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label className="block mb-3">
          <span className="font-medium text-gray-300 text-sm">Location of Incident*</span>
          <input type="text" name="location" required className="w-full mt-1 p-3 text-sm border border-white/10 bg-white/[0.07] rounded-xl focus:ring-2 focus:ring-emerald-300/50" placeholder="City, building, street, etc." value={data.location} onChange={e => setData({ ...data, location: e.target.value })} />
        </label>

        <label className="block mb-3">
          <span className="font-medium text-gray-300 text-sm">Date & Time*</span>
          <input type="datetime-local" name="datetime" required className="w-full mt-1 p-3 text-sm border border-white/10 bg-white/[0.07] rounded-xl focus:ring-2 focus:ring-emerald-300/50" value={data.datetime} onChange={e => setData({ ...data, datetime: e.target.value })} />
        </label>

        <label className="block mb-3">
          <span className="font-medium text-gray-300 text-sm">Description of Incident</span>
          <textarea name="description" rows={4} required className="w-full mt-1 p-3 text-sm border border-white/10 bg-white/[0.07] rounded-xl focus:ring-2 focus:ring-emerald-300/50" placeholder="Provide a detailed description..." value={data.description} onChange={e => setData({ ...data, description: e.target.value })}></textarea>
        </label>

        <label className="block mb-3">
          <span className="font-medium text-gray-300 text-sm">Upload Evidence (Images, Documents)</span>
          <p className="text-xs text-gray-500 mb-2">Accepted formats: JPG, PNG, DOC, PNG, PDF. Max total size file: 5MB.</p>
        </label>
        <Uploader onUploadComplete={handleUploaded} />

        <label className="block mb-3">
          <span className="font-medium text-gray-300 text-sm">Additional Comments</span>
          <textarea name="comments" rows={3} className="w-full mt-1 p-3 text-sm border border-white/10 bg-white/[0.07] rounded-xl focus:ring-2 focus:ring-emerald-300/50" placeholder="Optional, You can include your contact details here" value={data.comments} onChange={e => setData({ ...data, comments: e.target.value })}></textarea>
        </label>

        <div className="flex justify-center">
          <button type="button" onClick={onSubmit} className="bg-emerald-400 w-full max-w-sm mt-4 hover:bg-emerald-300 cursor-pointer text-zinc-950 font-bold py-3 px-4 rounded-xl">Submit</button>
        </div>

        <p className="text-xs text-center text-gray-500">By submitting this form, you acknowledge that you have read and agree to the terms and conditions of our evidence submission policy.</p>
      </form>
    </div>
  );
}