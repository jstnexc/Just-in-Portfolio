"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, X, RotateCcw, Zap, Trophy, Flame } from "lucide-react";

interface FlappyFrostGameProps {
  onClose: () => void;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  type: "snow" | "bubble" | "aura" | "frost";
}

interface FloatingText {
  x: number;
  y: number;
  text: string;
  alpha: number;
  vy: number;
  color: string;
  size: number;
}

interface Pipe {
  x: number;
  topHeight: number;
  bottomHeight: number;
  passed: boolean;
  gap: number;
}

export const FlappyFrostGame: React.FC<FlappyFrostGameProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Game state
  const [gameState, setGameState] = useState<"START" | "PLAYING" | "GAMEOVER">("START");
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(1);
  const [freezeEnergy, setFreezeEnergy] = useState<number>(100);
  const [isDeepFreeze, setIsDeepFreeze] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Audio Context ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Mutable game loop refs for 60fps performance without re-render lag
  const gameRef = useRef({
    state: "START" as "START" | "PLAYING" | "GAMEOVER",
    score: 0,
    highScore: 0,
    combo: 1,
    freezeEnergy: 100,
    isDeepFreeze: false,
    deepFreezeTimer: 0,
    isMuted: false,

    // Seahorse Physics
    x: 90,
    y: 260,
    vy: 0,
    gravity: 0.38,
    jumpPower: -7.2,
    radius: 17,
    rotation: 0,
    finFlutter: 0,

    // World & Pipes
    pipes: [] as Pipe[],
    pipeTimer: 0,
    pipeInterval: 120, // frames
    speed: 2.5,
    canvasW: 400,
    canvasH: 560,

    // Particles & FX
    particles: [] as Particle[],
    ambientSnow: [] as Particle[],
    floatingTexts: [] as FloatingText[],
    freezeVignette: 0,
    shake: 0,
  });

  // Sound generator using Web Audio API (Zero external assets needed)
  const playSound = useCallback((type: "jump" | "score" | "freeze" | "hit" | "combo") => {
    if (gameRef.current.isMuted) return;

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const now = ctx.currentTime;

      if (type === "jump") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.12);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
      } else if (type === "score") {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        osc1.type = "triangle";
        osc2.type = "sine";
        const baseFreq = 780 + Math.min(gameRef.current.combo * 80, 600);
        osc1.frequency.setValueAtTime(baseFreq, now);
        osc2.frequency.setValueAtTime(baseFreq * 1.5, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(ctx.destination);
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 0.3);
        osc2.stop(now + 0.3);
      } else if (type === "freeze") {
        // Deep Freeze frosty whoosh
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(140, now + 0.45);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.52);
      } else if (type === "hit") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } else if (type === "combo") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.2);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
      }
    } catch {
      // AudioContext muted or blocked by browser policy
    }
  }, []);

  // Initialize high score from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("flappy_frost_highscore");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          setHighScore(parsed);
          gameRef.current.highScore = parsed;
        }
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  // Sync mute state
  useEffect(() => {
    gameRef.current.isMuted = isMuted;
  }, [isMuted]);

  // Action: Flap / Swim
  const handleFlap = useCallback(() => {
    const g = gameRef.current;
    if (g.state === "START") {
      g.state = "PLAYING";
      setGameState("PLAYING");
      g.vy = g.jumpPower;
      playSound("jump");
      return;
    }

    if (g.state === "PLAYING") {
      g.vy = g.jumpPower;
      playSound("jump");

      // Spawn swim burst bubble particles
      for (let i = 0; i < 5; i++) {
        g.particles.push({
          x: g.x - 12 + Math.random() * 6,
          y: g.y + 4 + Math.random() * 8,
          vx: -1.5 - Math.random() * 2,
          vy: (Math.random() - 0.5) * 2,
          size: Math.random() * 3 + 1.5,
          alpha: 0.8,
          color: Math.random() > 0.5 ? "#67e8f9" : "#ffffff",
          type: "bubble",
        });
      }
    } else if (g.state === "GAMEOVER") {
      // Restart game
      resetGame();
    }
  }, [playSound]);

  // Action: Trigger Deep Freeze
  const handleDeepFreeze = useCallback(() => {
    const g = gameRef.current;
    if (g.state !== "PLAYING") return;
    if (g.freezeEnergy < 40 && !g.isDeepFreeze) return;

    if (!g.isDeepFreeze) {
      g.isDeepFreeze = true;
      setIsDeepFreeze(true);
      g.deepFreezeTimer = 240; // ~4 seconds at 60fps
      g.freezeEnergy = Math.max(0, g.freezeEnergy - 40);
      setFreezeEnergy(g.freezeEnergy);
      playSound("freeze");

      // Floating text effect
      g.floatingTexts.push({
        x: g.x + 30,
        y: g.y - 20,
        text: "❄️ DEEP FREEZE!",
        alpha: 1,
        vy: -1.2,
        color: "#67e8f9",
        size: 16,
      });

      // Freeze screen burst particles
      for (let i = 0; i < 20; i++) {
        g.particles.push({
          x: Math.random() * g.canvasW,
          y: Math.random() * g.canvasH,
          vx: (Math.random() - 0.5) * 3,
          vy: (Math.random() - 0.5) * 3,
          size: Math.random() * 4 + 2,
          alpha: 0.9,
          color: "#e0f2fe",
          type: "frost",
        });
      }
    }
  }, [playSound]);

  // Reset Game
  const resetGame = () => {
    const g = gameRef.current;
    g.state = "PLAYING";
    g.score = 0;
    g.combo = 1;
    g.freezeEnergy = 100;
    g.isDeepFreeze = false;
    g.deepFreezeTimer = 0;
    g.x = 90;
    g.y = 260;
    g.vy = 0;
    g.pipes = [];
    g.pipeTimer = 0;
    g.particles = [];
    g.floatingTexts = [];
    g.freezeVignette = 0;
    g.shake = 0;

    setGameState("PLAYING");
    setScore(0);
    setCombo(1);
    setFreezeEnergy(100);
    setIsDeepFreeze(false);
  };

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "ArrowUp") {
        e.preventDefault();
        handleFlap();
      } else if (e.code === "ShiftLeft" || e.code === "ShiftRight" || e.key.toLowerCase() === "f") {
        e.preventDefault();
        handleDeepFreeze();
      } else if (e.code === "KeyR" && gameRef.current.state === "GAMEOVER") {
        e.preventDefault();
        resetGame();
      } else if (e.code === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleFlap, handleDeepFreeze, onClose]);

  // Main Canvas Game Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const g = gameRef.current;
    g.canvasW = canvas.width = 400;
    g.canvasH = canvas.height = 560;

    // Seed ambient underwater snowflakes
    if (g.ambientSnow.length === 0) {
      for (let i = 0; i < 35; i++) {
        g.ambientSnow.push({
          x: Math.random() * g.canvasW,
          y: Math.random() * g.canvasH,
          vx: -0.3 - Math.random() * 0.5,
          vy: 0.4 + Math.random() * 0.6,
          size: Math.random() * 2.5 + 1,
          alpha: Math.random() * 0.6 + 0.2,
          color: "#93c5fd",
          type: "snow",
        });
      }
    }

    let animationFrameId: number;

    const loop = () => {
      // 1. UPDATE GAME STATE
      const speedModifier = g.isDeepFreeze ? 0.35 : 1.0;
      const currentSpeed = g.speed * speedModifier;
      const currentGravity = (g.isDeepFreeze ? g.gravity * 0.5 : g.gravity);

      // Deep Freeze Timer
      if (g.isDeepFreeze) {
        g.deepFreezeTimer--;
        if (g.deepFreezeTimer <= 0) {
          g.isDeepFreeze = false;
          setIsDeepFreeze(false);
        }
        g.freezeVignette = Math.min(1, g.freezeVignette + 0.08);
      } else {
        g.freezeVignette = Math.max(0, g.freezeVignette - 0.04);
        // Slowly recharge freeze energy over time
        if (g.freezeEnergy < 100 && g.state === "PLAYING") {
          g.freezeEnergy = Math.min(100, g.freezeEnergy + 0.05);
          if (Math.floor(g.freezeEnergy) % 20 === 0) {
            setFreezeEnergy(Math.floor(g.freezeEnergy));
          }
        }
      }

      // Update ambient snow
      g.ambientSnow.forEach((p) => {
        p.x += p.vx * speedModifier;
        p.y += p.vy * speedModifier;
        if (p.y > g.canvasH) {
          p.y = -5;
          p.x = Math.random() * g.canvasW;
        }
        if (p.x < 0) {
          p.x = g.canvasW + 5;
        }
      });

      // Playing physics
      if (g.state === "PLAYING") {
        g.vy += currentGravity;
        g.y += g.vy;
        g.rotation = Math.min(Math.PI / 4, Math.max(-Math.PI / 5, g.vy * 0.07));
        g.finFlutter += 0.25;

        // Spawn Seahorse Tail Frost Trail
        if (Math.random() < 0.6) {
          g.particles.push({
            x: g.x - 14,
            y: g.y + 4,
            vx: -1.2 * speedModifier,
            vy: (Math.random() - 0.5) * 0.8,
            size: Math.random() * 2.5 + 1,
            alpha: 0.7,
            color: g.isDeepFreeze ? "#e0f2fe" : "#38bdf8",
            type: "frost",
          });
        }

        // Pipe spawning
        g.pipeTimer++;
        if (g.pipeTimer >= g.pipeInterval / speedModifier) {
          g.pipeTimer = 0;
          const gap = g.isDeepFreeze ? 150 : 135;
          const minPipe = 70;
          const maxPipe = g.canvasH - gap - minPipe - 60;
          const topHeight = Math.floor(Math.random() * (maxPipe - minPipe)) + minPipe;
          const bottomHeight = g.canvasH - topHeight - gap;

          g.pipes.push({
            x: g.canvasW + 30,
            topHeight,
            bottomHeight,
            passed: false,
            gap,
          });
        }

        // Move and collide pipes
        for (let i = g.pipes.length - 1; i >= 0; i--) {
          const pipe = g.pipes[i];
          pipe.x -= currentSpeed;

          const pipeW = 58;

          // Check pass for score & combo
          if (!pipe.passed && pipe.x + pipeW < g.x) {
            pipe.passed = true;
            g.score += 1;
            setScore(g.score);

            // Combo accumulation
            g.combo = Math.min(5, g.combo + 1);
            setCombo(g.combo);

            // Give +15% Freeze Energy on each pipe pass
            g.freezeEnergy = Math.min(100, g.freezeEnergy + 15);
            setFreezeEnergy(Math.floor(g.freezeEnergy));

            if (g.score > g.highScore) {
              g.highScore = g.score;
              setHighScore(g.highScore);
              try {
                localStorage.setItem("flappy_frost_highscore", g.highScore.toString());
              } catch {
                // ignore
              }
            }

            playSound("score");

            // Floating combo text
            g.floatingTexts.push({
              x: g.x + 10,
              y: g.y - 25,
              text: g.combo > 1 ? `+1 (x${g.combo} COMBO!)` : "+1",
              alpha: 1,
              vy: -1.4,
              color: g.combo >= 3 ? "#facc15" : "#67e8f9",
              size: g.combo >= 3 ? 16 : 14,
            });
          }

          // Collision Check
          const seahorseLeft = g.x - g.radius + 4;
          const seahorseRight = g.x + g.radius - 4;
          const seahorseTop = g.y - g.radius + 3;
          const seahorseBottom = g.y + g.radius - 3;

          const inPipeX = seahorseRight > pipe.x && seahorseLeft < pipe.x + pipeW;
          const hitTopPipe = seahorseTop < pipe.topHeight;
          const hitBottomPipe = seahorseBottom > g.canvasH - pipe.bottomHeight;

          if (inPipeX && (hitTopPipe || hitBottomPipe)) {
            triggerGameOver();
          }

          // Remove off-screen pipes
          if (pipe.x < -70) {
            g.pipes.splice(i, 1);
          }
        }

        // Floor and ceiling collisions
        if (g.y + g.radius > g.canvasH - 35) {
          g.y = g.canvasH - 35 - g.radius;
          triggerGameOver();
        }
        if (g.y - g.radius < 5) {
          g.y = 5 + g.radius;
          g.vy = 0;
        }
      } else if (g.state === "START") {
        // Idle gentle floating bob
        g.y = 260 + Math.sin(Date.now() * 0.004) * 12;
        g.rotation = Math.sin(Date.now() * 0.004) * 0.1;
        g.finFlutter += 0.15;
      }

      function triggerGameOver() {
        g.state = "GAMEOVER";
        g.shake = 14;
        setGameState("GAMEOVER");
        playSound("hit");

        // Spawn defeat ice-shatter particles
        for (let i = 0; i < 25; i++) {
          g.particles.push({
            x: g.x,
            y: g.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 4 + 2,
            alpha: 1,
            color: Math.random() > 0.5 ? "#38bdf8" : "#ffffff",
            type: "frost",
          });
        }
      }

      // Update particles
      for (let i = g.particles.length - 1; i >= 0; i--) {
        const p = g.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.025;
        if (p.alpha <= 0) {
          g.particles.splice(i, 1);
        }
      }

      // Update floating texts
      for (let i = g.floatingTexts.length - 1; i >= 0; i--) {
        const ft = g.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;
        if (ft.alpha <= 0) {
          g.floatingTexts.splice(i, 1);
        }
      }

      // 2. RENDER CANVAS
      ctx.save();

      // Screen Shake
      if (g.shake > 0) {
        ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
        g.shake *= 0.88;
        if (g.shake < 0.5) g.shake = 0;
      }

      // Deep Abyssal Ice Background
      const bgGrad = ctx.createLinearGradient(0, 0, 0, g.canvasH);
      bgGrad.addColorStop(0, "#030816");
      bgGrad.addColorStop(0.5, "#06132e");
      bgGrad.addColorStop(1, "#08214d");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, g.canvasW, g.canvasH);

      // Distant underwater light shafts
      ctx.save();
      ctx.fillStyle = "rgba(56, 189, 248, 0.04)";
      ctx.beginPath();
      ctx.moveTo(80, 0);
      ctx.lineTo(160, 0);
      ctx.lineTo(240, g.canvasH);
      ctx.lineTo(120, g.canvasH);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(250, 0);
      ctx.lineTo(340, 0);
      ctx.lineTo(390, g.canvasH);
      ctx.lineTo(290, g.canvasH);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Render ambient snow
      g.ambientSnow.forEach((p) => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Render Pipes (Icy Stalactites & Stalagmites)
      g.pipes.forEach((pipe) => {
        const pipeW = 58;

        // Top Stalactite
        renderIcePillar(ctx, pipe.x, 0, pipeW, pipe.topHeight, true, g.isDeepFreeze);

        // Bottom Stalagmite
        renderIcePillar(ctx, pipe.x, g.canvasH - pipe.bottomHeight, pipeW, pipe.bottomHeight, false, g.isDeepFreeze);
      });

      // Frozen Seabed Ground
      const floorGrad = ctx.createLinearGradient(0, g.canvasH - 35, 0, g.canvasH);
      floorGrad.addColorStop(0, "#0e3b6e");
      floorGrad.addColorStop(0.3, "#072044");
      floorGrad.addColorStop(1, "#020914");
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, g.canvasH - 35, g.canvasW, 35);

      // Floor ice crystal border
      ctx.strokeStyle = "rgba(103, 232, 249, 0.6)";
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(0, g.canvasH - 35);
      for (let x = 0; x <= g.canvasW; x += 20) {
        ctx.lineTo(x, g.canvasH - 35 - (x % 40 === 0 ? 5 : 0));
      }
      ctx.stroke();

      // Render Particles
      g.particles.forEach((p) => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Render Seahorse Player
      renderFrostSeahorse(ctx, g.x, g.y, g.rotation, g.finFlutter, g.isDeepFreeze);

      // Render Floating Text
      g.floatingTexts.forEach((ft) => {
        ctx.save();
        ctx.globalAlpha = ft.alpha;
        ctx.fillStyle = ft.color;
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 10;
        ctx.font = `bold ${ft.size}px monospace`;
        ctx.textAlign = "center";
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();
      });

      // Deep Freeze Frost Vignette
      if (g.freezeVignette > 0) {
        ctx.save();
        ctx.globalAlpha = g.freezeVignette * 0.75;
        const vigGrad = ctx.createRadialGradient(
          g.canvasW / 2, g.canvasH / 2, g.canvasW * 0.35,
          g.canvasW / 2, g.canvasH / 2, g.canvasW * 0.75
        );
        vigGrad.addColorStop(0, "rgba(56, 189, 248, 0)");
        vigGrad.addColorStop(0.7, "rgba(56, 189, 248, 0.25)");
        vigGrad.addColorStop(1, "rgba(224, 242, 254, 0.7)");
        ctx.fillStyle = vigGrad;
        ctx.fillRect(0, 0, g.canvasW, g.canvasH);

        // Vignette Frost Border Text
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 13px monospace";
        ctx.textAlign = "center";
        ctx.shadowColor = "#38bdf8";
        ctx.shadowBlur = 8;
        ctx.fillText("❄️ DEEP FREEZE ACTIVE ❄️", g.canvasW / 2, 70);
        ctx.restore();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(loop);
    };

    animationFrameId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Helper: Draw Frost Crystal Column
  function renderIcePillar(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    isTop: boolean,
    isFrozen: boolean
  ) {
    ctx.save();

    // Main Pillar Gradient
    const pillarGrad = ctx.createLinearGradient(x, y, x + width, y);
    if (isFrozen) {
      pillarGrad.addColorStop(0, "rgba(186, 230, 253, 0.95)");
      pillarGrad.addColorStop(0.5, "rgba(240, 249, 255, 0.9)");
      pillarGrad.addColorStop(1, "rgba(125, 211, 252, 0.95)");
    } else {
      pillarGrad.addColorStop(0, "rgba(8, 47, 73, 0.88)");
      pillarGrad.addColorStop(0.3, "rgba(14, 116, 144, 0.75)");
      pillarGrad.addColorStop(0.7, "rgba(6, 182, 212, 0.65)");
      pillarGrad.addColorStop(1, "rgba(3, 105, 161, 0.88)");
    }

    ctx.fillStyle = pillarGrad;
    ctx.strokeStyle = isFrozen ? "#ffffff" : "#67e8f9";
    ctx.lineWidth = 2;
    ctx.shadowColor = isFrozen ? "#e0f2fe" : "#38bdf8";
    ctx.shadowBlur = isFrozen ? 14 : 6;

    // Body of the pillar
    ctx.fillRect(x, y, width, height);
    ctx.strokeRect(x, y, width, height);

    // Stalactite/Stalagmite Tip (Jagged ice spikes)
    const tipHeight = 22;
    ctx.beginPath();
    if (isTop) {
      // Points pointing downwards
      ctx.moveTo(x, y + height);
      ctx.lineTo(x + width * 0.25, y + height + tipHeight * 0.6);
      ctx.lineTo(x + width * 0.5, y + height + tipHeight);
      ctx.lineTo(x + width * 0.75, y + height + tipHeight * 0.7);
      ctx.lineTo(x + width, y + height);
    } else {
      // Points pointing upwards
      ctx.moveTo(x, y);
      ctx.lineTo(x + width * 0.25, y - tipHeight * 0.6);
      ctx.lineTo(x + width * 0.5, y - tipHeight);
      ctx.lineTo(x + width * 0.75, y - tipHeight * 0.7);
      ctx.lineTo(x + width, y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal ice refraction streak
    ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
    ctx.fillRect(x + 10, y, 6, height);

    ctx.restore();
  }

  // Helper: Draw Frost Seahorse
  function renderFrostSeahorse(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    rotation: number,
    finFlutter: number,
    isDeepFreezeActive: boolean
  ) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);

    // Deep Freeze Aura Ring
    if (isDeepFreezeActive) {
      ctx.save();
      ctx.strokeStyle = "rgba(103, 232, 249, 0.8)";
      ctx.lineWidth = 3;
      ctx.shadowColor = "#38bdf8";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, 0, 24 + Math.sin(Date.now() * 0.01) * 3, 0, Math.PI * 2);
      ctx.stroke();

      // Secondary ice crystal shield
      ctx.strokeStyle = "rgba(255, 255, 255, 0.9)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, 0, 20, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Glow effect
    ctx.shadowColor = isDeepFreezeActive ? "#ffffff" : "#38bdf8";
    ctx.shadowBlur = isDeepFreezeActive ? 16 : 10;

    // Fluttering Dorsal Fin
    ctx.save();
    const finOffset = Math.sin(finFlutter) * 4;
    ctx.fillStyle = "rgba(125, 211, 252, 0.75)";
    ctx.beginPath();
    ctx.moveTo(-10, -2);
    ctx.quadraticCurveTo(-18 + finOffset, 4, -10, 10);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Main Body (Curved Seahorse Torso)
    const bodyGrad = ctx.createLinearGradient(-10, -15, 12, 15);
    bodyGrad.addColorStop(0, isDeepFreezeActive ? "#ffffff" : "#bae6fd");
    bodyGrad.addColorStop(0.5, isDeepFreezeActive ? "#e0f2fe" : "#38bdf8");
    bodyGrad.addColorStop(1, isDeepFreezeActive ? "#7dd3fc" : "#0284c7");

    ctx.fillStyle = bodyGrad;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 1.8;

    // Body contour
    ctx.beginPath();
    // Head crest
    ctx.moveTo(2, -16);
    ctx.lineTo(-4, -12);
    ctx.lineTo(-6, -6);
    // Back & Belly
    ctx.quadraticCurveTo(-12, 4, -6, 12);
    // Curled Tail
    ctx.quadraticCurveTo(-2, 18, 4, 16);
    ctx.quadraticCurveTo(8, 14, 5, 10);
    ctx.quadraticCurveTo(0, 12, -2, 6);
    // Chest / Belly
    ctx.quadraticCurveTo(4, 2, 6, -6);
    // Snout
    ctx.lineTo(14, -8);
    ctx.lineTo(14, -12);
    ctx.lineTo(4, -12);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Icy Crown / Horn
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.moveTo(0, -15);
    ctx.lineTo(4, -22);
    ctx.lineTo(7, -15);
    ctx.closePath();
    ctx.fill();

    // Eye (Glowing sapphire)
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(3, -9, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(4, -10, 1.2, 0, Math.PI * 2);
    ctx.fill();

    // Belly Segments / Ice Scales
    ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(-1, -3);
    ctx.lineTo(4, -3);
    ctx.moveTo(-3, 1);
    ctx.lineTo(3, 1);
    ctx.moveTo(-4, 5);
    ctx.lineTo(1, 5);
    ctx.stroke();

    ctx.restore();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Arcade Cabinet Container */}
      <div className="relative flex flex-col w-full max-w-[460px] rounded-3xl border border-cyan-500/30 bg-[#070b19]/95 shadow-[0_0_50px_rgba(34,211,238,0.25)] overflow-hidden">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-blue-950/20 to-slate-950/40">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">❄️</span>
            <div>
              <h3 className="font-display text-sm sm:text-base font-bold text-white tracking-wide">
                Flappy Frost Seahorse
              </h3>
              <p className="text-[11px] font-mono text-cyan-300/70">
                Proj3ctAdam Remake · HTML5 Canvas
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full border border-cyan-400/20 text-cyan-200/80 hover:text-white hover:border-cyan-400/50 hover:bg-cyan-500/10 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/30 hover:bg-white/10 transition-colors"
              title="Close (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live HUD Bar */}
        <div className="flex items-center justify-between px-5 py-2.5 bg-black/40 border-b border-white/[0.06] text-xs font-mono">
          <div className="flex items-center gap-3">
            <div className="text-white">
              SCORE: <span className="text-cyan-300 font-bold text-sm">{score}</span>
            </div>
            {combo > 1 && (
              <div className="flex items-center gap-1 text-amber-300 font-semibold animate-pulse">
                <Flame className="w-3.5 h-3.5" />
                <span>x{combo}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-white/70">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            <span>BEST:</span>
            <span className="text-amber-300 font-semibold">{highScore}</span>
          </div>
        </div>

        {/* Deep Freeze Energy Meter */}
        <div className="px-5 py-2 bg-[#050e20] border-b border-cyan-500/10">
          <div className="flex items-center justify-between text-[11px] font-mono mb-1">
            <span className="flex items-center gap-1 text-cyan-200/80">
              <Zap className="w-3 h-3 text-cyan-400" />
              DEEP FREEZE METER
            </span>
            <span className={freezeEnergy >= 40 ? "text-cyan-300 font-bold" : "text-white/40"}>
              {Math.floor(freezeEnergy)}% {freezeEnergy >= 40 ? "[READY]" : "[CHARGING]"}
            </span>
          </div>
          <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-cyan-500/20">
            <div
              className={`h-full transition-all duration-200 ${
                isDeepFreeze
                  ? "bg-gradient-to-r from-white via-cyan-200 to-sky-300 animate-pulse shadow-[0_0_12px_#38bdf8]"
                  : freezeEnergy >= 40
                  ? "bg-gradient-to-r from-cyan-500 to-blue-400 shadow-[0_0_8px_rgba(56,189,248,0.5)]"
                  : "bg-cyan-800/60"
              }`}
              style={{ width: `${freezeEnergy}%` }}
            />
          </div>
        </div>

        {/* Game Canvas Container */}
        <div className="relative flex justify-center bg-black select-none">
          <canvas
            ref={canvasRef}
            onClick={handleFlap}
            className="w-full h-auto cursor-pointer max-h-[500px] object-contain touch-none"
          />

          {/* Start Screen Overlay */}
          {gameState === "START" && (
            <div
              onClick={handleFlap}
              className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 backdrop-blur-[2px] p-6 text-center cursor-pointer select-none"
            >
              <div className="p-3 mb-3 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_25px_rgba(56,189,248,0.4)] animate-bounce">
                <span className="text-3xl">❄️</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight drop-shadow-[0_0_15px_rgba(56,189,248,0.6)]">
                FLAPPY FROST
              </h2>
              <p className="text-xs font-mono text-cyan-300 mt-1">SEAHORSE EDITION</p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/50 bg-cyan-500/20 px-6 py-2.5 text-sm font-semibold text-white shadow-[0_0_20px_rgba(56,189,248,0.3)] hover:scale-105 transition-transform">
                Click or Press [SPACE] to Swim
              </div>

              <div className="mt-5 max-w-xs text-[11px] font-mono text-white/60 leading-relaxed">
                Clear icy stalactites · Chain combos · Press <span className="text-cyan-300 font-bold">[SHIFT]</span> to activate Deep Freeze slow-mo!
              </div>
            </div>
          )}

          {/* Game Over Overlay */}
          {gameState === "GAMEOVER" && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[3px] p-6 text-center select-none">
              <div className="text-3xl mb-2">💥</div>
              <h3 className="text-2xl font-extrabold font-display text-white tracking-tight drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]">
                FROZEN SOLID!
              </h3>
              <p className="text-xs font-mono text-red-300/80 mt-0.5">GAME OVER</p>

              <div className="mt-5 w-full max-w-[260px] rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-left font-mono text-xs space-y-2">
                <div className="flex justify-between text-white/70">
                  <span>FINAL SCORE:</span>
                  <span className="text-cyan-300 font-bold text-sm">{score}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>BEST SCORE:</span>
                  <span className="text-amber-300 font-bold text-sm">{highScore}</span>
                </div>
                <div className="flex justify-between text-white/70">
                  <span>MAX COMBO:</span>
                  <span className="text-violet-300 font-bold">{combo}x</span>
                </div>
              </div>

              <button
                onClick={resetGame}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/60 bg-cyan-500/25 px-6 py-2.5 text-sm font-bold text-white shadow-[0_0_24px_rgba(56,189,248,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again (or Press Space)
              </button>
            </div>
          )}
        </div>

        {/* Footer / Controls Bar */}
        <div className="flex items-center justify-between p-4 bg-[#050a18] border-t border-cyan-500/15">
          <div className="text-[11px] font-mono text-white/50 hidden sm:block">
            <span className="text-cyan-300 font-semibold">[SPACE / CLICK]</span> Swim &nbsp;·&nbsp;{" "}
            <span className="text-cyan-300 font-semibold">[SHIFT / F]</span> Deep Freeze
          </div>

          {/* Mobile / Direct Deep Freeze Trigger Button */}
          <button
            onClick={handleDeepFreeze}
            disabled={freezeEnergy < 40 && !isDeepFreeze}
            className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
              isDeepFreeze
                ? "bg-white text-cyan-900 shadow-[0_0_20px_#ffffff] scale-105 animate-pulse"
                : freezeEnergy >= 40
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(56,189,248,0.4)] hover:brightness-110 active:scale-95"
                : "bg-white/5 text-white/30 border border-white/5 cursor-not-allowed"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {isDeepFreeze ? "DEEP FREEZE ACTIVE!" : "ACTIVATE DEEP FREEZE ❄️"}
          </button>
        </div>
      </div>
    </div>
  );
};
