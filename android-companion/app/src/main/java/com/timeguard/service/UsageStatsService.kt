package com.timeguard.service

import android.app.Service
import android.app.usage.UsageEvents
import android.app.usage.UsageStatsManager
import android.content.Context
import android.content.Intent
import android.os.IBinder
import java.util.Calendar

/**
 * Service that calculates accurate foreground durations using Android UsageEvents.
 * Avoids counting overlapping usage intervals twice.
 */
class UsageStatsService : Service() {

    override fun onBind(intent: Intent?): IBinder? = null

    companion object {
        /**
         * Calculates foreground screen time in minutes for each package from local midnight to now.
         */
        fun getTodayUsageMinutes(context: Context): Map<String, Long> {
            val usageStatsManager = context.getSystemService(Context.USAGE_STATS_SERVICE) as? UsageStatsManager
                ?: return emptyMap()

            val calendar = Calendar.getInstance().apply {
                set(Calendar.HOUR_OF_DAY, 0)
                set(Calendar.MINUTE, 0)
                set(Calendar.SECOND, 0)
                set(Calendar.MILLISECOND, 0)
            }
            val startOfDay = calendar.timeInMillis
            val endOfDay = System.currentTimeMillis()

            val usageEvents = usageStatsManager.queryEvents(startOfDay, endOfDay)
            val event = UsageEvents.Event()

            val appStartTimes = mutableMapOf<String, Long>()
            val appTotalDurations = mutableMapOf<String, Long>()

            while (usageEvents.hasNextEvent()) {
                usageEvents.getNextEvent(event)
                val pkg = event.packageName ?: continue

                when (event.eventType) {
                    UsageEvents.Event.ACTIVITY_RESUMED -> {
                        appStartTimes[pkg] = event.timeStamp
                    }
                    UsageEvents.Event.ACTIVITY_PAUSED, UsageEvents.Event.ACTIVITY_STOPPED -> {
                        val startTime = appStartTimes.remove(pkg)
                        if (startTime != null && event.timeStamp > startTime) {
                            val duration = event.timeStamp - startTime
                            appTotalDurations[pkg] = (appTotalDurations[pkg] ?: 0L) + duration
                        }
                    }
                }
            }

            // Convert milliseconds to minutes
            return appTotalDurations.mapValues { (_, durationMs) ->
                durationMs / (1000 * 60)
            }
        }
    }
}
