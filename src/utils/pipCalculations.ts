interface PipInfo {
  pipSize: number;
  pipValuePerStandardLot: number | null; // If null, calculate dynamically
  isJPY: boolean;
  isGold: boolean;
}

export const getPipInfo = (symbol: string): PipInfo => {
  const standardSymbol = symbol.toUpperCase().replace('/', '');

  if (standardSymbol.endsWith('JPY') || standardSymbol.startsWith('JPY')) {
    return {
      pipSize: 0.01,
      pipValuePerStandardLot: null, // calculate based on entry price
      isJPY: true,
      isGold: false,
    };
  }

  if (standardSymbol === 'XAUUSD') {
    return {
      pipSize: 0.1,
      pipValuePerStandardLot: 10,
      isJPY: false,
      isGold: true,
    };
  }

  return {
    pipSize: 0.0001,
    pipValuePerStandardLot: 10,
    isJPY: false,
    isGold: false,
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
  const { pipSize, pipValuePerStandardLot, isJPY } = getPipInfo(symbol);

  const priceDifference =
    direction === 'long' ? exitPrice - entryPrice : entryPrice - exitPrice;

  const pipDifference = priceDifference / pipSize;

  let pipValue: number;

  if (pipValuePerStandardLot !== null) {
    pipValue = pipValuePerStandardLot * lotSize;
  } else {
    // For JPY pairs, calculate pip value dynamically
    // pip value = (pip size / price) * 100000 * lot size
    pipValue = ((pipSize / entryPrice) * 100000) * lotSize;
  }

  const profit = pipDifference * pipValue - fees;

  const marginUsed = entryPrice * lotSize * 1000;
  const profitPercentage = (profit / marginUsed) * 100;

  return {
    pipDifference: Math.abs(pipDifference),
    pipValue,
    profit,
    profitPercentage,
  };
};
