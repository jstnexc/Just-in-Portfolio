package com.timeguard.service

import android.accessibilityservice.AccessibilityService
import android.content.Intent
import android.view.accessibility.AccessibilityEvent

/**
 * Listens for package foreground transitions and activates the TimeGuard restriction
 * screen when an application's configured daily time limit has expired.
 */
class AppRestrictionAccessibilityService : AccessibilityService() {

    override fun onAccessibilityEvent(event: AccessibilityEvent?) {
        if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
            return
        }

        val packageName = event.packageName?.toString() ?: return

        // Ignore essential system, launcher, and phone emergency packages
        if (isSystemEssentialPackage(packageName)) {
            return
        }

        // Check if package's daily limit has expired or is blocked under active focus session
        if (checkIfPackageRestricted(packageName)) {
            launchBlockingOverlay(packageName)
        }
    }

    override fun onInterrupt() {
        // Accessibility service interrupted
    }

    private fun isSystemEssentialPackage(pkg: String): Boolean {
        return pkg.startsWith("com.android.systemui") ||
               pkg.startsWith("com.google.android.dialer") ||
               pkg.startsWith("com.android.emergency") ||
               pkg == applicationContext.packageName
    }

    private fun checkIfPackageRestricted(pkg: String): Boolean {
        // Query local Room database or DataStore limits against current usage
        val usageMap = UsageStatsService.getTodayUsageMinutes(applicationContext)
        val minutesUsed = usageMap[pkg] ?: 0L

        val prefs = applicationContext.getSharedPreferences("timeguard_limits", MODE_PRIVATE)
        val limitMinutes = prefs.getLong("limit_$pkg", -1L)

        if (limitMinutes in 0..minutesUsed) {
            return true
        }

        val isFocusActive = prefs.getBoolean("focus_active", false)
        val isBlockedInFocus = prefs.getStringSet("focus_blocked_apps", emptySet())?.contains(pkg) ?: false

        return isFocusActive && isBlockedInFocus
    }

    private fun launchBlockingOverlay(pkg: String) {
        val intent = Intent("com.timeguard.ACTION_BLOCK_SCREEN").apply {
            flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            putExtra("RESTRICTED_PACKAGE", pkg)
        }
        startActivity(intent)
    }
}
