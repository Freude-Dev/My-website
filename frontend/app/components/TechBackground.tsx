"use client";

import React, { useEffect, useRef, useState } from "react";

interface TechLine {
  id: number;
  x: number;
  y: number;
  length: number;
  speed: number;
  opacity: number;
  direction: 'horizontal' | 'vertical';
  delay: number;
}

export default function TechBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const linesRef = useRef<TechLine[]>([]);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Initialize random tech lines
    const lineCount = Math.floor((dimensions.width * dimensions.height) / 200000); // Further reduced density
    const lines: TechLine[] = [];

    for (let i = 0; i < lineCount; i++) {
      const isHorizontal = Math.random() > 0.5;
      lines.push({
        id: i,
        x: isHorizontal ? Math.random() * dimensions.width : Math.random() * dimensions.width,
        y: isHorizontal ? Math.random() * dimensions.height : Math.random() * dimensions.height,
        length: Math.random() * 100 + 50, // 50-150px length
        speed: Math.random() * 0.5 + 0.1, // 0.1-0.6 speed
        opacity: Math.random() * 0.3 + 0.1, // 0.1-0.4 opacity
        direction: isHorizontal ? 'horizontal' : 'vertical',
        delay: Math.random() * 1000 // Random start delay
      });
    }

    linesRef.current = lines;

    const animate = (timestamp: number = 0) => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // Trail effect
      ctx.fillRect(0, 0, dimensions.width, dimensions.height);

      linesRef.current.forEach((line) => {
        // Skip lines that haven't started yet
        if (timestamp < line.delay) return;

        // Update position based on direction
        if (line.direction === 'horizontal') {
          line.x += line.speed;
          // Wrap around horizontally
          if (line.x > dimensions.width + line.length) line.x = -line.length;
        } else {
          line.y += line.speed;
          // Wrap around vertically
          if (line.y > dimensions.height + line.length) line.y = -line.length;
        }

        // Draw tech line
        ctx.strokeStyle = `rgba(249, 115, 22, ${line.opacity})`; // Orange color
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        let endX, endY;
        if (line.direction === 'horizontal') {
          endX = line.x + line.length;
          endY = line.y;
        } else {
          endX = line.x;
          endY = line.y + line.length;
        }
        
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        // Add glow effect
        ctx.strokeStyle = `rgba(249, 115, 22, ${line.opacity * 0.3})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(line.x, line.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      });

      // Add tech circuit pattern
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.12)';
      ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
      
      // Create circuit board pattern
      const gridSize = 80; // Further increased from 60 to reduce density more
      const nodeSize = 2; // Even smaller nodes
      
      // Draw circuit pathways and nodes with very reduced frequency
      for (let x = gridSize; x < dimensions.width - gridSize; x += gridSize) {
        for (let y = gridSize; y < dimensions.height - gridSize; y += gridSize) {
          // Only draw nodes very occasionally (15% chance instead of 30%)
          if (Math.random() < 0.15) {
            // Main circuit node
            ctx.beginPath();
            ctx.arc(x, y, nodeSize, 0, Math.PI * 2);
            ctx.fill();
            
            // Inner node bright spot
            ctx.fillStyle = 'rgba(249, 115, 22, 0.8)';
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = 'rgba(249, 115, 22, 0.2)';
            
            // Create pathways based on random pattern (very reduced frequency)
            const pathwayType = Math.random();
            
            if (pathwayType < 0.08) { // Further reduced from 0.15
              // L-shaped pathway (right then down)
              ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x + nodeSize, y);
              ctx.lineTo(x + gridSize - nodeSize, y);
              ctx.lineTo(x + gridSize - nodeSize, y + gridSize - nodeSize);
              ctx.stroke();
              
              // Corner node
              ctx.beginPath();
              ctx.arc(x + gridSize - nodeSize, y + gridSize - nodeSize, 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (pathwayType < 0.16) { // Further reduced from 0.3
              // L-shaped pathway (down then right)
              ctx.strokeStyle = 'rgba(249, 115, 22, 0.08)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x, y + nodeSize);
              ctx.lineTo(x, y + gridSize - nodeSize);
              ctx.lineTo(x + gridSize - nodeSize, y + gridSize - nodeSize);
              ctx.stroke();
              
              // Corner node
              ctx.beginPath();
              ctx.arc(x + gridSize - nodeSize, y + gridSize - nodeSize, 2, 0, Math.PI * 2);
              ctx.fill();
            } else if (pathwayType < 0.25) { // Further reduced from 0.45
              // Straight horizontal line
              ctx.strokeStyle = 'rgba(249, 115, 22, 0.06)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x + nodeSize, y);
              ctx.lineTo(x + gridSize - nodeSize, y);
              ctx.stroke();
            } else {
              // Straight vertical line
              ctx.strokeStyle = 'rgba(249, 115, 22, 0.06)';
              ctx.lineWidth = 2;
              ctx.beginPath();
              ctx.moveTo(x, y + nodeSize);
              ctx.lineTo(x, y + gridSize - nodeSize);
              ctx.stroke();
            }
          }
        }
      }
      
      // Add larger circuit traces - very reduced
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.03)';
      ctx.lineWidth = 1;
      
      // Major horizontal traces - reduced frequency
      for (let y = 0; y < dimensions.height; y += gridSize * 4) { // Increased from *3 to *4
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(dimensions.width, y);
        ctx.stroke();
      }
      
      // Major vertical traces - reduced frequency  
      for (let x = 0; x < dimensions.width; x += gridSize * 4) { // Increased from *3 to *4
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dimensions.height);
        ctx.stroke();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate(0);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ 
        background: 'black',
        filter: 'blur(1.5px)',
        opacity: 0.7
      }}
    />
  );
}
