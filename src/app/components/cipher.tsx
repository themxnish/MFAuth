'use client';

import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Copy, LockKeyhole, Sparkles, UnlockKeyhole } from 'lucide-react';

const encode = (text: string) => {
  return new TextEncoder().encode(text);
}
const decode = (buffer: ArrayBuffer) => {
  return new TextDecoder().decode(buffer);
}

const byteToBase64 = (bytes: Uint8Array) => {
    return btoa(String.fromCharCode(...bytes));
}

const base64ToBytes = (base64: string) => {
    return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

const deriveKey = async (password: string, salt: Uint8Array, usage: KeyUsage[]) => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encode(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt, 
      iterations: 100000, 
      hash: 'SHA-256', 
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false, 
    usage
  );
};

export default function Cipher() {
  const [ password, setPassword ] = useState('');
  const [ textToEncrypt, setTextToEncrypt ] = useState('');
  const [ textToDecrypt, setTextToDecrypt ] = useState('');
  const [ output, setOutput ] = useState('');

  const handleEncrypt = async () => {
    if (!password) return toast.error('Please enter a password.');

    try {
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const iv = crypto.getRandomValues(new Uint8Array(12));

      const key = await deriveKey(password, salt, ['encrypt']);

      const ciphertext = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv }, 
        key,
        encode(textToEncrypt) 
      );

      const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
      combined.set(salt); 
      combined.set(iv, salt.length); 
      combined.set(new Uint8Array(ciphertext), salt.length + iv.length); 

      const result = byteToBase64(combined);
      setOutput(result);
      toast.success('Text encrypted successfully!');
    } catch {
      toast.error('Encryption failed. Check your password and input.');
    }
  };

  const handleDecrypt = async () => {
    if (!password) return toast.error('Please enter a password. ');

    try {
      const data = base64ToBytes(textToDecrypt); 

      const salt = data.slice(0, 16);
      const iv = data.slice(16, 28);
      const encrypted = data.slice(28);

      const key = await deriveKey(password, salt, ['decrypt']);

      const decrypted = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
      );

      const result = decode(decrypted);
      setOutput(result);
      toast.success('Text decrypted successfully!');
    } catch {
      toast.error('Decryption failed. Check your password and input.');
    }
  };

  const copyText = () =>{
    navigator.clipboard.writeText(output);
    toast.success('Copied to clipboard!');
  }

  return (
  <div className='flex items-center justify-center'>
    <div className='w-full max-w-3xl rounded-3xl border border-white/10 bg-zinc-950/70 shadow-2xl shadow-black/30 p-5 sm:p-8 space-y-6 backdrop-blur'>
      <div className='flex flex-col gap-2 text-center'>
        <div className='mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-400/10 text-emerald-200 ring-1 ring-emerald-300/20'>
          <Sparkles className='h-5 w-5' />
        </div>
        <h1 className='text-2xl font-bold text-white'>Cipher Tool</h1>
        <p className='text-sm text-gray-400'>Encrypt or decrypt sensitive text locally with your password.</p>
      </div>

      <div className='space-y-2 mb-4'>
        <label className='text-md font-semibold text-gray-300'>Password</label>
        <input type="password" placeholder="Enter Key" value={password} onChange={(e) => setPassword(e.target.value)} className='w-full mt-2 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.07] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300/50' />
      </div>

      <div className='space-y-2 mb-2'>
        <label className='text-md font-semibold text-gray-300'>Encrypt Text</label>
        <textarea placeholder="Enter text to encrypt" rows={3} value={textToEncrypt} onChange={(e) => setTextToEncrypt(e.target.value)} className='w-full mt-2 mb-4 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.07] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300/50' />
      </div>

      <div className='space-y-2 mb-4'>
        <label className='text-md font-semibold text-gray-300'>Decrypt Text</label>
        <textarea placeholder="Enter text to decrypt" rows={3} value={textToDecrypt} onChange={(e) => setTextToDecrypt(e.target.value)} className='w-full mt-2 mb-4 px-4 py-3 rounded-xl border border-white/10 bg-white/[0.07] text-white placeholder:text-gray-500 focus:ring-2 focus:ring-emerald-300/50' />
      </div>

      <div className='flex flex-col gap-3 justify-center sm:flex-row'>
        <button onClick={handleEncrypt} className='w-full px-6 py-3 rounded-xl bg-emerald-400 text-zinc-950 font-bold cursor-pointer hover:bg-emerald-300 flex items-center justify-center gap-2'><LockKeyhole className='h-4 w-4' />Encrypt</button>
        <button onClick={handleDecrypt} className='w-full px-6 py-3 rounded-xl bg-white/10 font-semibold text-white cursor-pointer hover:bg-white/15 flex items-center justify-center gap-2'><UnlockKeyhole className='h-4 w-4' />Decrypt</button>
      </div>
      
      {output && (
        <div>
        <h2 className='text-center text-lg font-semibold text-gray-300 mb-2'>Output</h2>
        <div className='border border-white/10 bg-black/30 text-white p-4 rounded-2xl shadow-xl'>
          <p className='text-md whitespace-pre-wrap break-words'>{output}</p>
        </div>
        
        <button onClick={copyText} className='w-full px-6 py-3 rounded-xl bg-white/10 font-semibold text-white mt-4 hover:bg-white/15 flex items-center justify-center gap-2'><Copy className='h-4 w-4' />Copy</button>
        </div>
      )}
    </div>
  </div>
  );
}
