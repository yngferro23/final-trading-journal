interface StreakInfo {
  currentStreak: number;
  longestWinStreak: number;
  longestLossStreak: number;
  isOnTilt: boolean;
  tiltThreshold: number;
}

export const calculateStreaks = (trades: any[]): StreakInfo => {
  if (!trades || trades.length === 0) {
    return {
      currentStreak: 0,
      longestWinStreak: 0,
      longestLossStreak: 0,
      isOnTilt: false,
      tiltThreshold: 3
    };
  }

  // Sort trades by date in descending order (newest first)
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let currentStreak = 0;
  let longestWinStreak = 0;
  let longestLossStreak = 0;
  let currentStreakType: 'win' | 'loss' | null = null;
  const tiltThreshold = 3; // Consider on tilt after 3 consecutive losses

  // Calculate current streak and longest streaks
  for (let i = 0; i < sortedTrades.length; i++) {
    const trade = sortedTrades[i];
    const isWin = trade.profit > 0;

    if (i === 0) {
      // First trade sets the initial streak
      currentStreak = 1;
      currentStreakType = isWin ? 'win' : 'loss';
    } else {
      const prevIsWin = sortedTrades[i - 1].profit > 0;
      
      if (isWin === prevIsWin) {
        // Continuing the streak
        currentStreak++;
      } else {
        // Streak broken, start new streak
        if (currentStreakType === 'win') {
          longestWinStreak = Math.max(longestWinStreak, currentStreak);
        } else {
          longestLossStreak = Math.max(longestLossStreak, currentStreak);
        }
        currentStreak = 1;
      }
      currentStreakType = isWin ? 'win' : 'loss';
    }
  }

  // Update longest streaks with the final streak
  if (currentStreakType === 'win') {
    longestWinStreak = Math.max(longestWinStreak, currentStreak);
  } else {
    longestLossStreak = Math.max(longestLossStreak, currentStreak);
  }

  // Determine if on tilt (current losing streak >= tiltThreshold)
  const isOnTilt = currentStreakType === 'loss' && currentStreak >= tiltThreshold;

  return {
    currentStreak: currentStreak * (currentStreakType === 'win' ? 1 : -1), // Negative for loss streaks
    longestWinStreak,
    longestLossStreak,
    isOnTilt,
    tiltThreshold
  };
};
