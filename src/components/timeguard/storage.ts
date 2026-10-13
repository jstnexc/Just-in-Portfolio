import { 
  AppItem, 
  DayUsageRecord, 
  FocusSession, 
  NotificationRecord, 
  OverrideLog, 
  ReflectionEntry, 
  TimeGuardSettings 
} from "./types";

export const DEFAULT_APPS: AppItem[] = [
  {
    id: "com.zhiliaoapp.musically",
    name: "TikTok",
    packageName: "com.zhiliaoapp.musically",
    category: "Social",
    iconBg: "from-rose-500 to-pink-600",
    dailyLimitMinutes: 30,
    weekendLimitMinutes: 45,
    isMonitored: true,
    usedTodayMinutes: 24,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 15,
  },
  {
    id: "com.instagram.android",
    name: "Instagram",
    packageName: "com.instagram.android",
    category: "Social",
    iconBg: "from-purple-600 via-pink-500 to-amber-500",
    dailyLimitMinutes: 20,
    weekendLimitMinutes: 30,
    isMonitored: true,
    usedTodayMinutes: 18,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 45,
  },
  {
    id: "com.google.android.youtube",
    name: "YouTube",
    packageName: "com.google.android.youtube",
    category: "Entertainment",
    iconBg: "from-red-600 to-red-700",
    dailyLimitMinutes: 60,
    weekendLimitMinutes: 90,
    isMonitored: true,
    usedTodayMinutes: 52,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 60,
  },
  {
    id: "com.mobile.legends",
    name: "Mobile Legends: Bang Bang",
    packageName: "com.mobile.legends",
    category: "Gaming",
    iconBg: "from-blue-600 to-indigo-800",
    dailyLimitMinutes: 60,
    weekendLimitMinutes: 90,
    isMonitored: true,
    usedTodayMinutes: 60,
    isRestricted: true, // Reached limit!
    lastUsedTimestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: "com.facebook.katana",
    name: "Facebook",
    packageName: "com.facebook.katana",
    category: "Social",
    iconBg: "from-blue-600 to-blue-700",
    dailyLimitMinutes: 45,
    weekendLimitMinutes: 60,
    isMonitored: true,
    usedTodayMinutes: 32,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 90,
  },
  {
    id: "com.netflix.mediaclient",
    name: "Netflix",
    packageName: "com.netflix.mediaclient",
    category: "Entertainment",
    iconBg: "from-red-700 to-black",
    dailyLimitMinutes: 45,
    weekendLimitMinutes: 75,
    isMonitored: true,
    usedTodayMinutes: 15,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 180,
  },
  {
    id: "com.reddit.frontpage",
    name: "Reddit",
    packageName: "com.reddit.frontpage",
    category: "Social",
    iconBg: "from-orange-500 to-red-600",
    dailyLimitMinutes: 30,
    weekendLimitMinutes: 45,
    isMonitored: true,
    usedTodayMinutes: 12,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 120,
  },
  {
    id: "com.discord",
    name: "Discord",
    packageName: "com.discord",
    category: "Productivity",
    iconBg: "from-indigo-500 to-indigo-700",
    dailyLimitMinutes: 60,
    weekendLimitMinutes: 90,
    isMonitored: false,
    usedTodayMinutes: 28,
    isRestricted: false,
    lastUsedTimestamp: Date.now() - 1000 * 60 * 30,
  }
];

export const DEFAULT_SETTINGS: TimeGuardSettings = {
  theme: "dark",
  resetHour: 0,
  notificationsEnabled: true,
  earlyWarningThreshold: 75,
  finalWarningThreshold: 90,
  strictMode: false,
  dailyScreenTimeGoalMinutes: 180, // 3 hours screen time goal
  hasCompletedOnboarding: true,
  simulatedMode: true,
};

export const DEFAULT_FOCUS_SESSION: FocusSession = {
  id: "focus-session-default",
  title: "Deep Work Sprint",
  presetMinutes: 25,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  status: "idle",
  blockedAppIds: [
    "com.zhiliaoapp.musically",
    "com.instagram.android",
    "com.facebook.katana",
    "com.mobile.legends",
    "com.reddit.frontpage"
  ]
};

