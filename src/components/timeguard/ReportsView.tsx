"use client";

import React from "react";
import { 
  BarChart2, 
  Calendar, 
  TrendingDown, 
  ShieldAlert, 
  FileText, 
  CheckCircle, 
  Flame,
  Clock,
  Sparkles
} from "lucide-react";
import { AppItem, DayUsageRecord, OverrideLog } from "./types";
import { TimeGuardStorage } from "./storage";

interface ReportsViewProps {
  history: DayUsageRecord[];
  apps: AppItem[];
  overrides: OverrideLog[];
  dailyGoalMinutes: number;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  history,
  apps,
  overrides,
  dailyGoalMinutes,
}) => {
  // Combine historical records with today's current usage for a full 7-day picture
  const todayDate = TimeGuardStorage.getTodayDateStr();
  const todayTotal = apps.reduce((sum, a) => sum + (a.usedTodayMinutes || 0), 0);

  const last7Days = React.useMemo(() => {
    const list = [...history];
    // Check if today is already in list or needs to be appended
    const hasToday = list.some((r) => r.date === todayDate);
    if (!hasToday) {
      list.push({
        date: todayDate,
        totalMinutes: todayTotal,
        appUsage: {},
        wellnessScore: 85,
        goalMet: todayTotal <= dailyGoalMinutes,
      });
    }
    return list.slice(-7);
  }, [history, todayDate, todayTotal, dailyGoalMinutes]);

  // Max minutes for scaling chart bars
  const maxMins = Math.max(240, ...last7Days.map((d) => d.totalMinutes));

  // Weekly average
  const weeklyTotal = last7Days.reduce((acc, d) => acc + d.totalMinutes, 0);
  const weeklyAvg = Math.round(weeklyTotal / Math.max(1, last7Days.length));

  // Category summary
  const categoryTotals: Record<string, number> = {};
  apps.forEach((a) => {
    categoryTotals[a.category] = (categoryTotals[a.category] || 0) + (a.usedTodayMinutes || 0);
  });

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Screen Time Analytics &amp; Reports
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Historical device records, goal adherence rates, and emergency override audits.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <CheckCircle className="w-3.5 h-3.5" />
          Real Local Records · Zero Fake Data
        </div>
      </div>

      {/* 7-Day Screen Time Bar Chart */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              7-Day Daily Screen Time
            </h3>
            <p className="text-xs text-white/50">
              Daily recorded minutes against your {Math.floor(dailyGoalMinutes / 60)}h daily target line
            </p>
          </div>

          <div className="text-xs font-mono text-white/70">
            Weekly Daily Average: <span className="text-cyan-300 font-bold">{Math.floor(weeklyAvg / 60)}h {weeklyAvg % 60}m</span>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="h-64 w-full pt-6 flex items-end justify-between gap-2 sm:gap-4 border-b border-white/10 relative">
          {/* Target Line */}
          <div 
            className="absolute left-0 right-0 border-b border-dashed border-cyan-400/50 z-10 pointer-events-none"
            style={{ bottom: `${(dailyGoalMinutes / maxMins) * 100}%` }}
          >
            <span className="absolute right-0 -top-5 text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
              Goal: {dailyGoalMinutes}m
            </span>
          </div>

          {last7Days.map((day) => {
            const heightPercent = Math.min(100, Math.round((day.totalMinutes / maxMins) * 100));
            const isToday = day.date === todayDate;
            const isOverGoal = day.totalMinutes > dailyGoalMinutes;
            const dayName = new Date(day.date).toLocaleDateString("en-US", { weekday: "short" });

            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* Floating tooltip on hover */}
                <span className="text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity text-white/80 bg-slate-900 px-1.5 py-0.5 rounded border border-white/10">
                  {day.totalMinutes}m
                </span>

                {/* Bar */}
                <div className="w-full max-w-[42px] bg-white/[0.04] rounded-t-xl h-full flex items-end p-1">
                  <div
                    className={`w-full rounded-t-lg transition-all duration-500 ${
                      isOverGoal
                        ? "bg-gradient-to-t from-red-600 to-rose-400"
                        : isToday
                        ? "bg-gradient-to-t from-violet-600 via-indigo-500 to-cyan-400 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        : "bg-gradient-to-t from-violet-900/60 to-violet-500/70"
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                {/* Day Label */}
                <span className={`text-[11px] font-mono ${isToday ? "text-cyan-300 font-bold" : "text-white/40"}`}>
                  {isToday ? "Today" : dayName}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Emergency Override Audit Trail */}
      <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold font-display text-white">
                Emergency Override Audit Trail
              </h3>
              <p className="text-xs text-white/50">
                Log of conscious limits overridden with declared justification
              </p>
            </div>
          </div>
          <span className="text-xs font-mono text-white/40">
            {overrides.length} recorded
          </span>
        </div>

        {overrides.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-white/[0.02] border border-white/[0.06] text-white/40 text-xs font-mono">
            Zero emergency overrides recorded. You have respected all active limits! 🛡️
          </div>
        ) : (
          <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
            {overrides.map((ovr) => (
              <div
                key={ovr.id}
                className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between text-xs font-mono"
              >
                <div>
                  <span className="font-bold text-white">{ovr.appName}</span>{" "}
                  <span className="text-white/40">({ovr.minutesGranted}m granted)</span>
                  <div className="text-[11px] text-amber-300/80 mt-0.5">
                    Reason: &quot;{ovr.reason}&quot;
                  </div>
                </div>
                <div className="text-right text-[11px] text-white/40">
                  {new Date(ovr.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
