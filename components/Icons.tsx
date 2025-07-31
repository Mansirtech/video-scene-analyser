
import React from 'react';

export const UploadIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className={className || "w-6 h-6"}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5"
    />
  </svg>
);

export const PlayIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || "w-6 h-6"}
  >
    <path
      fillRule="evenodd"
      d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.216-2.779-1.643V5.653Z"
      clipRule="evenodd"
    />
  </svg>
);

export const WandIcon = ({ className }: { className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        className={className || "w-6 h-6"}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c.149-.02.3-.034.45-.034h3.6c.15 0 .299.015.448.034m-4.5 0c.15-.02.3-.034.45-.034h3.6c.15 0 .299.015.448.034m0 0c.616.097 1.195.275 1.734.522m-8.916 0c.539-.247 1.118-.425 1.734-.522m0 0a3.003 3.003 0 0 0 5.432 0M9.75 3.104a3.003 3.003 0 0 0-5.432 0M12 18.75a6 6 0 0 0-6-6H4.5a6 6 0 0 0-6 6v.25m18 0a6 6 0 0 0-6-6h-1.5a6 6 0 0 0-6 6v.25m18 0a.75.75 0 0 0-.75-.75h-16.5a.75.75 0 0 0-.75.75m18 0v.25a6 6 0 0 1-6 6h-6a6 6 0 0 1-6-6v-.25" />
    </svg>
);