// Seed 6 days of historical usage for realistic reporting
export function generateSeedHistory(): DayUsageRecord[] {
  const records: DayUsageRecord[] = [];
  const now = new Date();

  for (let i = 6; i >= 1; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    // Varied daily usage (around 150m to 210m)
    const variance = (i * 17) % 55 - 25;
    const totalMinutes = Math.max(120, 175 + variance);
    const goalMet = totalMinutes <= 180;
    const score = goalMet ? Math.min(95, 78 + (180 - totalMinutes) * 0.4) : Math.max(50, 75 - (totalMinutes - 180) * 0.5);

    records.push({
      date: dateStr,
      totalMinutes,
      appUsage: {
        "com.zhiliaoapp.musically": Math.round(totalMinutes * 0.22),
        "com.google.android.youtube": Math.round(totalMinutes * 0.28),
        "com.mobile.legends": Math.round(totalMinutes * 0.25),
        "com.instagram.android": Math.round(totalMinutes * 0.15),
        "com.facebook.katana": Math.round(totalMinutes * 0.1),
      },
      wellnessScore: Math.round(score),
      goalMet
    });
  }

  return records;
}

// Storage Manager
export class TimeGuardStorage {
  private static isBrowser(): boolean {
    return typeof window !== "undefined" && typeof localStorage !== "undefined";
  }

  static getTodayDateStr(): string {
    const now = new Date();
    return now.toISOString().split("T")[0];
  }

  // Check and apply midnight reset
  static checkMidnightReset(apps: AppItem[], history: DayUsageRecord[]): { apps: AppItem[]; history: DayUsageRecord[]; didReset: boolean } {
    if (!this.isBrowser()) return { apps, history, didReset: false };

    const today = this.getTodayDateStr();
    const lastReset = localStorage.getItem("timeguard_last_reset") || today;

    if (lastReset !== today) {
      // Midnight has passed!
      // 1. Calculate yesterday's total
      const totalMinutesYesterday = apps.reduce((sum, a) => sum + (a.usedTodayMinutes || 0), 0);
      const appUsageYesterday: Record<string, number> = {};
      apps.forEach((a) => {
        if (a.usedTodayMinutes > 0) {
          appUsageYesterday[a.id] = a.usedTodayMinutes;
        }
      });

      const goalMet = totalMinutesYesterday <= 180;
      const wellnessScore = goalMet ? 88 : 68;

      const newHistoryRecord: DayUsageRecord = {
        date: lastReset,
        totalMinutes: totalMinutesYesterday,
        appUsage: appUsageYesterday,
        wellnessScore,
        goalMet,
      };

      const updatedHistory = [...history, newHistoryRecord].slice(-30); // Keep last 30 days

      // 2. Reset apps for today
      const resetApps = apps.map((app) => ({
        ...app,
        usedTodayMinutes: 0,
        isRestricted: false,
      }));

      // 3. Clear today's notification records
      this.clearOldNotifications();

      // 4. Save to localStorage
      this.saveApps(resetApps);
      this.saveHistory(updatedHistory);
      localStorage.setItem("timeguard_last_reset", today);

      return { apps: resetApps, history: updatedHistory, didReset: true };
    }

    return { apps, history, didReset: false };
  }

  // Load Apps
  static loadApps(): AppItem[] {
    if (!this.isBrowser()) return DEFAULT_APPS;
    try {
      const data = localStorage.getItem("timeguard_apps");
      if (data) {
        return JSON.parse(data);
      }
      this.saveApps(DEFAULT_APPS);
      localStorage.setItem("timeguard_last_reset", this.getTodayDateStr());
      return DEFAULT_APPS;
    } catch {
      return DEFAULT_APPS;
    }
  }

  static saveApps(apps: AppItem[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem("timeguard_apps", JSON.stringify(apps));
    } catch {
      // storage error fallback
    }
  }

  // Load History
  static loadHistory(): DayUsageRecord[] {
    if (!this.isBrowser()) return generateSeedHistory();
    try {
      const data = localStorage.getItem("timeguard_history");
      if (data) {
        return JSON.parse(data);
      }
      const initial = generateSeedHistory();
      this.saveHistory(initial);
      return initial;
    } catch {
      return generateSeedHistory();
    }
  }

