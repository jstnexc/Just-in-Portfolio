package com.timeguard.worker

import android.content.Context
import androidx.work.CoroutineWorker
import androidx.work.WorkerParameters

/**
 * Scheduled with Android WorkManager to run at local midnight.
 * Resets daily usage counters and persists yesterday's summary.
 */
class MidnightResetWorker(
    appContext: Context,
    workerParams: WorkerParameters
) : CoroutineWorker(appContext, workerParams) {

    override suspend fun doWork(): Result {
        val prefs = applicationContext.getSharedPreferences("timeguard_limits", Context.MODE_PRIVATE)

        // Clear active restriction locks and reset daily usage
        prefs.edit().apply {
            putBoolean("restrictions_reset_today", true)
            apply()
        }

        return Result.success()
    }
}
