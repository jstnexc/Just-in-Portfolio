export type AppCategory = 'Social' | 'Gaming' | 'Entertainment' | 'Productivity' | 'Utilities';

export interface AppItem {
  id: string;
  name: string;
  packageName: string;
  category: AppCategory;
  iconBg: string;
  dailyLimitMinutes: number;
  weekendLimitMinutes?: number;
  isMonitored: boolean;
  usedTodayMinutes: number;
  isRestricted: boolean;
  customScheduleEnabled?: boolean;
  allowedStartHour?: number;
  allowedEndHour?: number;
  lastUsedTimestamp?: number;
}

export interface DayUsageRecord {
  date: string; // YYYY-MM-DD
  totalMinutes: number;
  appUsage: Record<string, number>; // appId -> minutes
  wellnessScore: number;
  goalMet: boolean;
}

export interface FocusSession {
  id: string;
  title: string;
  presetMinutes: number;
  totalSeconds: number;
  remainingSeconds: number;
  status: 'idle' | 'running' | 'paused' | 'completed';
  blockedAppIds: string[];
  startedAt?: number;
  completedAt?: number;
}

export interface NotificationRecord {
  id: string;
  appId: string;
  appName: string;
  threshold: 75 | 90 | 100;
  message: string;
  timestamp: number;
  dateKey: string;
}

export interface OverrideLog {
  id: string;
  appId: string;
  appName: string;
  reason: string;
  timestamp: number;
  date: string;
  minutesGranted: number;
}

export interface ReflectionEntry {
  id: string;
  date: string;
  mood: 'great' | 'balanced' | 'distracted' | 'overwhelmed';
  notes: string;
  offlineActivity: string;
  timestamp: number;
}

export interface TimeGuardSettings {
  theme: 'dark' | 'light' | 'system';
  resetHour: number; // 0 for midnight
  notificationsEnabled: boolean;
  earlyWarningThreshold: number; // 75
  finalWarningThreshold: number; // 90
  strictMode: boolean;
  dailyScreenTimeGoalMinutes: number; // 180 min default (3h)
  hasCompletedOnboarding: boolean;
  simulatedMode: boolean; // clearly labels simulated real-time tracking
}
