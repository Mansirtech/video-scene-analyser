
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { TranscriptEntry } from './types';
import { analyzeFrame } from './services/geminiService';
import FileUploader from './components/FileUploader';
import VideoPlayer from './components/VideoPlayer';
import TranscriptDisplay from './components/TranscriptDisplay';
import { WandIcon } from './components/Icons';

// The interval in seconds between frame captures
const ANALYSIS_INTERVAL = 5; 

const App: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [transcripts, setTranscripts] = useState<TranscriptEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // If there's an old URL, revoke it first
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setTranscripts([]);
      setError(null);
      setProgress(0);
    }
  };

  const captureFrame = async (video: HTMLVideoElement): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            // Using JPEG for smaller file size, quality at 0.7
            const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
            resolve(dataUrl.split(',')[1]); // Return only base64 data
        } else {
            throw new Error("Could not get canvas context");
        }
    });
  };

  const handleAnalyzeVideo = async () => {
    if (!videoRef.current) return;

    setIsLoading(true);
    setError(null);
    setTranscripts([]);
    setProgress(0);
    setProgressText("Initializing analysis...");

    const video = videoRef.current;
    
    // Mute video to prevent audio from playing during seeking
    const originalMuted = video.muted;
    video.muted = true;

    try {
      // Wait for video metadata to be loaded to get duration
      if (isNaN(video.duration)) {
        await new Promise<void>(resolve => {
          video.onloadedmetadata = () => resolve();
        });
      }

      const duration = video.duration;
      const timestampsToAnalyze: number[] = [];
      for (let t = 0; t <= duration; t += ANALYSIS_INTERVAL) {
        timestampsToAnalyze.push(t);
      }

      for (let i = 0; i < timestampsToAnalyze.length; i++) {
        const time = timestampsToAnalyze[i];
        
        setProgressText(`Analyzing frame ${i + 1} of ${timestampsToAnalyze.length}...`);
        
        video.currentTime = time;
        // Wait until the video has seeked to the correct time
        await new Promise<void>(resolve => {
          const handler = () => {
            video.removeEventListener('seeked', handler);
            resolve();
          };
          video.addEventListener('seeked', handler);
        });

        const frameBase64 = await captureFrame(video);
        const description = await analyzeFrame(frameBase64);

        setTranscripts(prev => [...prev, { timestamp: time, description }]);
        setProgress(((i + 1) / timestampsToAnalyze.length) * 100);
      }
      setProgressText("Analysis complete!");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unknown error occurred during analysis.");
      setProgressText("Analysis failed.");
    } finally {
      setIsLoading(false);
      video.muted = originalMuted; // Restore original muted state
    }
  };

  const handleTimestampClick = useCallback((timestamp: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = timestamp;
      videoRef.current.play();
    }
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <main className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
            Video Scene Analyzer
          </h1>
          <p className="mt-2 text-lg text-slate-400">
            Let Gemini break down your videos into detailed, timestamped scenes.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col space-y-6">
            {!videoUrl ? (
              <FileUploader onFileChange={handleFileChange} isLoading={isLoading} />
            ) : (
              <>
                <VideoPlayer videoUrl={videoUrl} videoRef={videoRef} />
                <div className="space-y-4">
                   <button
                    onClick={handleAnalyzeVideo}
                    disabled={isLoading}
                    className="
                      w-full flex items-center justify-center gap-x-3 px-6 py-3 
                      font-semibold text-white rounded-lg transition-all duration-300
                      bg-sky-600 hover:bg-sky-500
                      disabled:bg-slate-600 disabled:cursor-not-allowed
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500
                    "
                  >
                    <WandIcon className="w-5 h-5" />
                    {isLoading ? 'Analyzing...' : 'Analyze Video'}
                  </button>
                  {isLoading && (
                    <div className="w-full bg-slate-700 rounded-full h-2.5">
                      <div className="bg-sky-500 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                      <p className="text-center text-sm text-slate-400 mt-2">{progressText}</p>
                    </div>
                  )}
                </div>
              </>
            )}
             {error && <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg" role="alert">{error}</div>}
          </div>

          {/* Right Column */}
          <div className="lg:max-h-[calc(100vh-8rem)]">
            <TranscriptDisplay 
              transcripts={transcripts}
              onTimestampClick={handleTimestampClick}
              isLoading={isLoading}
              progress={progress}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
