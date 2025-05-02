"use client"; // Required for Next.js App Router (remove if using Pages Router)

import { useEffect, useRef } from 'react';

interface SplineViewerProps {
  url: string;
  background?: string;
}

export default function SplineViewer({ url, background = "rgba(218,81,221,0.2)" }: SplineViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  useEffect(() => {
    // Load the script
    const script = document.createElement('script');
    script.src = "https://unpkg.com/@splinetool/viewer/build/spline-viewer.js";
    script.type = "module";
    document.head.appendChild(script);
    
    // Create the viewer element once script is loaded
    const handleLoad = () => {
      if (containerRef.current) {
        const viewer = document.createElement('spline-viewer') as HTMLElement;
        viewer.setAttribute('url', url);
        viewer.setAttribute('background', background);
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(viewer);
      }
    };
    
    script.addEventListener('load', handleLoad);
    
    return () => {
      script.removeEventListener('load', handleLoad);
      // Only remove script if we added it
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [url, background]);
  
  return <div ref={containerRef} style={{ width: '100%', height: '500px' }} />;
}