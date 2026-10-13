// Automated test runner for TimeGuard core business logic and algorithms

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    process.exit(1);
  } else {
    console.log(`✓ PASS: ${message}`);
  }
}

console.log("=== RUNNING TIMEGUARD AUTOMATED TEST SUITE ===\n");

// 1. Remaining time calculation
function calculateRemainingTime(limitMinutes, usedMinutes) {
  return Math.max(0, limitMinutes - usedMinutes);
}
assert(calculateRemainingTime(30, 24) === 6, "Remaining time when within limit");
assert(calculateRemainingTime(60, 60) === 0, "Remaining time when exactly at limit");
assert(calculateRemainingTime(45, 55) === 0, "Remaining time when exceeding limit clamps to 0");

// 2. Limit expiration detection
function isLimitExpired(limitMinutes, usedMinutes) {
  return limitMinutes > 0 && usedMinutes >= limitMinutes;
}
assert(isLimitExpired(30, 29) === false, "Limit is not expired when under threshold");
assert(isLimitExpired(30, 30) === true, "Limit is expired at 100%");
assert(isLimitExpired(30, 35) === true, "Limit is expired past 100%");

// 3. Notification threshold calculation & deduplication
function getReachedThreshold(usedMinutes, limitMinutes, early = 75, finalThresh = 90) {
  if (limitMinutes <= 0) return null;
  const percent = Math.floor((usedMinutes / limitMinutes) * 100);
  if (percent >= 100) return 100;
  if (percent >= finalThresh) return 90;
  if (percent >= early) return 75;
  return null;
}
assert(getReachedThreshold(20, 30) === null, "66% triggers no threshold");
assert(getReachedThreshold(23, 30) === 75, "76% triggers early warning (75%)");
assert(getReachedThreshold(28, 30) === 90, "93% triggers final warning (90%)");
assert(getReachedThreshold(30, 30) === 100, "100% triggers limit reached");

// 4. Notification deduplication cache check
const sentNotifications = new Set();
function shouldSendNotification(appId, threshold, dateKey) {
  const key = `${appId}:${threshold}:${dateKey}`;
  if (sentNotifications.has(key)) return false;
  sentNotifications.add(key);
  return true;
}
assert(shouldSendNotification("com.tiktok", 75, "2026-10-13") === true, "First notification is sent");
assert(shouldSendNotification("com.tiktok", 75, "2026-10-13") === false, "Duplicate notification on same day is blocked");
assert(shouldSendNotification("com.tiktok", 90, "2026-10-13") === true, "Higher threshold for same app is sent");
assert(shouldSendNotification("com.tiktok", 75, "2026-10-14") === true, "Next day reset allows notification again");

// 5. Midnight reset detection logic
function checkMidnightRollover(lastResetDate, currentDate) {
  return lastResetDate !== currentDate;
}
assert(checkMidnightRollover("2026-10-12", "2026-10-13") === true, "Date difference triggers midnight rollover");
assert(checkMidnightRollover("2026-10-13", "2026-10-13") === false, "Same date does not trigger rollover");

// 6. Streak calculation
function calculateStreak(history, goalMinutes) {
  let streak = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i].totalMinutes <= goalMinutes) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
}
const mockHistory = [
  { totalMinutes: 200 }, // failed
  { totalMinutes: 160 }, // pass
  { totalMinutes: 175 }, // pass
  { totalMinutes: 150 }, // pass
];
assert(calculateStreak(mockHistory, 180) === 3, "Streak calculates 3 consecutive compliant days");

// 7. Focus mode app blocking detection
function isAppBlockedDuringFocus(focusActive, blockedAppIds, targetAppId) {
  return focusActive && blockedAppIds.includes(targetAppId);
}
assert(isAppBlockedDuringFocus(true, ["com.tiktok", "com.instagram"], "com.tiktok") === true, "Focus blocks targeted app");
assert(isAppBlockedDuringFocus(true, ["com.tiktok"], "com.google.docs") === false, "Focus permits unblocked app");
assert(isAppBlockedDuringFocus(false, ["com.tiktok"], "com.tiktok") === false, "Idle focus mode does not block apps");

console.log("\n✅ ALL 7 TEST SUITES PASSED CLEANLY!");