  static saveHistory(history: DayUsageRecord[]): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem("timeguard_history", JSON.stringify(history));
    } catch {
      // storage error fallback
    }
  }

  // Settings
  static loadSettings(): TimeGuardSettings {
    if (!this.isBrowser()) return DEFAULT_SETTINGS;
    try {
      const data = localStorage.getItem("timeguard_settings");
      if (data) return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      this.saveSettings(DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  static saveSettings(settings: TimeGuardSettings): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem("timeguard_settings", JSON.stringify(settings));
    } catch {
      // ignore
    }
  }

  // Focus Session
  static loadFocusSession(): FocusSession {
    if (!this.isBrowser()) return DEFAULT_FOCUS_SESSION;
    try {
      const data = localStorage.getItem("timeguard_focus");
      if (data) return JSON.parse(data);
      return DEFAULT_FOCUS_SESSION;
    } catch {
      return DEFAULT_FOCUS_SESSION;
    }
  }

  static saveFocusSession(session: FocusSession): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.setItem("timeguard_focus", JSON.stringify(session));
    } catch {
      // ignore
    }
  }

  // Notifications
  static loadNotifications(): NotificationRecord[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem("timeguard_notifications");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveNotification(notif: NotificationRecord): void {
    if (!this.isBrowser()) return;
    try {
      const all = this.loadNotifications();
      all.unshift(notif);
      localStorage.setItem("timeguard_notifications", JSON.stringify(all.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  static clearOldNotifications(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem("timeguard_notifications");
    } catch {
      // ignore
    }
  }

  // Overrides Log
  static loadOverrides(): OverrideLog[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem("timeguard_overrides");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveOverride(override: OverrideLog): void {
    if (!this.isBrowser()) return;
    try {
      const all = this.loadOverrides();
      all.unshift(override);
      localStorage.setItem("timeguard_overrides", JSON.stringify(all.slice(0, 50)));
    } catch {
      // ignore
    }
  }

  // Reflections
  static loadReflections(): ReflectionEntry[] {
    if (!this.isBrowser()) return [];
    try {
      const data = localStorage.getItem("timeguard_reflections");
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveReflection(entry: ReflectionEntry): void {
    if (!this.isBrowser()) return;
    try {
      const all = this.loadReflections();
      all.unshift(entry);
      localStorage.setItem("timeguard_reflections", JSON.stringify(all.slice(0, 30)));
    } catch {
      // ignore
    }
  }

  // Calculate Streak
  static calculateStreak(history: DayUsageRecord[], goalMinutes: number): number {
    let streak = 0;
    // Iterate from newest to oldest
    for (let i = history.length - 1; i >= 0; i--) {
      if (history[i].totalMinutes <= goalMinutes) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  }

  // Export / Import
  static exportAllData(): string {
    if (!this.isBrowser()) return "{}";
    const payload = {
      apps: this.loadApps(),
      history: this.loadHistory(),
      settings: this.loadSettings(),
      overrides: this.loadOverrides(),
      reflections: this.loadReflections(),
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(payload, null, 2);
  }

  static importAllData(jsonStr: string): boolean {
    if (!this.isBrowser()) return false;
    try {
      const parsed = JSON.parse(jsonStr);
      if (parsed.apps) this.saveApps(parsed.apps);
      if (parsed.history) this.saveHistory(parsed.history);
      if (parsed.settings) this.saveSettings(parsed.settings);
      if (parsed.overrides) localStorage.setItem("timeguard_overrides", JSON.stringify(parsed.overrides));
      if (parsed.reflections) localStorage.setItem("timeguard_reflections", JSON.stringify(parsed.reflections));
      return true;
    } catch {
      return false;
    }
  }

  static clearAllData(): void {
    if (!this.isBrowser()) return;
    try {
      localStorage.removeItem("timeguard_apps");
      localStorage.removeItem("timeguard_history");
      localStorage.removeItem("timeguard_settings");
      localStorage.removeItem("timeguard_focus");
      localStorage.removeItem("timeguard_notifications");
      localStorage.removeItem("timeguard_overrides");
      localStorage.removeItem("timeguard_reflections");
      localStorage.removeItem("timeguard_last_reset");
    } catch {
      // ignore
    }
  }
}
