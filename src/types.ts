export interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  profit: number;
  profitPercentage?: number;
  lotSize: number;
  quantity: number;
  fees: number;
  strategy?: string;
  tags?: string[];
  stopLoss?: number;
  takeProfit?: number;
  violations?: Array<{
    id: string;
    label: string;
    isCustom?: boolean;
  }>;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ProfitRange {
  min: number | null;
  max: number | null;
}

export interface FilterOptions {
  dateRange: DateRange | null;
  symbols: string[];
  direction: 'long' | 'short' | null;
  strategies: string[];
  tags: string[];
  profitRange: ProfitRange;
}
