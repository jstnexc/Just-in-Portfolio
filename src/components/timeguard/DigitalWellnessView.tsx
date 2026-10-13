"use client";

import React, { useState } from "react";
import { 
  Sparkles, 
  Flame, 
  BookOpen, 
  Compass, 
  Smile, 
  CheckCircle2, 
  Plus, 
  Feather, 
  Heart,
  TrendingDown,
  Sun
} from "lucide-react";
import { ReflectionEntry } from "./types";
import { TimeGuardStorage } from "./storage";

interface DigitalWellnessViewProps {
  streakDays: number;
  reflections: ReflectionEntry[];
  onAddReflection: (entry: ReflectionEntry) => void;
}

const OFFLINE_ACTIVITIES = [
  { title: "Nature Walk & Stroll", duration: "20 mins", desc: "Leave your phone in your pocket and observe physical surroundings." },
  { title: "Physical Book Reading", duration: "30 mins", desc: "Read non-backlit ink pages to allow visual photoreceptor recovery." },
  { title: "Mindful Deep Breathing", duration: "10 mins", desc: "5-count in, 5-count hold, 5-count exhale to reset cognitive overload." },
  { title: "Bodyweight Stretch Routine", duration: "15 mins", desc: "Release neck, shoulder, and spinal tension from device posture." },
  { title: "Face-to-Face Catchup", duration: "45 mins", desc: "Enjoy a cup of coffee or chat without any phone on the table." },
];

export const DigitalWellnessView: React.FC<DigitalWellnessViewProps> = ({
  streakDays,
  reflections,
  onAddReflection,
}) => {
  const [mood, setMood] = useState<"great" | "balanced" | "distracted" | "overwhelmed">("balanced");
  const [notes, setNotes] = useState("");
  const [activity, setActivity] = useState(OFFLINE_ACTIVITIES[0].title);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;

    const entry: ReflectionEntry = {
      id: `ref-${Date.now()}`,
      date: TimeGuardStorage.getTodayDateStr(),
      mood,
      notes: notes.trim(),
      offlineActivity: activity,
      timestamp: Date.now(),
    };

    onAddReflection(entry);
    setNotes("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="space-y-7">
      {/* Streaks and Motivation Banner */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-violet-950/60 via-purple-950/40 to-slate-950/70 border border-violet-500/30 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <Flame className="w-3.5 h-3.5 fill-current" />
            Active Wellness Streak
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
            {streakDays > 0 ? `${streakDays}-Day Healthy Habit Streak!` : "Start Your Wellness Streak Today"}
          </h2>
          <p className="text-sm text-white/60 max-w-xl leading-relaxed">
            Consistent boundaries protect your dopamine baseline, enhance creative depth, and restore quality sleep.
          </p>
        </div>

        <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.04] border border-white/10 flex-shrink-0">
          <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400">
            <Sun className="w-7 h-7" />
          </div>
          <div>
            <div className="text-2xl font-extrabold font-mono text-white">{streakDays} Days</div>
            <div className="text-[11px] font-mono text-white/50">Goal Compliance</div>
          </div>
        </div>
      </div>

      {/* Suggested Offline Activities */}
      <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl space-y-4">
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Curated Offline Replacements
          </h3>
          <p className="text-xs text-white/50">
            Rewarding physical alternatives to replace habitual phone pickups
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFLINE_ACTIVITIES.map((act) => (
            <div
              key={act.title}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-400/30 transition-all space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-white">{act.title}</span>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                  {act.duration}
                </span>
              </div>
              <p className="text-xs text-white/60 leading-relaxed">
                {act.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Reflection Journal Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center gap-2 mb-2">
            <Feather className="w-4 h-4 text-violet-400" />
            <h3 className="text-base font-bold font-display text-white">
              Daily Mindfulness Check-in
            </h3>
          </div>
          <p className="text-xs text-white/50 mb-5">
            Reflect on how your screen time felt today and log your intentional offline activity.
          </p>

          <form onSubmit={handleSubmitJournal} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-white/70">How was your digital balance today?</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: "great", label: "🌟 Great" },
                  { id: "balanced", label: "🌿 Balanced" },
                  { id: "distracted", label: "📱 Distracted" },
                  { id: "overwhelmed", label: "🌪️ Heavy" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMood(m.id as any)}
                    className={`py-2 px-1 text-xs rounded-xl font-medium border transition-colors cursor-pointer ${
                      mood === m.id
                        ? "bg-violet-600/30 border-violet-400 text-white"
                        : "border-white/10 text-white/50 hover:text-white"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/70">Offline Activity Chosen:</label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-violet-400"
              >
                {OFFLINE_ACTIVITIES.map((a) => (
                  <option key={a.title} value={a.title}>{a.title} ({a.duration})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-white/70">Reflection Notes:</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="What felt good about stepping away today? What distracted you?"
                className="w-full rounded-xl bg-slate-900 border border-white/15 p-3 text-xs text-white focus:outline-none focus:border-violet-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-bold text-xs bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Save Check-in
            </button>

            {submitted && (
              <p className="text-xs text-emerald-400 text-center font-medium">
                ✓ Check-in saved to local journal!
              </p>
            )}
          </form>
        </div>

        {/* Recent Reflections List (6 cols) */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold font-display text-white mb-1">
              Recent Journal Reflections
            </h3>
            <p className="text-xs text-white/50 mb-4">
              Stored locally on your device
            </p>

            {reflections.length === 0 ? (
              <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white/40 text-xs font-mono">
                No reflections logged yet. Submit your first check-in today!
              </div>
            ) : (
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {reflections.slice(0, 5).map((r) => (
                  <div
                    key={r.id}
                    className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-1 text-xs"
                  >
                    <div className="flex items-center justify-between text-white/40 font-mono text-[11px]">
                      <span>{r.date}</span>
                      <span className="capitalize font-semibold text-violet-300">Mood: {r.mood}</span>
                    </div>
                    <div className="text-white/80 leading-relaxed font-sans">{r.notes}</div>
                    <div className="text-[11px] text-cyan-300 font-mono">
                      Activity: {r.offlineActivity}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
