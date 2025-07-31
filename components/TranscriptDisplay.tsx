
import React from 'react';
import type { TranscriptEntry } from '../types';
import { PlayIcon } from './Icons';

interface TranscriptDisplayProps {
  transcripts: TranscriptEntry[];
  onTimestampClick: (timestamp: number) => void;
  isLoading: boolean;
  progress: number;
}

const formatTimestamp = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({ transcripts, onTimestampClick, isLoading, progress }) => {
  const renderSkeleton = () => (
    <div className="animate-pulse flex flex-col space-y-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
          <div className="bg-slate-700 rounded-full h-8 w-20 shrink-0"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-700 rounded w-3/4"></div>
            <div className="h-4 bg-slate-700 rounded w-full"></div>
            <div className="h-4 bg-slate-700 rounded w-5/6"></div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (isLoading && transcripts.length === 0) {
      return renderSkeleton();
    }
    
    if (!isLoading && transcripts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 text-center p-8">
                <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-full mb-4"></div>
                <h3 className="text-lg font-semibold text-slate-400">Awaiting Analysis</h3>
                <p>Upload a video and start the analysis to see the timestamped transcript here.</p>
            </div>
        );
    }
    
    return (
      <div className="space-y-4">
        {transcripts.map((entry, index) => (
          <div key={index} className="flex items-start space-x-4 p-4 bg-slate-800 rounded-lg transition-all duration-300 hover:bg-slate-700/50 group">
            <button 
              onClick={() => onTimestampClick(entry.timestamp)} 
              className="flex items-center space-x-2 shrink-0 bg-slate-700 text-sky-400 px-3 py-1 rounded-full font-mono text-sm hover:bg-sky-500 hover:text-white transition-colors duration-200"
              title="Jump to this timestamp"
            >
              <PlayIcon className="w-4 h-4" />
              <span>{formatTimestamp(entry.timestamp)}</span>
            </button>
            <p className="text-slate-300 leading-relaxed">{entry.description}</p>
          </div>
        ))}
        {isLoading && transcripts.length > 0 && (
          <div className="animate-pulse flex items-start space-x-4 p-4 bg-slate-800/50 rounded-lg">
             <div className="bg-slate-700 rounded-full h-8 w-20 shrink-0"></div>
             <div className="flex-1 space-y-2">
               <div className="h-4 bg-slate-700 rounded w-3/4"></div>
             </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="bg-slate-800/50 p-6 rounded-lg h-full max-h-[calc(100vh-8rem)] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4 text-slate-200 sticky top-0 bg-slate-800/50 py-2 -mt-6 -mx-6 px-6 backdrop-blur-sm z-10 border-b border-slate-700">Scene Transcript</h2>
        {renderContent()}
    </div>
  );
};

export default TranscriptDisplay;
