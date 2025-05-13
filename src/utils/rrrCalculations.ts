import { Trade } from '../types';

export interface RRRStats {
  averagePlannedRRR: number | null;
  averageAchievedRRR: number | null;
  tradesWithoutStopLoss: number;
}

export const calculateRRR = (trade: Trade): { 
  plannedRRR: number | null;
  achievedRRR: number | null;
} => {
  // If no stop loss, return null for both
  if (!trade.stopLoss) {
    return {
      plannedRRR: null,
      achievedRRR: null
    };
  }

  const isLong = trade.direction === 'long';
  
  // Calculate achieved RRR using actual exit price
  const achievedRisk = isLong 
    ? trade.entryPrice - trade.stopLoss 
    : trade.stopLoss - trade.entryPrice;
  
  const achievedReward = isLong
    ? trade.exitPrice - trade.entryPrice
    : trade.entryPrice - trade.exitPrice;

  const achievedRRR = achievedRisk !== 0 ? Math.abs(achievedReward / achievedRisk) : null;

  // Calculate planned RRR if take profit was set
  let plannedRRR = null;
  if (trade.takeProfit) {
    const plannedReward = isLong
      ? trade.takeProfit - trade.entryPrice
      : trade.entryPrice - trade.takeProfit;
    
    plannedRRR = achievedRisk !== 0 ? Math.abs(plannedReward / achievedRisk) : null;
  }

  return {
    plannedRRR,
    achievedRRR
  };
};

export const calculateRRRStats = (trades: Trade[]): RRRStats => {
  if (!trades || trades.length === 0) {
    return {
      averagePlannedRRR: null,
      averageAchievedRRR: null,
      tradesWithoutStopLoss: 0
    };
  }

  let totalPlannedRRR = 0;
  let tradesWithPlannedRRR = 0;
  let totalAchievedRRR = 0;
  let tradesWithAchievedRRR = 0;
  let tradesWithoutStopLoss = 0;

  trades.forEach(trade => {
    const { plannedRRR, achievedRRR } = calculateRRR(trade);

    if (!trade.stopLoss) {
      tradesWithoutStopLoss++;
    } else {
      if (plannedRRR !== null) {
        totalPlannedRRR += plannedRRR;
        tradesWithPlannedRRR++;
      }
      if (achievedRRR !== null) {
        totalAchievedRRR += achievedRRR;
        tradesWithAchievedRRR++;
      }
    }
  });

  return {
    averagePlannedRRR: tradesWithPlannedRRR > 0 ? totalPlannedRRR / tradesWithPlannedRRR : null,
    averageAchievedRRR: tradesWithAchievedRRR > 0 ? totalAchievedRRR / tradesWithAchievedRRR : null,
    tradesWithoutStopLoss
  };
};
