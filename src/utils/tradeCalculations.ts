import { Trade } from '../types';

// Calculate pip difference based on symbol
const calculatePipDifference = (symbol: string, entryPrice: number, exitPrice: number): number => {
  // For JPY pairs
  if (symbol.includes('JPY')) {
    return Math.abs(exitPrice - entryPrice) * 100;
  }
  
  // For Gold (XAU/USD)
  if (symbol === 'XAUUSD') {
    return Math.abs(exitPrice - entryPrice) * 10;
  }
  
  // For regular forex pairs (non-JPY)
  return Math.abs(exitPrice - entryPrice) * 10000;
};

// Get pip value based on symbol
const getPipValue = (symbol: string): number => {
  // For JPY pairs
  if (symbol.includes('JPY')) {
    return 0.01;
  }
  
  // For Gold (XAU/USD)
  if (symbol === 'XAUUSD') {
    return 0.1;
  }
  
  // For regular forex pairs (non-JPY)
  return 0.0001;
};

// Calculate profit for a single trade
export const calculateProfit = (trade: Omit<Trade, 'profit' | 'profitPercentage' | 'id'>): { profit: number, profitPercentage: number, pipDifference: number, pipValue: number } => {
  const pipValue = getPipValue(trade.symbol);
  const pipDifference = calculatePipDifference(trade.symbol, trade.entryPrice, trade.exitPrice);
  
  let profit: number;
  
  if (trade.direction === 'long') {
    profit = (trade.exitPrice > trade.entryPrice ? pipDifference : -pipDifference) * trade.lotSize * 10;
  } else {
    profit = (trade.exitPrice < trade.entryPrice ? pipDifference : -pipDifference) * trade.lotSize * 10;
  }
  
  // Subtract fees
  profit -= trade.fees;
  
  // Calculate profit percentage based on initial investment
  const initialInvestment = trade.entryPrice * trade.quantity;
  const profitPercentage = (profit / initialInvestment) * 100;
  
  return { 
    profit, 
    profitPercentage,
    pipDifference,
    pipValue
  };
};

// Calculate dashboard statistics
export interface DashboardStats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  averageWin: number;
  averageLoss: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
}

export const calculateDashboardStats = (trades: Trade[]): DashboardStats => {
  if (!Array.isArray(trades) || trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      totalProfit: 0,
      averageProfit: 0,
      averageWin: 0,
      averageLoss: 0,
      largestWin: 0,
      largestLoss: 0,
      profitFactor: 0
    };
  }

  // Filter valid trades and ensure profit is a number
  const validTrades = trades.filter(trade => trade && typeof trade.profit === 'number');
  const winningTrades = validTrades.filter(trade => trade.profit > 0);
  const losingTrades = validTrades.filter(trade => trade.profit <= 0);
  
  const totalProfit = validTrades.reduce((sum, trade) => sum + (trade.profit || 0), 0);
  const totalTrades = validTrades.length;
  const winRate = totalTrades > 0 ? (winningTrades.length / totalTrades) * 100 : 0;
  
  // Calculate largest win and loss with safe checks
  const profits = validTrades.map(t => t.profit || 0);
  const largestWin = profits.length > 0 ? Math.max(...profits.filter(p => p > 0), 0) : 0;
  const largestLoss = profits.length > 0 ? Math.min(...profits.filter(p => p <= 0), 0) : 0;

  // Calculate averages with safe checks
  const totalWinnings = winningTrades.reduce((sum, t) => sum + (t.profit || 0), 0);
  const totalLosses = Math.abs(losingTrades.reduce((sum, t) => sum + (t.profit || 0), 0));
  
  const averageWin = winningTrades.length > 0 ? totalWinnings / winningTrades.length : 0;
  const averageLoss = losingTrades.length > 0 ? totalLosses / losingTrades.length : 0;
  
  // Calculate profit factor with safe division
  const profitFactor = totalLosses > 0 ? totalWinnings / totalLosses : totalWinnings > 0 ? Infinity : 0;

  // Calculate average profit with safe division
  const averageProfit = totalTrades > 0 ? totalProfit / totalTrades : 0;

  return {
    totalTrades,
    winRate,
    totalProfit,
    averageProfit,
    averageWin,
    averageLoss,
    largestWin,
    largestLoss,
    profitFactor
  };
};

// Generate monthly performance data
export const generateMonthlyPerformance = (trades: Trade[]): { labels: string[], data: number[] } => {
  const months: { [key: string]: number } = {};
  
  trades.forEach(trade => {
    const date = new Date(trade.date);
    const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
    
    if (!months[monthYear]) {
      months[monthYear] = 0;
    }
    
    months[monthYear] += trade.profit;
  });
  
  const sortedEntries = Object.entries(months).sort((a, b) => {
    const [monthA, yearA] = a[0].split('/').map(Number);
    const [monthB, yearB] = b[0].split('/').map(Number);
    
    if (yearA !== yearB) return yearA - yearB;
    return monthA - monthB;
  });
  
  return {
    labels: sortedEntries.map(([month]) => month),
    data: sortedEntries.map(([_, profit]) => profit)
  };
};

// Generate symbol performance data
export const generateSymbolPerformance = (trades: Trade[]): { labels: string[], data: number[] } => {
  const symbols: { [key: string]: number } = {};
  
  trades.forEach(trade => {
    if (!symbols[trade.symbol]) {
      symbols[trade.symbol] = 0;
    }
    
    symbols[trade.symbol] += trade.profit;
  });
  
  const sortedEntries = Object.entries(symbols).sort((a, b) => b[1] - a[1]);
  
  return {
    labels: sortedEntries.map(([symbol]) => symbol),
    data: sortedEntries.map(([_, profit]) => profit)
  };
};