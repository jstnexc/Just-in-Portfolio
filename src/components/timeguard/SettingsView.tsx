"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Bell, 
  ShieldCheck, 
  Download, 
  Upload, 
  Trash2, 
  Smartphone, 
  Lock, 
  HelpCircle,
  CheckCircle2,
  FileCode,
  AlertTriangle
} from "lucide-react";
import { TimeGuardSettings } from "./types";
import { NotificationService } from "./notificationService";
import { TimeGuardStorage } from "./storage";

interface SettingsViewProps {
  settings: TimeGuardSettings;
  onUpdateSettings: (settings: TimeGuardSettings) => void;
  onDataReset: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onDataReset,
}) => {
  const [hasWebNotif, setHasWebNotif] = useState<boolean>(() => NotificationService.isPermissionGranted());
  const [importStatus, setImportStatus] = useState<string>("");

  const handleRequestNotif = async () => {
    const granted = await NotificationService.requestPermission();
    setHasWebNotif(granted);
    if (granted) {
      NotificationService.emitToast({
        id: `perm-granted-${Date.now()}`,
        title: "Notifications Enabled",
        message: "You will now receive early warning & limit threshold notifications.",
        type: "success",
        timestamp: Date.now(),
      });
    }
  };

  const handleExportData = () => {
    const dataStr = TimeGuardStorage.exportAllData();
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `timeguard-backup-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const success = TimeGuardStorage.importAllData(text);
        if (success) {
          setImportStatus("✓ Data successfully imported! Reloading...");
          setTimeout(() => window.location.reload(), 1000);
        } else {
          setImportStatus("❌ Invalid backup file format.");
        }
      } catch {
        setImportStatus("❌ Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl">
        <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
          System Preferences &amp; Platform Architecture
        </h2>
        <p className="text-xs sm:text-sm text-white/50 mt-1">
          Configure notification thresholds, emergency override policies, and examine native Android companion integration.
        </p>
      </div>

      {/* Grid: Preferences & Platform Architecture */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Card 1: Core TimeGuard Settings */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl space-y-6">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Settings className="w-5 h-5 text-violet-400" />
            <h3 className="font-bold text-base text-white">Application Controls</h3>
          </div>

          {/* Daily Goal Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-white/80">Daily Overall Screen Time Goal:</span>
              <span className="text-violet-300 font-bold">
                {Math.floor(settings.dailyScreenTimeGoalMinutes / 60)}h {settings.dailyScreenTimeGoalMinutes % 60}m
              </span>
            </div>
            <input
              type="range"
              min="60"
              max="360"
              step="15"
              value={settings.dailyScreenTimeGoalMinutes}
              onChange={(e) => onUpdateSettings({
                ...settings,
                dailyScreenTimeGoalMinutes: Number(e.target.value)
              })}
              className="w-full accent-violet-400 cursor-pointer"
            />
          </div>

          {/* Strict Mode Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                Strict Mode Enforcement
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Requires typing confirmation phrase before emergency overrides.
              </p>
            </div>
            <button
              onClick={() => onUpdateSettings({
                ...settings,
                strictMode: !settings.strictMode
              })}
              className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                settings.strictMode ? "bg-violet-600" : "bg-white/15"
              }`}
            >
              <span className={`block w-5 h-5 rounded-full bg-white transition-transform ${
                settings.strictMode ? "translate-x-6" : "translate-x-0.5"
              }`} />
            </button>
          </div>

          {/* Notification Permission Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div>
              <div className="font-bold text-sm text-white flex items-center gap-2">
                <Bell className="w-4 h-4 text-cyan-400" />
                Web Notification Alerts
              </div>
              <p className="text-xs text-white/50 mt-0.5">
                Alerts at 75% early warning and 100% limit expiration.
              </p>
            </div>
            {hasWebNotif ? (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                Granted ✓
              </span>
            ) : (
              <button
                onClick={handleRequestNotif}
                className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer"
              >
                Enable
              </button>
            )}
          </div>
        </div>

        {/* Card 2: Native Android Architecture Details */}
        <div className="p-6 sm:p-7 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-white/10">
            <Smartphone className="w-5 h-5 text-cyan-400" />
            <h3 className="font-bold text-base text-white">Native Android Architecture</h3>
          </div>

          <p className="text-xs text-white/70 leading-relaxed">
            TimeGuard is architected with a decoupled native Android companion engine using modern Kotlin &amp; Jetpack:
          </p>

          <div className="space-y-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-violet-300 font-bold">1. UsageStatsManager:</span>
              <p className="text-white/50 font-sans mt-0.5">
                Requires <code className="text-cyan-300">PACKAGE_USAGE_STATS</code> granted via Android Special App Access. Tracks foreground/background transitions without counting overlapping intervals.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-amber-300 font-bold">2. AccessibilityService / Overlay:</span>
              <p className="text-white/50 font-sans mt-0.5">
                Uses <code className="text-cyan-300">AccessibilityService</code> &amp; <code className="text-cyan-300">SYSTEM_ALERT_WINDOW</code> to detect foreground package transitions and present the TimeGuard blocking interface.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-emerald-300 font-bold">3. WorkManager Midnight Worker:</span>
              <p className="text-white/50 font-sans mt-0.5">
                Executes exact midnight resets, rolls historical records into Room/DataStore, and reschedules daily allowances.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Data & Privacy Management */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0e0a24]/80 border border-white/10 backdrop-blur-xl space-y-6">
        <div>
          <h3 className="text-lg font-bold font-display text-white">
            Data Ownership &amp; Privacy
          </h3>
          <p className="text-xs text-white/50">
            All usage metrics, limit definitions, focus records, and reflection journals are stored locally on your device.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            onClick={handleExportData}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-2 cursor-pointer"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            Export Backup (JSON)
          </button>

          <label className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/[0.05] hover:bg-white/10 text-white border border-white/10 transition-colors flex items-center gap-2 cursor-pointer">
            <Upload className="w-4 h-4 text-violet-400" />
            Import Backup
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>

          <button
            onClick={onDataReset}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-red-500/10 hover:bg-red-500/20 text-red-300 border border-red-500/30 transition-colors flex items-center gap-2 cursor-pointer ml-auto"
          >
            <Trash2 className="w-4 h-4" />
            Reset All Data to Defaults
          </button>
        </div>

        {importStatus && (
          <p className="text-xs font-mono text-cyan-300">{importStatus}</p>
        )}
      </div>
    </div>
  );
};
