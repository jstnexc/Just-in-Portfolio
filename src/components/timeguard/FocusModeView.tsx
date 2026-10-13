"use client";

import React, { useState, useEffect } from "react";
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Sparkles, 
  ShieldAlert, 
  Clock, 
  Plus, 
  Flame,
  Award,
  Zap
} from "lucide-react";
import confetti from "canvas-confetti";
import { AppItem, FocusSession } from "./types";
import { NotificationService } from "./notificationService";

interface FocusModeViewProps {
  session: FocusSession;
  apps: AppItem[];
  onUpdateSession: (session: FocusSession) => void;
  onSessionComplete: (completedTitle: string, minutes: number) => void;
}

const PRESETS = [
  { label: "Pomodoro Sprint", minutes: 25 },
  { label: "Deep Work Sprint", minutes: 45 },
  { label: "Study Session", minutes: 60 },
  { label: "Flow State", minutes: 90 },
];

export const FocusModeView: React.FC<FocusModeViewProps> = ({
  session,
  apps,
  onUpdateSession,
  onSessionComplete,
}) => {
  const [customMinutes, setCustomMinutes] = useState(30);
  const [selectedApps, setSelectedApps] = useState<string[]>(session.blockedAppIds || []);

  // Sync selectedApps with session
  useEffect(() => {
    setSelectedApps(session.blockedAppIds || []);
  }, [session.blockedAppIds]);

  // Format time mm:ss
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Timer Tick logic
  useEffect(() => {
    if (session.status !== "running") return;

    const interval = setInterval(() => {
      const remaining = session.remainingSeconds - 1;
      if (remaining <= 0) {
        // Complete session!
        clearInterval(interval);
        onUpdateSession({
          ...session,
          remainingSeconds: 0,
          status: "completed",
          completedAt: Date.now(),
        });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch {
          // ignore
        }

        NotificationService.emitToast({
          id: `focus-complete-${Date.now()}`,
          title: "Focus Session Complete! 🎉",
          message: `Great job! You stayed focused for ${session.presetMinutes} minutes. Take a relaxing breather.`,
          type: "success",
          timestamp: Date.now(),
        });

        onSessionComplete(session.title, session.presetMinutes);
      } else {
        onUpdateSession({
          ...session,
          remainingSeconds: remaining,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [session, onUpdateSession, onSessionComplete]);

  // Handlers
  const handleSelectPreset = (minutes: number, title: string) => {
    onUpdateSession({
      ...session,
      title,
      presetMinutes: minutes,
      totalSeconds: minutes * 60,
      remainingSeconds: minutes * 60,
      status: "idle",
      blockedAppIds: selectedApps,
    });
  };

  const handleStart = () => {
    onUpdateSession({
      ...session,
      status: "running",
      startedAt: Date.now(),
      blockedAppIds: selectedApps,
    });

    NotificationService.emitToast({
      id: `focus-start-${Date.now()}`,
      title: "Focus Mode Engaged 🛡️",
      message: `${session.title} (${session.presetMinutes}m) started. Distracting apps are now blocked.`,
      type: "info",
      timestamp: Date.now(),
    });
  };

  const handlePause = () => {
    onUpdateSession({
      ...session,
      status: "paused",
    });
  };

  const handleResume = () => {
    onUpdateSession({
      ...session,
      status: "running",
    });
  };

  const handleReset = () => {
    onUpdateSession({
      ...session,
      status: "idle",
      remainingSeconds: session.totalSeconds,
    });
  };

  const toggleAppBlocked = (appId: string) => {
    const updated = selectedApps.includes(appId)
      ? selectedApps.filter((id) => id !== appId)
      : [...selectedApps, appId];
    setSelectedApps(updated);
    onUpdateSession({
      ...session,
      blockedAppIds: updated,
    });
  };

  // Progress percentage
  const progressPercent = session.totalSeconds > 0 
    ? Math.round(((session.totalSeconds - session.remainingSeconds) / session.totalSeconds) * 100)
    : 0;

  return (
    <div className="space-y-7">
      {/* Top Banner / Focus Preset Bar */}
      <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-400">
            // Distraction Shield
          </span>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white mt-0.5">
            Focus &amp; Deep Work Sanctuary
          </h2>
          <p className="text-xs text-white/50 mt-1">
            Lock out time-draining feeds and games during high-leverage study and work sessions.
          </p>
        </div>

        {/* Preset Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.minutes}
              onClick={() => handleSelectPreset(p.minutes, p.label)}
              disabled={session.status === "running"}
              className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                session.presetMinutes === p.minutes && session.status !== "completed"
                  ? "bg-amber-500/20 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
                  : "bg-white/[0.04] text-white/70 border-white/10 hover:border-white/20 hover:text-white"
              } ${session.status === "running" ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {p.minutes}m {p.label.split(" ")[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Focus Area: Large Circular Timer + Distraction Apps List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Large Timer Visual (7 cols) */}
        <div className="lg:col-span-7 p-8 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl flex flex-col items-center justify-center text-center relative overflow-hidden">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="text-xs font-mono uppercase tracking-widest text-amber-300/80 mb-2">
            {session.title}
          </div>

          {/* Circular Visual Indicator */}
          <div className="relative w-60 h-60 sm:w-72 sm:h-72 my-4 flex items-center justify-center">
            {/* SVG Ring */}
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                className="text-white/10"
                strokeWidth="5"
              />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="currentColor"
                className={session.status === "running" ? "text-amber-400" : "text-violet-400"}
                strokeWidth="5"
                strokeDasharray="264"
                strokeDashoffset={264 - (264 * progressPercent) / 100}
                strokeLinecap="round"
                style={{ transition: "stroke-dashoffset 0.8s ease" }}
              />
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-4xl sm:text-5xl font-extrabold font-mono text-white tracking-tight">
                {formatTime(session.remainingSeconds)}
              </span>
              <span className="text-xs font-mono text-white/50 mt-1">
                {session.status === "running" 
                  ? "SESSION IN PROGRESS" 
                  : session.status === "paused" 
                  ? "SESSION PAUSED" 
                  : session.status === "completed" 
                  ? "COMPLETED!" 
                  : "READY TO START"}
              </span>
              <span className="text-[11px] font-semibold text-amber-300/90 mt-1">
                {selectedApps.length} Apps Blocked
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="mt-4 flex items-center gap-3">
            {session.status === "idle" && (
              <button
                onClick={handleStart}
                className="px-8 py-3.5 rounded-full text-sm font-bold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white shadow-[0_0_30px_rgba(245,158,11,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                Engage Focus Shield
              </button>
            )}

            {session.status === "running" && (
              <>
                <button
                  onClick={handlePause}
                  className="px-6 py-3 rounded-full text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/15 flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Pause className="w-4 h-4 fill-current" />
                  Pause
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-full text-sm font-medium text-white/40 hover:text-white/80 transition-colors"
                  title="Reset session"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            {session.status === "paused" && (
              <>
                <button
                  onClick={handleResume}
                  className="px-6 py-3 rounded-full text-sm font-bold bg-amber-500 hover:bg-amber-400 text-white flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all"
                >
                  <Play className="w-4 h-4 fill-current" />
                  Resume Focus
                </button>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-full text-sm font-medium text-white/50 hover:text-white"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </>
            )}

            {session.status === "completed" && (
              <button
                onClick={handleReset}
                className="px-6 py-3 rounded-full text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_25px_rgba(16,185,129,0.3)] transition-all flex items-center gap-2 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                Start Another Session
              </button>
            )}
          </div>
        </div>

        {/* Apps Blocked During Focus (5 cols) */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-display text-white">
                Applications Blocked in Focus
              </h3>
              <span className="text-xs font-mono text-amber-300">
                {selectedApps.length} active
              </span>
            </div>
            <p className="text-xs text-white/50 mb-4">
              Opening any of these apps during an active session activates the TimeGuard Restriction Shield immediately.
            </p>

            <div className="space-y-2.5 max-h-[340px] overflow-y-auto pr-1">
              {apps.map((app) => {
                const isBlocked = selectedApps.includes(app.id);

                return (
                  <div
                    key={app.id}
                    onClick={() => {
                      if (session.status !== "running") toggleAppBlocked(app.id);
                    }}
                    className={`p-3 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                      isBlocked
                        ? "bg-amber-500/10 border-amber-500/30 text-white"
                        : "bg-white/[0.02] border-white/[0.06] text-white/50 hover:border-white/20"
                    } ${session.status === "running" ? "pointer-events-none opacity-80" : ""}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white font-bold text-xs`}>
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">{app.name}</div>
                        <div className="text-[10px] font-mono text-white/40">{app.category}</div>
                      </div>
                    </div>

                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs ${
                      isBlocked
                        ? "bg-amber-500 border-amber-400 text-black font-bold"
                        : "border-white/20 text-transparent"
                    }`}>
                      ✓
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <span className="text-[11px] font-mono text-white/40">
              💡 Pro-Tip: 45-minute focus intervals align with the brain&apos;s natural ultradian rhythm.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
