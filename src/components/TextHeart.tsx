import React, { useEffect, useRef } from 'react';
import theme from '../theme';

interface Point {
  x: number;
  y: number;
  alpha: number;
  targetAlpha: number;
  delay: number;
}

export default function TextHeart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let points: Point[] = [];
    const text = "I love you";

    // 1. TÄSTÄ SÄÄDETÄÄN STRUKTUURIA JA TIHEYTTÄ (Kokeile esim. 1.0, 1.5, 2.0)
    const fontMultiplier = 0.8; 

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initPoints();
    };

    const initPoints = () => {
      points = [];
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const scaleDivider = isMobile ? 36 : 45;
      const scale = Math.min(canvas.width, canvas.height) / scaleDivider;

      // Heart equation
      for (let t = 0; t < Math.PI * 2; t += 0.05) {
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        points.push({
          x: centerX + x * scale,
          y: centerY + y * scale,
          alpha: 0,
          targetAlpha: 0.8 + Math.random() * 0.2,
          delay: Math.random() * 2000
        });
      }

      // Inner layers
      for (let s = 0.2; s < 1; s += 0.2) {
          for (let t = 0; t < Math.PI * 2; t += 0.1) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
            
            points.push({
              x: centerX + x * scale * s,
              y: centerY + y * scale * s,
              alpha: 0,
              targetAlpha: 0.4 + Math.random() * 0.4,
              delay: Math.random() * 3000
            });
          }
      }
    };

    let start: number | null = null;
    const draw = (time: number) => {
      if (!start) start = time;
      const elapsed = time - start;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // 2. LASKETAAN KOKO LENNOSSA JOKAISELLA RUUDUNPÄIVITYKSELLÄ
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      const scaleDivider = isMobile ? 36 : 45;
      const scale = Math.min(canvas.width, canvas.height) / scaleDivider;
      const calculatedFontSize = scale * fontMultiplier;

      ctx.font = `${calculatedFontSize}px "Fira Code", monospace`;
      
      points.forEach(p => {
        if (elapsed > p.delay) {
            p.alpha += (p.targetAlpha - p.alpha) * 0.02;
        }

        const hex = theme.pinkDeep.replace('#', '');
        const r = parseInt(hex.substring(0,2), 16);
        const g = parseInt(hex.substring(2,4), 16);
        const b = parseInt(hex.substring(4,6), 16);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.alpha})`;
        ctx.fillText(text, p.x - ctx.measureText(text).width / 2, p.y);
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    resize();
    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 w-full h-full pointer-events-none"
    />
  );
}