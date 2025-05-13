import { Trade } from '../types';
import { calculateDashboardStats } from './tradeCalculations';
import { calculateRRRStats } from './rrrCalculations';
import { calculateViolationStats } from './violationRules';

export const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
};

export const generateTradeReport = (trades: Trade[]) => {
  const stats = calculateDashboardStats(trades);
  const rrrStats = calculateRRRStats(trades);
  const violationStats = calculateViolationStats(trades);

  // Sort trades by date (newest first)
  const sortedTrades = [...trades].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  let reportContent = `
    Trading Journal Report
    Generated on ${formatDate(new Date())}
    
    Performance Summary
    ------------------
    Total Trades: ${stats.totalTrades}
    Win Rate: ${(stats.winRate * 100).toFixed(1)}%
    Total Profit: ${formatCurrency(stats.totalProfit)}
    Average Trade: ${formatCurrency(stats.averageProfit)}
    Largest Win: ${formatCurrency(stats.largestWin)}
    Largest Loss: ${formatCurrency(stats.largestLoss)}
    
    Risk Management
    --------------
    Average Planned RRR: ${rrrStats.averagePlannedRRR?.toFixed(2) || 'N/A'}
    Average Achieved RRR: ${rrrStats.averageAchievedRRR?.toFixed(2) || 'N/A'}
    Trades Without Stop Loss: ${rrrStats.tradesWithoutStopLoss}
    
    Rule Violations
    --------------
    Most Common Violation: ${violationStats.mostBrokenRule || 'None'}
    Win Rate with Violations: ${(violationStats.winRateWithViolations * 100).toFixed(1)}%
    Win Rate without Violations: ${(violationStats.winRateWithoutViolations * 100).toFixed(1)}%
    
    Recent Trades
    ------------
    ${sortedTrades.map(trade => `
    Date: ${formatDate(trade.date)}
    Symbol: ${trade.symbol}
    Direction: ${trade.direction.toUpperCase()}
    Entry: ${formatCurrency(trade.entryPrice)}
    Exit: ${formatCurrency(trade.exitPrice)}
    Profit: ${formatCurrency(trade.profit)}
    Strategy: ${trade.strategy}
    Setup: ${trade.setup}
    Notes: ${trade.notes}
    Violations: ${trade.violations?.join(', ') || 'None'}
    ${trade.emotions ? `Emotions: ${trade.emotions}` : ''}
    ${trade.rating ? `Rating: ${trade.rating}/5` : ''}
    -------------------
    `).join('\n')}
  `;

  return reportContent;
};

export const downloadTradeReport = (trades: Trade[]) => {
  const content = generateTradeReport(trades);
  const blob = new Blob([content], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  const date = new Date().toISOString().split('T')[0];
  
  link.href = url;
  link.download = `trading-journal-${date}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
