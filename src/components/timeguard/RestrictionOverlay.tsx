"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Clock, 
  HeartHandshake, 
  X, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Lock,
  ChevronRight
} from "lucide-react";
import { AppItem, OverrideLog } from "./types";
import { TimeGuardStorage } from "./storage";

interface RestrictionOverlayProps {
  app: AppItem;
  reason?: string;
  isFocusModeActive?: boolean;
  focusTitle?: string;
  focusRemainingMinutes?: number;
  onClose: () => void;
  onOverrideGranted: (appId: string, minutes: number) => void;
  strictMode?: boolean;
}

const HEALTHY_ALTERNATIVES = [
  "Take a 10-minute walk outside and look at the horizon.",
  "Drink a glass of water and do 5 slow, deep breaths.",
  "Read 5 pages of a physical book or study material.",
  "Do a quick 3-minute physical stretch to relieve screen tension.",
  "Call a friend or family member for a real conversation."
];

export const RestrictionOverlay: React.FC<RestrictionOverlayProps> = ({
  app,
  reason = "Daily Limit Reached",
  isFocusModeActive = false,
  focusTitle = "Deep Work",
  focusRemainingMinutes = 15,
  onClose,
  onOverrideGranted,
  strictMode = false,
}) => {
  const [showOverrideForm, setShowOverrideForm] = useState(false);
  const [overrideReason, setOverrideReason] = useState("");
  const [selectedMinutes, setSelectedMinutes] = useState(5);
  const [strictInput, setStrictInput] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const randomTip = React.useMemo(() => {
    return HEALTHY_ALTERNATIVES[Math.floor(Math.random() * HEALTHY_ALTERNATIVES.length)];
  }, []);

  // Calculate time until midnight reset
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diffMs = midnight.getTime() - now.getTime();
  const hoursUntilReset = Math.floor(diffMs / (1000 * 60 * 60));
  const minutesUntilReset = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const handleApplyOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!overrideReason) {
      setErrorMessage("Please select or enter an override reason.");
      return;
    }

    if (strictMode && strictInput.trim().toLowerCase() !== "i acknowledge") {
      setErrorMessage("Please type 'I acknowledge' to confirm conscious override.");
      return;
    }

    // Save override log to local storage
    const log: OverrideLog = {
      id: `ovr-${Date.now()}`,
      appId: app.id,
      appName: app.name,
      reason: overrideReason,
      timestamp: Date.now(),
      date: TimeGuardStorage.getTodayDateStr(),
      minutesGranted: selectedMinutes,
    };
    TimeGuardStorage.saveOverride(log);

    onOverrideGranted(app.id, selectedMinutes);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-2xl animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-red-500/30 bg-[#0d0918]/95 shadow-[0_0_80px_rgba(239,68,68,0.25)] text-white">
        {/* Red Shield Header Bar */}
        <div className="bg-gradient-to-r from-red-950/80 via-rose-950/50 to-slate-950/80 px-6 py-4 border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono uppercase tracking-wider text-red-300/80">
                TimeGuard Digital Shield
              </span>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                Application Restricted
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Main App Badge & Status */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.04] border border-white/10">
            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${app.iconBg} flex items-center justify-center text-white font-bold text-xl shadow-lg flex-shrink-0`}>
              {app.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold truncate text-white">{app.name}</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/20 text-red-300 border border-red-500/30">
                  LOCKED
                </span>
              </div>
              <p className="text-xs text-white/60 font-mono mt-0.5">
                {isFocusModeActive
                  ? `Blocked by Focus Mode: ${focusTitle}`
                  : `${app.usedTodayMinutes}m used of ${app.dailyLimitMinutes}m limit`}
              </p>
            </div>
          </div>

          {/* Inspirational / Core Message */}
          <div className="space-y-3">
            <h4 className="text-xl font-bold font-display text-white">
              Your time is up! ⏳
            </h4>
            <p className="text-sm leading-relaxed text-white/70">
              {isFocusModeActive
                ? `You have an active focus session in progress (${focusRemainingMinutes}m remaining). Protect your focus, resist the impulse, and finish your session strong!`
                : "You have reached your daily limit for this application. Take a break, move around, study, or spend some quality time away from your screen."}
            </p>
          </div>

          {/* Next Reset Timer */}
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-blue-200">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <div className="text-xs">
              <span className="font-semibold text-white">Next Automatic Reset:</span>{" "}
              Local midnight (12:00 AM) in{" "}
              <span className="font-bold text-cyan-300">
                {hoursUntilReset}h {minutesUntilReset}m
              </span>
            </div>
          </div>

          {/* Healthy Activity Suggestion */}
          <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Suggested Healthy Alternative
            </div>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {randomTip}
            </p>
          </div>

          {/* Emergency Access / Override Flow */}
          {!showOverrideForm ? (
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={onClose}
                className="flex-1 py-3 px-5 rounded-2xl font-bold text-sm bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-[0_0_25px_rgba(239,68,68,0.4)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Step Away & Respect Limit
              </button>
              <button
                onClick={() => setShowOverrideForm(true)}
                className="py-3 px-4 rounded-2xl font-medium text-xs text-white/50 hover:text-white/80 border border-white/10 hover:border-white/25 bg-white/[0.03] transition-colors cursor-pointer"
              >
                Emergency Override...
              </button>
            </div>
          ) : (
            <form onSubmit={handleApplyOverride} className="p-4 rounded-2xl bg-white/[0.03] border border-amber-500/30 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
                  <AlertTriangle className="w-4 h-4" />
                  Responsible Emergency Override
                </div>
                <button
                  type="button"
                  onClick={() => setShowOverrideForm(false)}
                  className="text-white/40 hover:text-white text-xs"
                >
                  Cancel
                </button>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-white/70">Select Justification:</label>
                <select
                  value={overrideReason}
                  onChange={(e) => {
                    setOverrideReason(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="">-- Choose reason --</option>
                  <option value="Urgent Communication / Emergency">Urgent Communication / Emergency</option>
                  <option value="Essential Work or Academic Study Task">Essential Work or Academic Task</option>
                  <option value="Important 2FA / Authentication Code">Important 2FA / Security Code</option>
                  <option value="Quick 5-Minute Check">Conscious 5-Minute Quick Check</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-white/70">Grant Extension:</span>
                {[5, 15].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMinutes(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      selectedMinutes === m
                        ? "bg-amber-500/25 border-amber-400 text-amber-300"
                        : "border-white/10 text-white/60 hover:text-white"
                    }`}
                  >
                    +{m} Minutes
                  </button>
                ))}
              </div>

              {strictMode && (
                <div className="space-y-1">
                  <label className="text-[11px] text-amber-200/80">
                    Strict Mode active. Type <span className="text-white font-mono font-bold">&quot;I acknowledge&quot;</span> to confirm:
                  </label>
                  <input
                    type="text"
                    value={strictInput}
                    onChange={(e) => setStrictInput(e.target.value)}
                    placeholder="I acknowledge"
                    className="w-full rounded-xl bg-slate-900 border border-white/15 px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-amber-400"
                  />
                </div>
              )}

              {errorMessage && (
                <p className="text-xs text-red-400">{errorMessage}</p>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl font-bold text-xs bg-amber-500/30 hover:bg-amber-500/40 text-amber-200 border border-amber-400/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] transition-all cursor-pointer"
              >
                Log Reason & Temporarily Extend ({selectedMinutes}m)
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
