import { ViolationRule } from '../utils/violationRules';

export interface BaseTrade {
  date: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  profit: number;
  profitPercentage: number;
  lotSize: number;
  quantity: number;
  fees: number;
  strategy: string;
  setup: string;
  notes: string;
  tags: string[];
  screenshots: string[];
  stopLoss: number;
  takeProfit: number;
  timeFrame: string;
  emotions: string;
  rating: number;
  violations: ViolationRule[];
}

export interface Trade extends BaseTrade {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export type TradeDirection = 'long' | 'short';

export interface DashboardStats {
  totalTrades: number;
  winRate: number;
  totalProfit: number;
  averageProfit: number;
  largestWin: number;
  largestLoss: number;
  profitFactor: number;
  averageWin: number;
  averageLoss: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface FilterOptions {
  dateRange: DateRange | null;
  symbols: string[];
  direction: TradeDirection | null;
  strategies: string[];
  tags: string[];
  profitRange: {
    min: number | null;
    max: number | null;
  };
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string;
    borderColor?: string;
    borderWidth?: number;
  }[];
}