# TimeGuard Android Companion Architecture & Implementation

## Overview
TimeGuard combines a responsive digital wellness web dashboard with a native Android background companion service. 
Because web browsers cannot monitor other installed Android apps or force other applications to close due to operating system sandboxing, the native Android companion is responsible for OS-level usage tracking and restriction enforcement.

---

## Android Security Model & Permissions

### 1. Usage Tracking (`PACKAGE_USAGE_STATS`)
- **Purpose:** Allows TimeGuard to query `UsageStatsManager` for foreground and background transitions and daily accumulated minutes per package.
- **Grant Method:** Requires explicit user authorization in Android System Settings:
  ```bash
  # Fast ADB authorization command for testing:
  adb shell appops set com.timeguard.app android:get_usage_stats allow
  ```
  Or navigate to: **Settings → Apps & Notifications → Special App Access → Usage Access → TimeGuard → Allow**.

### 2. Application Restriction & Lockout
To restrict an application whose time limit has expired:
- **`AccessibilityService` (`BIND_ACCESSIBILITY_SERVICE`):** Listens to `AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED`. When an application's package is detected in the foreground and its limit has expired, the service immediately presents the TimeGuard restriction overlay.
  ```bash
  adb shell settings put secure enabled_accessibility_services com.timeguard.app/com.timeguard.service.AppRestrictionAccessibilityService
  ```
- **`SYSTEM_ALERT_WINDOW` ("Display over other apps"):** Allows the blocking shield to draw over third-party applications when limits are exceeded.

---

## Project Structure
```
android-companion/
├── README.md
├── app/
│   └── src/
│       └── main/
│           ├── AndroidManifest.xml
│           └── java/com/timeguard/
│               ├── service/
│               │   ├── UsageStatsService.kt
│               │   └── AppRestrictionAccessibilityService.kt
│               └── worker/
│                   └── MidnightResetWorker.kt
```
