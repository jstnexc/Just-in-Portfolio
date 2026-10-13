"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Sliders, 
  Zap, 
  BarChart2, 
  Heart, 
  Settings, 
  ArrowLeft, 
  Flame, 
  Bell, 
  Play, 
  Pause, 
  X, 
  Lock,
  Smartphone,
  ExternalLink,
  Sparkles
} from "lucide-react";

import { 
  AppItem, 
  DayUsageRecord, 
  FocusSession, 
  OverrideLog, 
  ReflectionEntry, 
  TimeGuardSettings 
} from "./types";
import { TimeGuardStorage } from "./storage";
import { NotificationService, ToastAlert } from "./notificationService";
import { DashboardView } from "./DashboardView";
import { AppLimitsView } from "./AppLimitsView";
import { FocusModeView } from "./FocusModeView";
import { ReportsView } from "./ReportsView";
import { DigitalWellnessView } from "./DigitalWellnessView";
import { SettingsView } from "./SettingsView";
import { RestrictionOverlay } from "./RestrictionOverlay";
import { OnboardingModal } from "./OnboardingModal";

export type NavTab = "dashboard" | "limits" | "focus" | "reports" | "wellness" | "settings";

interface TimeGuardAppProps {
  onBackToPortfolio?: () => void;
}

export const TimeGuardApp: React.FC<TimeGuardAppProps> = ({ onBackToPortfolio }) => {
  // App State
  const [activeTab, setActiveTab] = useState<NavTab>("dashboard");
  const [apps, setApps] = useState<AppItem[]>([]);
  const [history, setHistory] = useState<DayUsageRecord[]>([]);
  const [settings, setSettings] = useState<TimeGuardSettings>(TimeGuardStorage.loadSettings());
  const [focusSession, setFocusSession] = useState<FocusSession>(TimeGuardStorage.loadFocusSession());
  const [overrides, setOverrides] = useState<OverrideLog[]>([]);
  const [reflections, setReflections] = useState<ReflectionEntry[]>([]);
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Active Simulated App Session
  const [activeSimApp, setActiveSimApp] = useState<AppItem | null>(null);
  const [simSecondsElapsed, setSimSecondsElapsed] = useState(0);
  const [isSimPaused, setIsSimPaused] = useState(false);

  // Active Restriction Screen
  const [restrictedAppTarget, setRestrictedAppTarget] = useState<AppItem | null>(null);
  const [restrictionReason, setRestrictionReason] = useState<string>("Daily Limit Reached");

  // Load and initialize data
  useEffect(() => {
    const loadedApps = TimeGuardStorage.loadApps();
    const loadedHistory = TimeGuardStorage.loadHistory();

    // Check midnight reset
    const { apps: checkedApps, history: checkedHistory } = TimeGuardStorage.checkMidnightReset(
      loadedApps,
      loadedHistory
    );

    setApps(checkedApps);
    setHistory(checkedHistory);
    setOverrides(TimeGuardStorage.loadOverrides());
    setReflections(TimeGuardStorage.loadReflections());

    const loadedSettings = TimeGuardStorage.loadSettings();
    setSettings(loadedSettings);
    if (!loadedSettings.hasCompletedOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  // Subscribe to in-app toast alerts
  useEffect(() => {
    const unsubscribe = NotificationService.subscribeToToasts((toast) => {
      setToasts((prev) => [toast, ...prev].slice(0, 4));
      // Auto dismiss after 5 seconds
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 5000);
    });
    return unsubscribe;
  }, []);

  // Simulated App Active Session Timer (Ticks every 1s, counts real-time usage)
  useEffect(() => {
    if (!activeSimApp || isSimPaused) return;

    const timer = setInterval(() => {
      setSimSecondsElapsed((prev) => {
        const next = prev + 1;

        // Every 60 seconds (1 minute elapsed)
        if (next % 60 === 0) {
          setApps((prevApps) => {
            const updated = prevApps.map((a) => {
              if (a.id === activeSimApp.id) {
                const newUsed = a.usedTodayMinutes + 1;
                const isOver = newUsed >= a.dailyLimitMinutes;

                // Check notifications
                NotificationService.checkAndNotifyThreshold(
                  a.id,
                  a.name,
                  newUsed,
                  a.dailyLimitMinutes,
                  settings.earlyWarningThreshold,
                  settings.finalWarningThreshold
                );

                if (isOver && !a.isRestricted) {
                  // Trigger restriction!
                  setRestrictedAppTarget(a);
                  setRestrictionReason("Daily Limit Reached (100%)");
                  setActiveSimApp(null);
                }

                return {
                  ...a,
                  usedTodayMinutes: newUsed,
                  isRestricted: isOver,
                  lastUsedTimestamp: Date.now(),
                };
              }
              return a;
            });

            TimeGuardStorage.saveApps(updated);
            return updated;
          });
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [activeSimApp, isSimPaused, settings]);

  // Launch App Simulator or check restriction
  const handleLaunchApp = useCallback((app: AppItem) => {
    // 1. Check if app is already restricted
    if (app.isRestricted) {
      setRestrictedAppTarget(app);
      setRestrictionReason("Daily Limit Reached");
      return;
    }

    // 2. Check if blocked by active focus session
    if (focusSession.status === "running" && focusSession.blockedAppIds.includes(app.id)) {
      setRestrictedAppTarget(app);
      setRestrictionReason(`Blocked by Focus Session: ${focusSession.title}`);
      return;
    }

    // 3. Launch simulated active session
    setActiveSimApp(app);
    setSimSecondsElapsed(0);
    setIsSimPaused(false);

    NotificationService.emitToast({
      id: `launch-${Date.now()}`,
      title: `${app.name} Active`,
      message: `Tracking active foreground screen time. Limit: ${app.dailyLimitMinutes}m.`,
      type: "info",
      timestamp: Date.now(),
    });
  }, [focusSession]);

  // App handlers
  const handleUpdateApp = (updated: AppItem) => {
    const newApps = apps.map((a) => (a.id === updated.id ? updated : a));
    setApps(newApps);
    TimeGuardStorage.saveApps(newApps);
  };

  const handleDeleteApp = (id: string) => {
    const newApps = apps.filter((a) => a.id !== id);
    setApps(newApps);
    TimeGuardStorage.saveApps(newApps);
  };

  const handleAddApp = (newApp: AppItem) => {
    const newApps = [newApp, ...apps];
    setApps(newApps);
    TimeGuardStorage.saveApps(newApps);
  };

  // Focus Session handler
  const handleUpdateFocusSession = (updatedSession: FocusSession) => {
    setFocusSession(updatedSession);
    TimeGuardStorage.saveFocusSession(updatedSession);
  };

  const handleFocusComplete = (title: string, minutes: number) => {
    // Grant extra wellness score or bonus
    const updatedHistory = history.map((r, idx) => {
      if (idx === history.length - 1) {
        return { ...r, wellnessScore: Math.min(100, r.wellnessScore + 5) };
      }
      return r;
    });
    setHistory(updatedHistory);
    TimeGuardStorage.saveHistory(updatedHistory);
  };

  // Override granted handler
  const handleOverrideGranted = (appId: string, minutesGranted: number) => {
    const updated = apps.map((a) => {
      if (a.id === appId) {
        return {
          ...a,
          dailyLimitMinutes: a.dailyLimitMinutes + minutesGranted,
          isRestricted: false,
        };
      }
      return a;
    });
    setApps(updated);
    TimeGuardStorage.saveApps(updated);
    setOverrides(TimeGuardStorage.loadOverrides());

    NotificationService.emitToast({
      id: `ovr-toast-${Date.now()}`,
      title: "Temporary Override Active",
      message: `+${minutesGranted}m granted. Please step away once completed.`,
      type: "warning",
      timestamp: Date.now(),
    });
  };

  // Reflection handler
  const handleAddReflection = (entry: ReflectionEntry) => {
    TimeGuardStorage.saveReflection(entry);
    setReflections(TimeGuardStorage.loadReflections());
  };

  // Settings update handler
  const handleUpdateSettings = (updated: TimeGuardSettings) => {
    setSettings(updated);
    TimeGuardStorage.saveSettings(updated);
  };

  const handleDataReset = () => {
    if (confirm("Reset all TimeGuard data, limits, and records to original defaults?")) {
      TimeGuardStorage.clearAllData();
      window.location.reload();
    }
  };

  const streakDays = TimeGuardStorage.calculateStreak(history, settings.dailyScreenTimeGoalMinutes);

  return (
    <div className="h-full flex flex-col bg-[#070414] text-white selection:bg-violet-500 selection:text-white relative font-sans overflow-y-auto">
      {/* Toast Notification Stack */}
      <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl pointer-events-auto transition-all animate-in slide-in-from-top duration-300 text-xs font-sans flex items-start justify-between gap-3 ${
              t.type === "danger"
                ? "bg-red-950/90 border-red-500/40 text-red-100"
                : t.type === "warning"
                ? "bg-amber-950/90 border-amber-500/40 text-amber-100"
                : t.type === "success"
                ? "bg-emerald-950/90 border-emerald-500/40 text-emerald-100"
                : "bg-slate-900/90 border-cyan-500/40 text-cyan-100"
            }`}
          >
            <div>
              <div className="font-bold text-sm">{t.title}</div>
              <div className="text-white/80 mt-0.5 leading-relaxed">{t.message}</div>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              className="text-white/40 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Top App Header Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#070414]/90 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          {/* Logo & Back button */}
          <div className="flex items-center gap-3">
            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Back to Justine Jay Arteche Portfolio"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center text-white shadow-[0_0_20px_rgba(139,92,246,0.4)]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-display font-extrabold text-base tracking-tight text-white flex items-center gap-2">
                  TimeGuard
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 hidden sm:inline-block">
                    v2.4
                  </span>
                </div>
                <div className="text-[11px] font-mono text-white/45 hidden sm:block">
                  Screen Time &amp; Digital Addiction Shield
                </div>
              </div>
            </div>
          </div>

          {/* Header Action Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {streakDays > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 border border-amber-500/30 text-amber-300">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>{streakDays}d Streak</span>
              </div>
            )}

            <button
              onClick={() => setShowOnboarding(true)}
              className="text-xs px-3 py-1.5 rounded-xl border border-white/10 text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
            >
              Tour &amp; Guide
            </button>

            {onBackToPortfolio && (
              <button
                onClick={onBackToPortfolio}
                className="p-2 sm:px-3 sm:py-1.5 rounded-xl border border-white/15 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/30 transition-colors cursor-pointer flex items-center gap-1.5 text-xs font-semibold"
                title="Close TimeGuard (Return to Portfolio)"
              >
                <X className="w-4 h-4" />
                <span className="hidden sm:inline">Close</span>
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs Pill Bar */}
        <div className="mx-auto max-w-7xl px-4 sm:px-8 border-t border-white/[0.04]">
          <nav className="flex items-center gap-1 sm:gap-2 overflow-x-auto py-2.5 scrollbar-none">
            {[
              { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
              { id: "limits", label: "App Limits", icon: Sliders },
              { id: "focus", label: "Focus Mode", icon: Zap },
              { id: "reports", label: "Reports & Charts", icon: BarChart2 },
              { id: "wellness", label: "Digital Wellness", icon: Heart },
              { id: "settings", label: "Settings & Architecture", icon: Settings },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as NavTab)}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-violet-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                      : "text-white/60 hover:text-white hover:bg-white/[0.05]"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content View Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-8 py-8 sm:py-10">
        {activeTab === "dashboard" && (
          <DashboardView
            apps={apps}
            history={history}
            focusSession={focusSession}
            settings={settings}
            onLaunchApp={handleLaunchApp}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === "limits" && (
          <AppLimitsView
            apps={apps}
            onUpdateApp={handleUpdateApp}
            onDeleteApp={handleDeleteApp}
            onAddApp={handleAddApp}
            onLaunchApp={handleLaunchApp}
          />
        )}

        {activeTab === "focus" && (
          <FocusModeView
            session={focusSession}
            apps={apps}
            onUpdateSession={handleUpdateFocusSession}
            onSessionComplete={handleFocusComplete}
          />
        )}

        {activeTab === "reports" && (
          <ReportsView
            history={history}
            apps={apps}
            overrides={overrides}
            dailyGoalMinutes={settings.dailyScreenTimeGoalMinutes}
          />
        )}

        {activeTab === "wellness" && (
          <DigitalWellnessView
            streakDays={streakDays}
            reflections={reflections}
            onAddReflection={handleAddReflection}
          />
        )}

        {activeTab === "settings" && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onDataReset={handleDataReset}
          />
        )}
      </main>

      {/* Simulated Live Foreground App Drawer */}
      {activeSimApp && (
        <div className="fixed bottom-6 right-6 z-40 max-w-sm w-full p-5 rounded-3xl bg-[#0e0a24]/95 border border-cyan-400/40 shadow-[0_0_40px_rgba(34,211,238,0.25)] backdrop-blur-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${activeSimApp.iconBg} flex items-center justify-center text-white font-bold text-xs`}>
                {activeSimApp.name.charAt(0)}
              </div>
              <div>
                <span className="text-xs font-bold text-white">{activeSimApp.name}</span>
                <p className="text-[10px] font-mono text-cyan-300">Active Foreground Session</p>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsSimPaused(!isSimPaused)}
                className="p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20"
                title={isSimPaused ? "Resume" : "Pause"}
              >
                {isSimPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setActiveSimApp(null)}
                className="p-1.5 rounded-lg text-white/50 hover:text-white"
                title="Close simulation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="mt-3 space-y-2 text-xs font-mono">
            <div className="flex justify-between text-white/70">
              <span>Session Duration:</span>
              <span className="text-white font-bold">{simSecondsElapsed}s (real-time tick)</span>
            </div>
            <div className="flex justify-between text-white/70">
              <span>Today&apos;s Total Used:</span>
              <span className="text-cyan-300 font-bold">{activeSimApp.usedTodayMinutes}m of {activeSimApp.dailyLimitMinutes}m</span>
            </div>

            <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-300"
                style={{ width: `${Math.min(100, (activeSimApp.usedTodayMinutes / activeSimApp.dailyLimitMinutes) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Restriction Lockout Overlay */}
      {restrictedAppTarget && (
        <RestrictionOverlay
          app={restrictedAppTarget}
          reason={restrictionReason}
          isFocusModeActive={focusSession.status === "running" && focusSession.blockedAppIds.includes(restrictedAppTarget.id)}
          focusTitle={focusSession.title}
          focusRemainingMinutes={Math.floor(focusSession.remainingSeconds / 60)}
          onClose={() => setRestrictedAppTarget(null)}
          onOverrideGranted={handleOverrideGranted}
          strictMode={settings.strictMode}
        />
      )}

      {/* Onboarding Tour Modal */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={() => {
            setShowOnboarding(false);
            const updated = { ...settings, hasCompletedOnboarding: true };
            handleUpdateSettings(updated);
          }}
        />
      )}
    </div>
  );
};
