/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore';
import { THEMES } from '../lib/themes';

export default function DynamicBackground() {
  const storeTheme = useStore(state => state.theme);
  const theme = storeTheme?.typography ? storeTheme : THEMES['Aurora Borealis'];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ripples, setRipples] = useState<{ x: number, y: number, id: number }[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: any[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const initParticles = () => {
      particles = [];
      let count = 30;
      if (theme.name === 'Aurora Borealis') count = 100;
      if (theme.name === 'Neon Noir') count = 150;
      if (theme.name === 'Quantum Field') count = 200;
      if (theme.name === 'Underwater Depth') count = 60;

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * (theme.name === 'Neon Noir' ? 0.2 : 0.5),
          speedY: theme.name === 'Neon Noir' ? Math.random() * 5 + 5 : (Math.random() - 0.5) * 0.5,
          color: getThemeColor(theme.name),
          opacity: Math.random() * 0.5 + 0.1,
          life: Math.random() * 100
        });
      }
    };

    const getThemeColor = (t: string) => {
      switch (t) {
        case 'Aurora Borealis': return '#10b981';
        case 'Neon Noir': return '#00ffff';
        case 'Koi Pond': return '#f97316';
        case 'Hologram Station': return '#00b4d8';
        case 'Synthwave Sunset': return '#f093fb';
        case 'Quantum Field': return '#ffffff';
        case 'Magma Chamber': return '#ef4444';
        default: return '#3b82f6';
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        ctx.beginPath();
        if (theme.name === 'Neon Noir') {
          // Rain drops
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 10);
          ctx.strokeStyle = p.color;
          ctx.lineWidth = 1;
          ctx.globalAlpha = p.opacity;
          ctx.stroke();
        } else if (theme.name === 'Quantum Field') {
          // Probability clouds
          const blur = Math.sin(Date.now() * 0.002 + p.life) * 5 + 5;
          ctx.shadowBlur = blur;
          ctx.shadowColor = p.color;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        } else {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.opacity;
          ctx.fill();
        }

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        
        if (theme.name === 'Aurora Borealis') {
          p.opacity = Math.sin(Date.now() * 0.001 + p.x * 0.01) * 0.3 + 0.4;
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    initParticles();
    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  const handleInteraction = (e: React.MouseEvent) => {
    if (theme.name === 'Neon Noir' || theme.name === 'Koi Pond') {
      const newRipple = { x: e.clientX, y: e.clientY, id: Date.now() };
      setRipples(prev => [...prev, newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 1000);
    }
  };

  return (
    <div 
      className="fixed inset-0 -z-10 overflow-hidden" 
      onClick={handleInteraction}
    >
      {/* Base Gradient Layer */}
      <AnimatePresence mode="wait">
        {theme.name === 'Aurora Borealis' && (
          <motion.div key="aurora" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050b1a] to-[#0a162e]" />
            <div className="absolute top-0 left-0 w-full h-full opacity-30">
              {[1, 2, 3].map(i => (
                <div key={i} className="absolute inset-0 aurora-layer" style={{ 
                  background: `linear-gradient(${90 + i * 20}deg, transparent, var(--accent-primary), transparent)`,
                  filter: 'blur(60px)',
                  animationDelay: `${i * -3}s`,
                  transform: `scaleY(${1 + i * 0.2})`
                }} />
              ))}
            </div>
            {/* Stars */}
            <div className="absolute inset-0">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="absolute star bg-white rounded-full" style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 60}%`,
                  width: `${Math.random() * 2 + 1}px`,
                  height: `${Math.random() * 2 + 1}px`,
                  '--twinkle-duration': `${Math.random() * 3 + 2}s`
                } as any} />
              ))}
            </div>
          </motion.div>
        )}

        {theme.name === 'Synthwave Sunset' && (
          <motion.div key="synthwave" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-[var(--bg-secondary)] opacity-20" 
              style={{ 
                backgroundImage: 'linear-gradient(var(--accent-primary) 1px, transparent 1px), linear-gradient(90deg, var(--accent-primary) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
                transform: 'perspective(500px) rotateX(60deg)',
                animation: 'grid-scroll 20s linear infinite'
              }} 
            />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-gradient-to-t from-orange-500 to-pink-500 shadow-[0_0_100px_rgba(249,115,22,0.5)] animate-pulse" />
          </motion.div>
        )}

        {theme.name === 'Hologram Station' && (
          <motion.div key="hologram" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="scanline-effect" />
            <div className="absolute inset-0 opacity-10" style={{ 
              backgroundImage: 'radial-gradient(circle at center, var(--accent-primary) 1px, transparent 1px)',
              backgroundSize: '30px 30px'
            }} />
          </motion.div>
        )}

        {theme.name === 'Magma Chamber' && (
          <motion.div key="magma" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-t from-[#450a0a] to-transparent" />
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-[#ef4444]/10 blur-3xl animate-pulse" />
          </motion.div>
        )}

        {theme.name === 'Koi Pond' && (
          <motion.div key="koi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-[#0c4a6e]" />
            <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: 'radial-gradient(circle at center, #0ea5e9 0%, transparent 70%)',
              animation: 'caustic 10s ease-in-out infinite'
            }} />
            {/* Lily Pads */}
            {Array.from({ length: 5 }).map((_, i) => (
              <motion.div 
                key={i} 
                animate={{ x: [0, 20, 0], y: [0, 10, 0] }}
                transition={{ duration: 10 + i * 2, repeat: Infinity }}
                className="absolute w-24 h-24 bg-green-800/40 rounded-full"
                style={{ left: `${20 + i * 15}%`, top: `${30 + (i % 3) * 20}%` }}
              >
                <div className="absolute top-0 left-1/2 w-1 h-12 bg-green-900/20 -translate-x-1/2" />
              </motion.div>
            ))}
          </motion.div>
        )}

        {theme.name === 'Lo-Fi Desk' && (
          <motion.div key="lofi" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-[#2d2a2e]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10" style={{
              backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 1px, rgba(255,255,255,0.05) 1px, rgba(255,255,255,0.05) 2px)',
              backgroundSize: '100% 2px'
            }} />
          </motion.div>
        )}

        {theme.name === 'Underwater Depth' && (
          <motion.div key="underwater" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c4a6e] to-[#082f49]" />
            <div className="absolute inset-0 opacity-30" style={{ 
              backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'caustic\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.01\' numOctaves=\'3\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23caustic)\'/%3E%3C/svg%3E")',
              mixBlendMode: 'overlay',
              animation: 'caustic 20s linear infinite'
            }} />
          </motion.div>
        )}

        {theme.name === 'Cloud Nine' && (
          <motion.div key="clouds" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0ea5e9] to-[#38bdf8]" />
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ x: ['-20%', '120%'] }}
                transition={{ duration: 30 + i * 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-96 h-32 bg-white/20 blur-3xl rounded-full"
                style={{ top: `${10 + i * 15}%` }}
              />
            ))}
          </motion.div>
        )}

        {theme.name === 'Retro Arcade' && (
          <motion.div key="arcade" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-black" />
            <div className="scanline-effect opacity-20" />
            <div className="absolute inset-0" style={{
              background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.8) 100%)'
            }} />
          </motion.div>
        )}

        {theme.name === 'Quantum Field' && (
          <motion.div key="quantum" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-black" />
            <div className="absolute inset-0 opacity-20" style={{ 
              backgroundImage: 'radial-gradient(circle at center, #ffffff 0%, transparent 70%)',
              animation: 'pulse-glow 5s ease-in-out infinite'
            }} />
          </motion.div>
        )}

        {theme.name === 'Forest Canopy' && (
          <motion.div key="forest" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-[#064e3b] to-[#065f46]" />
            {Array.from({ length: 15 }).map((_, i) => (
              <motion.div 
                key={i}
                animate={{ 
                  y: ['-10vh', '110vh'],
                  x: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                  rotate: [0, 360]
                }}
                transition={{ duration: 15 + Math.random() * 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-4 h-4 bg-green-400/20 rounded-full blur-sm"
              />
            ))}
          </motion.div>
        )}

        {theme.name === 'Ink in Water' && (
          <motion.div key="ink" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0">
            <div className="absolute inset-0 bg-white" />
            <div className="absolute inset-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, #000 0%, transparent 70%)',
              animation: 'caustic 15s ease-in-out infinite'
            }} />
          </motion.div>
        )}
      </AnimatePresence>

      <canvas ref={canvasRef} className="absolute inset-0 opacity-40 pointer-events-none" />

      {/* Interaction Ripples */}
      {ripples.map(r => (
        <div key={r.id} className="absolute pointer-events-none" style={{ left: r.x, top: r.y }}>
          <div className="w-4 h-4 -translate-x-1/2 -translate-y-1/2 border border-white/30 rounded-full animate-[ripple_1s_ease-out_forwards]" />
        </div>
      ))}
    </div>
  );
}
