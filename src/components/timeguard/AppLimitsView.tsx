"use client";

import React, { useState } from "react";
import { 
  Plus, 
  Trash2, 
  Clock, 
  Sliders, 
  Shield, 
  Play, 
  Edit3, 
  Check, 
  X,
  Lock,
  RotateCcw,
  SlidersHorizontal,
  Calendar
} from "lucide-react";
import { AppItem, AppCategory } from "./types";

interface AppLimitsViewProps {
  apps: AppItem[];
  onUpdateApp: (app: AppItem) => void;
  onDeleteApp: (id: string) => void;
  onAddApp: (app: AppItem) => void;
  onLaunchApp: (app: AppItem) => void;
}

export const AppLimitsView: React.FC<AppLimitsViewProps> = ({
  apps,
  onUpdateApp,
  onDeleteApp,
  onAddApp,
  onLaunchApp,
}) => {
  const [editingAppId, setEditingAppId] = useState<string | null>(null);
  const [editLimit, setEditLimit] = useState<number>(30);
  const [editWeekendLimit, setEditWeekendLimit] = useState<number>(45);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New App Form State
  const [newName, setNewName] = useState("");
  const [newPackage, setNewPackage] = useState("");
  const [newCategory, setNewCategory] = useState<AppCategory>("Social");
  const [newDailyLimit, setNewDailyLimit] = useState(30);

  const startEditing = (app: AppItem) => {
    setEditingAppId(app.id);
    setEditLimit(app.dailyLimitMinutes);
    setEditWeekendLimit(app.weekendLimitMinutes || app.dailyLimitMinutes);
  };

  const saveEditing = (app: AppItem) => {
    const updated: AppItem = {
      ...app,
      dailyLimitMinutes: editLimit,
      weekendLimitMinutes: editWeekendLimit,
      // If new limit is higher than used, un-restrict
      isRestricted: app.usedTodayMinutes >= editLimit,
    };
    onUpdateApp(updated);
    setEditingAppId(null);
  };

  const toggleMonitoring = (app: AppItem) => {
    onUpdateApp({
      ...app,
      isMonitored: !app.isMonitored,
    });
  };

  const resetTodayUsage = (app: AppItem) => {
    onUpdateApp({
      ...app,
      usedTodayMinutes: 0,
      isRestricted: false,
    });
  };

  const handleCreateApp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const colors = [
      "from-violet-600 to-indigo-700",
      "from-rose-500 to-orange-500",
      "from-emerald-600 to-teal-700",
      "from-cyan-500 to-blue-600",
      "from-amber-500 to-pink-600"
    ];
    const randomBg = colors[Math.floor(Math.random() * colors.length)];

    const newApp: AppItem = {
      id: newPackage.trim() || `app-${Date.now()}`,
      name: newName.trim(),
      packageName: newPackage.trim() || `com.${newName.toLowerCase().replace(/\s+/g, "")}.app`,
      category: newCategory,
      iconBg: randomBg,
      dailyLimitMinutes: newDailyLimit,
      weekendLimitMinutes: Math.round(newDailyLimit * 1.5),
      isMonitored: true,
      usedTodayMinutes: 0,
      isRestricted: false,
    };

    onAddApp(newApp);
    setShowAddModal(false);
    setNewName("");
    setNewPackage("");
    setNewDailyLimit(30);
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Monitored App Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
            Application Limit Manager
          </h2>
          <p className="text-xs sm:text-sm text-white/50 mt-1">
            Customize individual daily allowances, weekend schedules, and automatic lockouts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Monitored App
        </button>
      </div>

      {/* Monitored Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {apps.map((app) => {
          const isEditing = editingAppId === app.id;
          const percent = app.dailyLimitMinutes > 0 
            ? Math.round((app.usedTodayMinutes / app.dailyLimitMinutes) * 100) 
            : 0;
          const remainingMins = Math.max(0, app.dailyLimitMinutes - app.usedTodayMinutes);

          return (
            <div
              key={app.id}
              className={`p-6 rounded-3xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                app.isRestricted
                  ? "bg-red-950/20 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.15)]"
                  : "bg-[#0e0a24]/80 border-white/10 hover:border-violet-400/30"
              }`}
            >
              <div>
                {/* App Card Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white font-bold text-lg shadow-md flex-shrink-0`}>
                      {app.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-base text-white">{app.name}</h3>
                        {app.isRestricted && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" />
                            BLOCKED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-white/40 truncate max-w-[200px]">
                        {app.packageName}
                      </p>
                    </div>
                  </div>

                  {/* Monitoring Toggle */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleMonitoring(app)}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                        app.isMonitored
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-white/5 text-white/40 border border-white/10"
                      }`}
                      title={app.isMonitored ? "Active monitoring" : "Monitoring disabled"}
                    >
                      {app.isMonitored ? "Monitored" : "Disabled"}
                    </button>
                  </div>
                </div>

                {/* Edit Form or Display Stats */}
                {isEditing ? (
                  <div className="mt-5 p-4 rounded-2xl bg-white/[0.04] border border-violet-400/30 space-y-4">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-white/80">
                        <span>Daily Limit (Mon - Fri):</span>
                        <span className="text-violet-300 font-bold">{editLimit} minutes ({Math.floor(editLimit / 60)}h {editLimit % 60}m)</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="240"
                        step="5"
                        value={editLimit}
                        onChange={(e) => setEditLimit(Number(e.target.value))}
                        className="w-full accent-violet-400 cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono text-white/80">
                        <span>Weekend Limit (Sat - Sun):</span>
                        <span className="text-cyan-300 font-bold">{editWeekendLimit} minutes</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="300"
                        step="5"
                        value={editWeekendLimit}
                        onChange={(e) => setEditWeekendLimit(Number(e.target.value))}
                        className="w-full accent-cyan-400 cursor-pointer"
                      />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        onClick={() => setEditingAppId(null)}
                        className="px-3 py-1.5 rounded-xl text-xs text-white/60 hover:text-white border border-white/10"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => saveEditing(app)}
                        className="px-4 py-1.5 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {/* Time used vs limit */}
                    <div className="flex items-center justify-between text-xs font-mono">
                      <div className="text-white/60">
                        Used: <span className="text-white font-bold">{app.usedTodayMinutes}m</span> of{" "}
                        <span className="text-violet-300">{app.dailyLimitMinutes}m</span>
                      </div>
                      <div className="text-white/60">
                        Remaining:{" "}
                        <span className={remainingMins === 0 ? "text-red-400 font-bold" : "text-cyan-300 font-bold"}>
                          {remainingMins}m
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          app.isRestricted || percent >= 100
                            ? "bg-red-500"
                            : percent >= 75
                            ? "bg-amber-400"
                            : "bg-gradient-to-r from-violet-500 to-cyan-400"
                        }`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] font-mono text-white/40">
                      <span>Weekend: {app.weekendLimitMinutes || app.dailyLimitMinutes}m</span>
                      <span>Resets 12:00 AM</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons Row */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEditing(app)}
                    className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Edit limits"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => resetTodayUsage(app)}
                    className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/[0.06] transition-colors"
                    title="Reset today's usage count"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteApp(app.id)}
                    className="p-2 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete app"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Simulate Launch App Button */}
                <button
                  onClick={() => onLaunchApp(app)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                    app.isRestricted
                      ? "bg-red-500/20 text-red-300 border border-red-500/40 hover:bg-red-500/30"
                      : "bg-cyan-500/20 text-cyan-200 border border-cyan-400/30 hover:bg-cyan-500/30 hover:text-white shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                  }`}
                >
                  {app.isRestricted ? (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      Test Restriction
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Simulate App Session
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add App Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-in fade-in">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0e0a24] border border-violet-400/30 text-white shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display text-white">Add Monitored Application</h3>
              <button onClick={() => setShowAddModal(false)} className="text-white/40 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApp} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/70">Application Name</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Spotify, Roblox, Twitter"
                  className="w-full rounded-xl bg-slate-900 border border-white/15 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/70">Package Name (Optional)</label>
                <input
                  type="text"
                  value={newPackage}
                  onChange={(e) => setNewPackage(e.target.value)}
                  placeholder="e.g. com.spotify.music"
                  className="w-full rounded-xl bg-slate-900 border border-white/15 px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-400"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-white/70">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as AppCategory)}
                  className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-400"
                >
                  <option value="Social">Social</option>
                  <option value="Gaming">Gaming</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Utilities">Utilities</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-mono text-white/80">
                  <span>Daily Time Limit:</span>
                  <span className="text-violet-300 font-bold">{newDailyLimit} minutes</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="180"
                  step="5"
                  value={newDailyLimit}
                  onChange={(e) => setNewDailyLimit(Number(e.target.value))}
                  className="w-full accent-violet-400 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-xs text-white/60 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)] cursor-pointer"
                >
                  Add Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
