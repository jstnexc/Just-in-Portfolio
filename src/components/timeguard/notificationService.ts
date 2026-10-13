import { NotificationRecord } from "./types";
import { TimeGuardStorage } from "./storage";

export interface ToastAlert {
  id: string;
  title: string;
  message: string;
  type: "warning" | "danger" | "info" | "success";
  timestamp: number;
}

export class NotificationService {
  private static toastListeners: ((toast: ToastAlert) => void)[] = [];

  static subscribeToToasts(callback: (toast: ToastAlert) => void): () => void {
    this.toastListeners.push(callback);
    return () => {
      this.toastListeners = this.toastListeners.filter((cb) => cb !== callback);
    };
  }

  static emitToast(toast: ToastAlert) {
    this.toastListeners.forEach((cb) => cb(toast));
  }

  static async requestPermission(): Promise<boolean> {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }
    try {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    } catch {
      return false;
    }
  }

  static isPermissionGranted(): boolean {
    if (typeof window === "undefined" || !("Notification" in window)) {
      return false;
    }
    return Notification.permission === "granted";
  }

  // Check and dispatch threshold notification with strict deduplication
  static checkAndNotifyThreshold(
    appId: string,
    appName: string,
    usedMinutes: number,
    limitMinutes: number,
    earlyThreshold = 75,
    finalThreshold = 90
  ): NotificationRecord | null {
    if (limitMinutes <= 0) return null;

    const percent = Math.floor((usedMinutes / limitMinutes) * 100);
    let reachedThreshold: 75 | 90 | 100 | null = null;
    let message = "";
    let toastType: "warning" | "danger" = "warning";

    if (percent >= 100) {
      reachedThreshold = 100;
      message = `Your daily limit of ${limitMinutes}m for ${appName} has been reached. Time to take a break!`;
      toastType = "danger";
    } else if (percent >= finalThreshold) {
      reachedThreshold = 90;
      message = `Final Warning: You have used ${percent}% of your ${appName} allowance. Only ${Math.max(1, limitMinutes - usedMinutes)}m remaining.`;
      toastType = "warning";
    } else if (percent >= earlyThreshold) {
      reachedThreshold = 75;
      message = `Early Warning: You have reached ${percent}% of your daily time limit for ${appName}.`;
      toastType = "warning";
    }

    if (!reachedThreshold) return null;

    // Check deduplication
    const dateKey = TimeGuardStorage.getTodayDateStr();
    const existing = TimeGuardStorage.loadNotifications();
    const isAlreadySent = existing.some(
      (n) => n.appId === appId && n.threshold === reachedThreshold && n.dateKey === dateKey
    );

    if (isAlreadySent) {
      return null;
    }

    // Record notification
    const record: NotificationRecord = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      appId,
      appName,
      threshold: reachedThreshold,
      message,
      timestamp: Date.now(),
      dateKey,
    };

    TimeGuardStorage.saveNotification(record);

    // 1. Emit In-App Toast
    this.emitToast({
      id: record.id,
      title: `TimeGuard: ${appName} Limit Alert`,
      message,
      type: toastType,
      timestamp: Date.now(),
    });

    // 2. Web Notification API (if allowed)
    if (typeof window !== "undefined" && "Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(`TimeGuard · ${appName}`, {
          body: message,
          icon: "/favicon.ico",
          tag: `${appId}-${reachedThreshold}`,
        });
      } catch {
        // Fallback handled by in-app toast
      }
    }

    return record;
  }
}
