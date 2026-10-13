"use client";

import React from "react";
import { 
  Clock, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle, 
  Play, 
  Flame, 
  Zap, 
  ArrowUpRight,
  ShieldAlert,
  Smartphone
} from "lucide-react";
import { AppItem, DayUsageRecord, FocusSession, TimeGuardSettings } from "./types";

interface DashboardViewProps {
  apps: AppItem[];
  history: DayUsageRecord[];
  focusSession: FocusSession;
  settings: TimeGuardSettings;
  onLaunchApp: (app: AppItem) => void;
  onNavigateTab: (tab: "dashboard" | "limits" | "focus" | "reports" | "wellness" | "settings") => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  apps,
  history,
  focusSession,
  settings,
  onLaunchApp,
  onNavigateTab,
}) => {
  // Total screen time today
  const totalMinutesToday = apps.reduce((acc, app) => acc + (app.usedTodayMinutes || 0), 0);
  const hoursToday = Math.floor(totalMinutesToday / 60);
  const minsToday = totalMinutesToday % 60;

  // Comparison with yesterday
  const yesterdayRecord = history.length > 0 ? history[history.length - 1] : null;
  const yesterdayMinutes = yesterdayRecord ? yesterdayRecord.totalMinutes : 180;
  const percentChange = yesterdayMinutes > 0 
    ? Math.round(((totalMinutesToday - yesterdayMinutes) / yesterdayMinutes) * 100) 
    : 0;

  // Daily goal calculation
  const goalMinutes = settings.dailyScreenTimeGoalMinutes || 180;
  const goalRemaining = Math.max(0, goalMinutes - totalMinutesToday);
  const goalProgress = Math.min(100, Math.round((totalMinutesToday / goalMinutes) * 100));

  // Category breakdown
  const categoryTotals: Record<string, number> = {
    Social: 0,
    Entertainment: 0,
    Gaming: 0,
    Productivity: 0,
    Utilities: 0,
  };
  apps.forEach((a) => {
    categoryTotals[a.category] = (categoryTotals[a.category] || 0) + (a.usedTodayMinutes || 0);
  });

  // Calculate wellness score today (0-100)
  const restrictedCount = apps.filter((a) => a.isRestricted).length;
  let wellnessScore = 100;
  if (totalMinutesToday > goalMinutes) {
    wellnessScore -= Math.min(40, Math.round(((totalMinutesToday - goalMinutes) / goalMinutes) * 50));
  }
  wellnessScore -= restrictedCount * 12;
  wellnessScore = Math.max(35, Math.min(100, wellnessScore));

  const wellnessStatus = wellnessScore >= 80 
    ? { label: "Mindful & Balanced", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" }
    : wellnessScore >= 60
    ? { label: "Moderate Screen Time", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" }
    : { label: "High Usage Alert", color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" };

  // Sort apps by usage
  const sortedApps = [...apps].sort((a, b) => b.usedTodayMinutes - a.usedTodayMinutes);
  const approachingLimitApps = apps.filter(
    (a) => a.isMonitored && a.usedTodayMinutes >= a.dailyLimitMinutes * 0.75 && !a.isRestricted
  );

  return (
    <div className="space-y-7">
      {/* Simulation / Realism Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/20 text-cyan-200">
        <div className="flex items-center gap-3">
          <Smartphone className="w-5 h-5 text-cyan-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-semibold text-white">Active Real-Time Simulation Engine:</span>{" "}
            Test real foreground session tracking &amp; instant limit restriction by clicking{" "}
            <span className="font-mono text-cyan-300">&quot;Simulate Launch&quot;</span> on any monitored app.
          </div>
        </div>
        <button
          onClick={() => onNavigateTab("limits")}
          className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-white transition-colors cursor-pointer flex-shrink-0"
        >
          Configure Limits →
        </button>
      </div>

      {/* Top 3 KPI Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Metric 1: Total Screen Time Today */}
        <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-violet-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider">
            <span>Screen Time Today</span>
            <Clock className="w-4 h-4 text-violet-400" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              {hoursToday}h {minsToday}m
            </span>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs">
            {percentChange <= 0 ? (
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <TrendingDown className="w-3.5 h-3.5" />
                {Math.abs(percentChange)}% vs yesterday
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full">
                <TrendingUp className="w-3.5 h-3.5" />
                +{percentChange}% vs yesterday
              </span>
            )}
            <span className="text-white/40">Yesterday: {Math.floor(yesterdayMinutes / 60)}h {yesterdayMinutes % 60}m</span>
          </div>

          {/* Goal Progress Bar */}
          <div className="mt-5 space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono text-white/50">
              <span>Daily Goal: {Math.floor(goalMinutes / 60)}h</span>
              <span>{goalRemaining > 0 ? `${goalRemaining}m remaining` : "Goal exceeded"}</span>
            </div>
            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${
                  goalProgress > 100 
                    ? "bg-rose-500" 
                    : goalProgress > 80 
                    ? "bg-amber-400" 
                    : "bg-gradient-to-r from-violet-500 to-cyan-400"
                }`}
                style={{ width: `${Math.min(100, goalProgress)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Metric 2: Digital Wellness Score */}
        <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider">
            <span>Wellness Index</span>
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </div>

          <div className="mt-3 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              {wellnessScore}
            </span>
            <span className="text-xs font-mono text-white/40">/ 100</span>
          </div>

          <div className="mt-3">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${wellnessStatus.bg} ${wellnessStatus.color} ${wellnessStatus.border}`}>
              <ShieldCheck className="w-3.5 h-3.5" />
              {wellnessStatus.label}
            </span>
          </div>

          <p className="mt-4 text-xs text-white/60 leading-relaxed">
            {restrictedCount > 0 
              ? `${restrictedCount} monitored application(s) currently restricted.` 
              : "Zero limits exceeded today. Keep up the balanced pace!"}
          </p>
        </div>

        {/* Metric 3: Focus & App Shield Status */}
        <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-600/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-white/60 text-xs font-mono uppercase tracking-wider">
            <span>Focus Mode Status</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>

          <div className="mt-3">
            <div className="text-xl font-bold font-display text-white">
              {focusSession.status === "running" ? (
                <span className="text-amber-300 animate-pulse">Session Active</span>
              ) : (
                "Ready for Focus"
              )}
            </div>
            <p className="text-xs text-white/60 mt-1">
              {focusSession.status === "running" 
                ? `${Math.floor(focusSession.remainingSeconds / 60)}m left in ${focusSession.title}`
                : "Block distractions and enter deep work mode."}
            </p>
          </div>

          <div className="mt-5">
            <button
              onClick={() => onNavigateTab("focus")}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold bg-violet-600/25 hover:bg-violet-600/40 text-violet-200 border border-violet-400/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {focusSession.status === "running" ? "View Active Timer" : "Start 25m Focus Sprint"}
            </button>
          </div>
        </div>
      </div>

      {/* Approaching Limits Alert Banner */}
      {approachingLimitApps.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3 text-amber-200 text-xs">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <div>
              <span className="font-bold">Approaching Limits:</span>{" "}
              {approachingLimitApps.map((a) => `${a.name} (${a.usedTodayMinutes}/${a.dailyLimitMinutes}m)`).join(", ")}
            </div>
          </div>
          <button
            onClick={() => onNavigateTab("limits")}
            className="text-amber-300 font-semibold hover:underline flex-shrink-0"
          >
            Review Limits
          </button>
        </div>
      )}

      {/* Main Grid: Most Used Apps + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Most Used Applications (2 Cols) */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-lg font-bold font-display text-white">
                Application Usage Today
              </h3>
              <p className="text-xs text-white/50">
                Tracked foreground minutes &amp; active time limits
              </p>
            </div>
            <button
              onClick={() => onNavigateTab("limits")}
              className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 font-semibold"
            >
              Manage Limits
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-4">
            {sortedApps.slice(0, 5).map((app) => {
              const percent = app.dailyLimitMinutes > 0 
                ? Math.round((app.usedTodayMinutes / app.dailyLimitMinutes) * 100) 
                : 0;

              return (
                <div
                  key={app.id}
                  className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:border-violet-400/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white font-bold text-base shadow flex-shrink-0`}>
                      {app.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white truncate">{app.name}</span>
                        {app.isRestricted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30">
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-white/50">{app.category}</span>
                    </div>
                  </div>

                  {/* Usage and Progress */}
                  <div className="w-full sm:w-56 flex flex-col items-end gap-1.5">
                    <div className="flex items-center justify-between w-full text-xs font-mono">
                      <span className="text-white/70">
                        {app.usedTodayMinutes}m <span className="text-white/30">/ {app.dailyLimitMinutes}m</span>
                      </span>
                      <span className={percent >= 100 ? "text-red-400 font-bold" : percent >= 75 ? "text-amber-400" : "text-white/50"}>
                        {percent}%
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          app.isRestricted || percent >= 100
                            ? "bg-red-500"
                            : percent >= 75
                            ? "bg-amber-400"
                            : "bg-cyan-400"
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>

                  {/* Simulate Open Action */}
                  <button
                    onClick={() => onLaunchApp(app)}
                    className="w-full sm:w-auto px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.05] hover:bg-violet-600/30 text-white/80 hover:text-white border border-white/10 hover:border-violet-400/40 transition-colors cursor-pointer flex items-center justify-center gap-1.5 flex-shrink-0"
                  >
                    <Play className="w-3 h-3 fill-current text-cyan-400" />
                    Simulate Launch
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown (1 Col) */}
        <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Category Distribution
            </h3>
            <p className="text-xs text-white/50 mb-6">
              Screen time by application purpose
            </p>

            <div className="space-y-4">
              {Object.entries(categoryTotals).map(([cat, mins]) => {
                const percent = totalMinutesToday > 0 ? Math.round((mins / totalMinutesToday) * 100) : 0;
                const colors: Record<string, string> = {
                  Social: "bg-pink-500",
                  Entertainment: "bg-red-500",
                  Gaming: "bg-indigo-500",
                  Productivity: "bg-emerald-500",
                  Utilities: "bg-cyan-500",
                };

                return (
                  <div key={cat} className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium text-white/80">{cat}</span>
                      <span className="font-mono text-white/50">{mins}m ({percent}%)</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${colors[cat] || "bg-violet-500"}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-white/10">
            <button
              onClick={() => onNavigateTab("wellness")}
              className="w-full py-2.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/[0.08] text-white/80 border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              View Healthy Habits &amp; Streaks →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
