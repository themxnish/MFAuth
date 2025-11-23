/* eslint-disable @next/next/no-img-element */
'use client'
import { useCallback, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "./card";
import { toast } from 'react-hot-toast';
import { cn } from "@/lib/utils";
import { v4 as uuidv4 } from 'uuid';

export function Uploader({ onUploadComplete }: { onUploadComplete: (key: string) => void }) {
    const [ files, setFiles ] =  useState<Array<{id: string; file: File; uploading: boolean; progress: number; isDeleting: boolean; error: boolean; objectUrl: string;}>>([]);

    async function uploadFile(file: File) {
        setFiles((prevFiles) => prevFiles.map((f) => 
            f.file === file ? { ...f, uploading: true } : f
        ));

        try {
           const response = await fetch('/api/file/upload', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}, 
            body: JSON.stringify({
                fileName: file.name,
                contentType: file.type,
                size: file.size,
            }),
           });

            if (!response.ok) {
                toast.error("Failed to get presigned URL");

                setFiles((prevFiles) => prevFiles.map((f) => 
                    f.file === file ? { ...f, uploading: false, progress: 0, error: true } : f
                ));
                return;
            }

            const { presignedUrl, key } = await response.json();

            await new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const progress = (event.loaded / event.total) * 100;
                        setFiles((prevFiles) => prevFiles.map((f) => 
                            f.file === file ? { ...f, progress: Math.round(progress), key: key } : f
                        ));
                    }
                };
                xhr.onload = () => {
                    if (xhr.status === 200 || xhr.status === 204) {
                        setFiles((prevFiles) => prevFiles.map((f) => 
                            f.file === file ? { ...f, progress: 100, uploading: false, error: false } : f
                        ));
                        toast.success('File uploaded successfully');
                        onUploadComplete(key);
                        resolve(true);
                    } else {
                        reject(new Error("Upload failed: " + xhr.status));
                    }
                };
                xhr.onerror = () => {
                    reject(new Error("Upload error"));
                }
                xhr.open("PUT", presignedUrl);
                xhr.setRequestHeader("Content-Type", file.type);
                xhr.send(file);
            });

        } catch (error) {
            toast.error("Upload failed" + (error instanceof Error ? `: ${error.message}` : ""));
            setFiles((prevFiles) => prevFiles.map((f) => 
                f.file === file ? { ...f, uploading: false, progress: 0, error: true } : f
            ));
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if(acceptedFiles && acceptedFiles.length) {
            setFiles((prevFiles) => [
                ...prevFiles,
                ...acceptedFiles.map((file) => ({
                    id: uuidv4(),
                    file: file,
                    uploading: false,
                    progress: 0,
                    isDeleting: false,
                    error: false,
                    objectUrl: URL.createObjectURL(file),
                }))
            ]);
        }
        acceptedFiles.forEach(uploadFile);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onDropRejected = useCallback((fileRejections: FileRejection[]) => {
        if (fileRejections && fileRejections.length > 0) {
            const manyFiles = fileRejections.find(
                (fileRejection) => fileRejection.errors[0].code === 'too-many-files'
            )

            const largeFile = fileRejections.find(
                (fileRejection) => fileRejection.errors[0].code === 'file-too-large'
            )

            if (manyFiles) {
                toast.error("You can upload a maximum of 5 files at a time.");
            } else if (largeFile) {
                toast.error("You can upload a maximum of 5 MB per file.");
            }
        }
    }, []); 

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        maxFiles: 5,
        maxSize: 1024 * 1024 * 5,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png"],
            "application/pdf": [".pdf"],
            "application/msword": [".doc", ".docx"],
        }
    });

    return (
        <div className="p-4 w-full">
            <Card className={cn("relative border-2 rounded-2xl border-dashed border-gray-400 p-4 transition-colors duration-200 ease-in-out w-full h-40 shadow-xl",
                isDragActive ? "bg-gray-200/20 border-yellow-200 border-solid" : "border-dashed hover:border-yellow-200 bg-gray-100/20 border-gray-300"
             )} {...getRootProps()}>

                <CardContent className="flex flex-col items-center justify-center h-full w-full">
                    <input {...getInputProps()} />
                    {isDragActive ? (
                        <p>Drop the files here ...</p> 
                    ) : ( 
                        <div className="flex flex-col items-center justify-center gap-y-3">
                            <p>Drag and drop some files here, or click to select files</p>
                            <button className="bg-gray-400 py-1 px-2 rounded-lg shadow-xl flex-1 cursor-pointer">Select files</button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mt-6">
                {files.map((file) => (
                    <div key={file.id} className="flex flex-col gap-1">
                        <div className="relative aspect-square rounded-lg overflow-hidden">
                            <img src={file.objectUrl} alt={file.file.name} className="w-full h-32 object-cover" />
                            {file.uploading && !file.isDeleting && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <p className="text-white font-semibold text-lg">
                                        {file.progress}%
                                    </p>
                                </div>
                            )}
                        </div>
                        <p className="text-sm mt-2 text-gray-300 text-center truncate">{file.file.name}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}