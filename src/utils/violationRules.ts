export interface ViolationRule {
  id: string;
  label: string;
  isCustom?: boolean;
}

// Default violation rules
export const defaultViolationRules: ViolationRule[] = [
  { id: 'entered-early', label: 'Entered Early' },
  { id: 'no-stop-loss', label: 'No Stop Loss' },
  { id: 'overtraded', label: 'Overtraded' },
  { id: 'exited-emotionally', label: 'Exited Emotionally' },
  { id: 'chased-price', label: 'Chased Price' },
  { id: 'traded-during-news', label: 'Traded During News' }
];

export interface ViolationStats {
  totalViolations: number;
  mostBrokenRule: {
    rule: string;
    count: number;
  };
  winRateWithViolations: number;
  winRateWithoutViolations: number;
  violationFrequency: {
    ruleId: string;
    label: string;
    count: number;
  }[];
}

export const calculateViolationStats = (trades: any[]): ViolationStats => {
  if (!trades || trades.length === 0) {
    return {
      totalViolations: 0,
      mostBrokenRule: { rule: '', count: 0 },
      winRateWithViolations: 0,
      winRateWithoutViolations: 0,
      violationFrequency: []
    };
  }

  // Count violations
  const violationCounts: { [key: string]: { count: number; label: string } } = {};
  let totalViolations = 0;

  // Track wins/losses for trades with/without violations
  let winsWithViolations = 0;
  let tradesWithViolations = 0;
  let winsWithoutViolations = 0;
  let tradesWithoutViolations = 0;

  trades.forEach(trade => {
    const hasViolations = trade.violations && trade.violations.length > 0;
    const isWin = trade.profit > 0;

    if (hasViolations) {
      tradesWithViolations++;
      if (isWin) winsWithViolations++;
      
      trade.violations.forEach((violation: ViolationRule) => {
        if (!violationCounts[violation.id]) {
          violationCounts[violation.id] = { count: 0, label: violation.label };
        }
        violationCounts[violation.id].count++;
        totalViolations++;
      });
    } else {
      tradesWithoutViolations++;
      if (isWin) winsWithoutViolations++;
    }
  });

  // Find most broken rule
  let mostBrokenRule = { rule: '', count: 0 };
  Object.entries(violationCounts).forEach(([id, data]) => {
    if (data.count > mostBrokenRule.count) {
      mostBrokenRule = { rule: data.label, count: data.count };
    }
  });

  // Calculate win rates
  const winRateWithViolations = tradesWithViolations > 0 
    ? (winsWithViolations / tradesWithViolations) * 100 
    : 0;
  
  const winRateWithoutViolations = tradesWithoutViolations > 0 
    ? (winsWithoutViolations / tradesWithoutViolations) * 100 
    : 0;

  // Create violation frequency array
  const violationFrequency = Object.entries(violationCounts).map(([ruleId, data]) => ({
    ruleId,
    label: data.label,
    count: data.count
  })).sort((a, b) => b.count - a.count);

  return {
    totalViolations,
    mostBrokenRule,
    winRateWithViolations,
    winRateWithoutViolations,
    violationFrequency
  };
};
