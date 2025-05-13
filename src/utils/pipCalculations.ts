interface PipInfo {
  pipSize: number;
  pipValue: number;
}

export const getPipInfo = (symbol: string): PipInfo => {
  // Convert to uppercase and standardize format
  const standardSymbol = symbol.toUpperCase().replace('/', '');
  
  // JPY pairs (e.g., USD/JPY at 145.00)
  // For 1 standard lot (100,000 units):
  // 1 pip (0.01) = ¥1000 ≈ $6.90 at 145.00
  if (standardSymbol.endsWith('JPY') || standardSymbol.startsWith('JPY')) {
    return {
      pipSize: 0.01,
      pipValue: 1000
    };
  }
  
  // Gold (XAU/USD at 2000.00)
  // For 1 standard lot (100 oz):
  // 1 pip (0.10) = $10.00
  if (standardSymbol === 'XAUUSD') {
    return {
      pipSize: 0.1,
      pipValue: 10
    };
  }
  
  // Default forex pairs (e.g., EUR/USD at 1.1000)
  // For 1 standard lot (100,000 units):
  // 1 pip (0.0001) = $10.00
  return {
    pipSize: 0.0001,
    pipValue: 10
  };
};

export interface ProfitCalculationResult {
  pipDifference: number;
  pipValue: number;
  profit: number;
  profitPercentage: number;
}

export const calculatePipsAndProfit = (params: {
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  lotSize: number;
  fees: number;
}): ProfitCalculationResult => {
  const { symbol, direction, entryPrice, exitPrice, lotSize, fees } = params;
  const { pipSize, pipValue } = getPipInfo(symbol);
  
  // Calculate price difference
  const priceDifference = direction === 'long'
    ? exitPrice - entryPrice  // For longs: exit - entry
    : entryPrice - exitPrice; // For shorts: entry - exit
  
  // Calculate pip difference
  const pipDifference = priceDifference / pipSize;
  
  // Calculate profit
  // Standard lot size is 100,000 for forex, 100 oz for gold
  // lotSize of 1.0 = 1 standard lot
  // pipValue is the dollar value per pip for 1 standard lot
  const profit = (pipDifference * pipValue * lotSize) - fees;
  
  // Calculate profit percentage based on margin used
  // Using standard 1:100 leverage for estimate
  const marginUsed = entryPrice * lotSize * 1000; // Approximate margin required
  const profitPercentage = (profit / marginUsed) * 100;
  
  return {
    pipDifference: Math.abs(pipDifference), // Always positive for display
    pipValue: pipValue * lotSize, // Pip value for the trade size
    profit,
    profitPercentage
  };
};
