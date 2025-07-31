
import React from 'react';
import { UploadIcon } from './Icons';

interface FileUploaderProps {
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading: boolean;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileChange, isLoading }) => {
  return (
    <div className="w-full">
      <label
        htmlFor="video-upload"
        className={`
          flex flex-col items-center justify-center w-full h-48 
          border-2 border-dashed rounded-lg cursor-pointer
          bg-slate-800 border-slate-600 
          hover:bg-slate-700 hover:border-sky-500
          transition-colors duration-300
          ${isLoading ? 'cursor-not-allowed opacity-50' : ''}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadIcon className="w-10 h-10 mb-3 text-slate-400" />
          <p className="mb-2 text-sm text-slate-400">
            <span className="font-semibold text-sky-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-slate-500">MP4, MOV, WEBM or any video file</p>
        </div>
        <input
          id="video-upload"
          type="file"
          className="hidden"
          accept="video/*"
          onChange={onFileChange}
          disabled={isLoading}
        />
      </label>
    </div>
  );
};

export default FileUploader;
