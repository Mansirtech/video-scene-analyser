
import React from 'react';

interface VideoPlayerProps {
  videoUrl: string;
  videoRef: React.RefObject<HTMLVideoElement>;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, videoRef }) => {
  return (
    <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow-lg border border-slate-700">
      <video
        ref={videoRef}
        src={videoUrl}
        controls
        className="w-full h-full"
        onLoadedMetadata={(e) => e.currentTarget.volume = 0.5}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default VideoPlayer;
