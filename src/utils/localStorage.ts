import { Trade } from '../types';

// Local storage keys
const TRADES_KEY = 'trader_journal_trades';
const THEME_KEY = 'trader_journal_theme';

// Save trades to local storage
export const saveTrades = (trades: Trade[]): void => {
  localStorage.setItem(TRADES_KEY, JSON.stringify(trades));
};

// Load trades from local storage
export const loadTrades = (): Trade[] => {
  const storedTrades = localStorage.getItem(TRADES_KEY);
  return storedTrades ? JSON.parse(storedTrades) : [];
};

// Save theme preference
export const saveTheme = (isDark: boolean): void => {
  localStorage.setItem(THEME_KEY, JSON.stringify(isDark));
};

// Load theme preference
export const loadTheme = (): boolean => {
  const storedTheme = localStorage.getItem(THEME_KEY);
  return storedTheme ? JSON.parse(storedTheme) : false;
};

// Add a single trade
export const addTrade = (trade: Trade): void => {
  const trades = loadTrades();
  trades.push(trade);
  saveTrades(trades);
};

// Update a trade
export const updateTrade = (updatedTrade: Trade): void => {
  const trades = loadTrades();
  const index = trades.findIndex((trade) => trade.id === updatedTrade.id);
  if (index !== -1) {
    trades[index] = updatedTrade;
    saveTrades(trades);
  }
};

// Delete a trade
export const deleteTrade = (id: string): void => {
  const trades = loadTrades();
  const filteredTrades = trades.filter((trade) => trade.id !== id);
  saveTrades(filteredTrades);
};