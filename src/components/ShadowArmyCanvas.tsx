"use client";

import React, { useEffect, useRef } from "react";

export const ShadowArmyCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: width / 2, y: height / 2, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    // Energetic rising mana embers and electric sparks
    const particles: { 
      x: number; 
      y: number; 
      vx: number; 
      vy: number; 
      size: number; 
      alpha: number; 
      color: string;
      glow: string;
    }[] = [];
    const count = 65;

    for (let i = 0; i < count; i++) {
      const isCyan = Math.random() > 0.6;
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 1.2,
        vy: -Math.random() * 2.2 - 0.8, // energetic upward flame
        size: Math.random() * 3.5 + 1.2,
        alpha: Math.random() * 0.8 + 0.3,
        color: isCyan ? "#00e5ff" : "#c084fc",
        glow: isCyan ? "rgba(0, 229, 255, 0.8)" : "rgba(192, 132, 252, 0.9)",
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Interactive mouse mana surge
      if (mouse.active) {
        const spot = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          320
        );
        spot.addColorStop(0, "rgba(168, 85, 247, 0.22)");
        spot.addColorStop(0.4, "rgba(0, 229, 255, 0.08)");
        spot.addColorStop(1, "transparent");
        ctx.fillStyle = spot;
        ctx.fillRect(0, 0, width, height);
      }

      // Rising mana flames with glow
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;
        p.y += p.vy;
        p.alpha -= 0.003;

        if (p.y < -10 || p.alpha <= 0) {
          p.x = Math.random() * width;
          p.y = height + 15;
          p.alpha = Math.random() * 0.8 + 0.3;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.shadowBlur = 16;
        ctx.shadowColor = p.glow;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-full w-full overflow-hidden select-none">
      {/* 
        Official Solo Leveling Shadow Army Animated Background Video 
        Set to high visibility (opacity-80) with color enhancement
      */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover object-center opacity-80 md:opacity-85 brightness-110 contrast-125 transition-opacity duration-700"
      >
        <source src="/shadow-army.mp4" type="video/mp4" />
      </video>

      {/* 
        Balanced dark vignette & gradient:
        Keeps the shadow army vividly visible while text cards remain readable
      */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#05010f]/95 via-transparent to-[#05010f]/40" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#05010f]/75 via-transparent to-[#05010f]/75" />

      {/* Interactive canvas for glowing mana embers & mouse interaction */}
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" aria-hidden="true" />
    </div>
  );
};
