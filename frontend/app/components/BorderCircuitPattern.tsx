"use client";

import React, { useEffect, useRef, useState } from "react";

export default function BorderCircuitPattern() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
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

    let time = 0;

    const animate = () => {
      time += 0.01;
      
      // Clear canvas
      ctx.clearRect(0, 0, dimensions.width, dimensions.height);

      // Circuit pattern settings
      const borderWidth = 60;
      const gridSize = 20;
      const nodeSize = 2;

      // Top border circuit
      drawBorderCircuit(ctx, 0, 0, dimensions.width, borderWidth, 'top', time, gridSize, nodeSize);
      
      // Bottom border circuit
      drawBorderCircuit(ctx, 0, dimensions.height - borderWidth, dimensions.width, borderWidth, 'bottom', time, gridSize, nodeSize);
      
      // Left border circuit
      drawBorderCircuit(ctx, 0, 0, borderWidth, dimensions.height, 'left', time, gridSize, nodeSize);
      
      // Right border circuit
      drawBorderCircuit(ctx, dimensions.width - borderWidth, 0, borderWidth, dimensions.height, 'right', time, gridSize, nodeSize);

      // Corner circuits (more complex)
      drawCornerCircuit(ctx, 0, 0, borderWidth, time); // Top-left
      drawCornerCircuit(ctx, dimensions.width - borderWidth, 0, borderWidth, time); // Top-right
      drawCornerCircuit(ctx, 0, dimensions.height - borderWidth, borderWidth, time); // Bottom-left
      drawCornerCircuit(ctx, dimensions.width - borderWidth, dimensions.height - borderWidth, borderWidth, time); // Bottom-right

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [dimensions]);

  const drawBorderCircuit = (
    ctx: CanvasRenderingContext2D, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    position: 'top' | 'bottom' | 'left' | 'right',
    time: number,
    gridSize: number,
    nodeSize: number
  ) => {
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.3)';
    ctx.fillStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.lineWidth = 1;

    const isHorizontal = position === 'top' || position === 'bottom';
    const startX = isHorizontal ? x : x + gridSize;
    const startY = isHorizontal ? y + gridSize : y;
    const endX = isHorizontal ? x + width : x + width - gridSize;
    const endY = isHorizontal ? y + height - gridSize : y + height;

    // Draw circuit nodes and connections
    for (let currentX = startX; currentX < endX; currentX += gridSize) {
      for (let currentY = startY; currentY < endY; currentY += gridSize) {
        // Animated pulse effect
        const pulse = Math.sin(time * 2 + currentX * 0.01 + currentY * 0.01) * 0.3 + 0.7;
        
        // Draw circuit node
        ctx.globalAlpha = pulse;
        ctx.beginPath();
        ctx.arc(currentX, currentY, nodeSize, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw connections
        if (isHorizontal && currentX + gridSize < endX) {
          // Horizontal connection
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.2 * pulse})`;
          ctx.beginPath();
          ctx.moveTo(currentX + nodeSize, currentY);
          ctx.lineTo(currentX + gridSize - nodeSize, currentY);
          ctx.stroke();
        } else if (!isHorizontal && currentY + gridSize < endY) {
          // Vertical connection
          ctx.strokeStyle = `rgba(249, 115, 22, ${0.2 * pulse})`;
          ctx.beginPath();
          ctx.moveTo(currentX, currentY + nodeSize);
          ctx.lineTo(currentX, currentY + gridSize - nodeSize);
          ctx.stroke();
        }
      }
    }

    ctx.globalAlpha = 1;
  };

  const drawCornerCircuit = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, time: number) => {
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.4)';
    ctx.fillStyle = 'rgba(249, 115, 22, 0.6)';
    ctx.lineWidth = 2;

    // Draw corner circuit pattern
    const pulse = Math.sin(time * 3) * 0.3 + 0.7;
    ctx.globalAlpha = pulse;

    // Corner nodes
    ctx.beginPath();
    ctx.arc(x + size/3, y + size/3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size*2/3, y + size/3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size/3, y + size*2/3, 3, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(x + size*2/3, y + size*2/3, 3, 0, Math.PI * 2);
    ctx.fill();

    // Corner connections
    ctx.strokeStyle = `rgba(249, 115, 22, ${0.3 * pulse})`;
    ctx.lineWidth = 1;
    
    // L-shaped connections
    ctx.beginPath();
    ctx.moveTo(x + size/3 + 3, y + size/3);
    ctx.lineTo(x + size*2/3 - 3, y + size/3);
    ctx.lineTo(x + size*2/3, y + size*2/3 - 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x + size/3, y + size/3 + 3);
    ctx.lineTo(x + size/3, y + size*2/3 - 3);
    ctx.lineTo(x + size*2/3 - 3, y + size*2/3);
    ctx.stroke();

    ctx.globalAlpha = 1;
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
}
