"use client";

import React, { useEffect, useRef, useState } from 'react';

interface TrailPoint {
  x: number;
  y: number;
  id: number;
}

export default function CursorTrail() {
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const trailLength = 8;
  
  const pointIdRef = useRef(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Add new point to trail
      const newPoint: TrailPoint = {
        x: e.clientX,
        y: e.clientY,
        id: pointIdRef.current++
      };

      setTrail(prevTrail => {
        const updatedTrail = [...prevTrail, newPoint];
        // Keep only the last trailLength points
        return updatedTrail.slice(-trailLength);
      });
    };

    // Clean up old points periodically
    const cleanupInterval = setInterval(() => {
      setTrail(prevTrail => {
        if (prevTrail.length > trailLength) {
          return prevTrail.slice(-trailLength);
        }
        return prevTrail;
      });
    }, 50);

    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(cleanupInterval);
    };
  }, []);

  return (
    <>
      {/* Trail points */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="fixed pointer-events-none z-50"
          style={{
            left: point.x,
            top: point.y,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div
            className="rounded-full bg-orange-500"
            style={{
              width: `${Math.max(2, (index + 1) * 2)}px`,
              height: `${Math.max(2, (index + 1) * 2)}px`,
              opacity: (index + 1) / trailLength * 0.6,
              boxShadow: `0 0 ${4 + index * 2}px rgba(251, 146, 60, ${(index + 1) / trailLength * 0.8})`,
              transition: 'all 0.3s ease-out',
            }}
          />
        </div>
      ))}
      
      {/* Main cursor glow */}
      <div
        className="fixed pointer-events-none z-50"
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="rounded-full bg-orange-400"
          style={{
            width: '4px',
            height: '4px',
            boxShadow: '0 0 20px rgba(251, 146, 60, 0.8)',
          }}
        />
      </div>
    </>
  );
}
