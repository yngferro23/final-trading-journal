import React, { createContext, useContext, useState, useEffect } from 'react';
import { Trade, FilterOptions, BaseTrade } from '../types';
import { firebaseService } from '../services/firebaseService';
import { useAuth } from './AuthContext';

interface TradeContextType {
  trades: Trade[];
  filteredTrades: Trade[];
  filterOptions: FilterOptions;
  addTrade: (trade: Omit<Trade, 'id'>) => Promise<void>;
  updateTrade: (trade: Trade) => Promise<void>;
  deleteTrade: (id: string) => Promise<void>;
  updateFilters: (options: FilterOptions) => void;
  clearFilters: () => void;
}

const defaultFilterOptions: FilterOptions = {
  dateRange: null,
  symbols: [],
  direction: null,
  strategies: [],
  tags: [],
  profitRange: {
    min: null,
    max: null
  }
};

const TradeContext = createContext<TradeContextType | undefined>(undefined);

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [filteredTrades, setFilteredTrades] = useState<Trade[]>([]);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);


  const { user } = useAuth();

  // Load trades from Firebase when user changes
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const loadTrades = async () => {
      if (user) {
        try {
          // Clear existing trades first
          setTrades([]);
          setFilteredTrades([]);
          
          // Load new trades
          const loadedTrades = await firebaseService.getTrades(user.uid);
          console.log('Loaded trades:', loadedTrades);
          setTrades(loadedTrades);
          setFilteredTrades(loadedTrades);
        } catch (error) {
          console.error('Error loading trades:', error);
        }
      } else {
        // Clear trades when user logs out
        setTrades([]);
        setFilteredTrades([]);
      }
    };

    // Load trades immediately
    loadTrades();

    // Clean up function
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [user?.uid]); // Use user.uid instead of user to prevent unnecessary reloads

  // Apply filters whenever trades or filterOptions change
  useEffect(() => {
    let result = [...trades];

    // Apply date range filter
    if (filterOptions.dateRange) {
      const { startDate, endDate } = filterOptions.dateRange;
      result = result.filter(trade => {
        const tradeDate = new Date(trade.date);
        return (
          tradeDate >= new Date(startDate) && 
          tradeDate <= new Date(endDate)
        );
      });
    }

    // Apply symbol filter
    if (filterOptions.symbols.length > 0) {
      result = result.filter(trade => 
        filterOptions.symbols.includes(trade.symbol)
      );
    }

    // Apply direction filter
    if (filterOptions.direction) {
      result = result.filter(trade => 
        trade.direction === filterOptions.direction
      );
    }

    // Apply strategy filter
    if (filterOptions.strategies.length > 0) {
      result = result.filter(trade => 
        filterOptions.strategies.includes(trade.strategy)
      );
    }

    // Apply tags filter
    if (filterOptions.tags.length > 0) {
      result = result.filter(trade => 
        trade.tags?.some(tag => filterOptions.tags.includes(tag)) ?? false
      );
    }

    // Apply profit range filter
    if (filterOptions.profitRange.min !== null) {
      result = result.filter(trade => 
        trade.profit >= (filterOptions.profitRange.min || 0)
      );
    }

    if (filterOptions.profitRange.max !== null) {
      result = result.filter(trade => 
        trade.profit <= (filterOptions.profitRange.max || Infinity)
      );
    }

    setFilteredTrades(result);
  }, [trades, filterOptions]);

  const addTrade = async (tradeData: Partial<BaseTrade>) => {
    if (!user?.uid) return;
    try {
      // Ensure all required fields are present
      const completeTradeData: BaseTrade = {
        date: tradeData.date || new Date().toISOString(),
        symbol: tradeData.symbol || '',
        direction: tradeData.direction || 'long',
        entryPrice: tradeData.entryPrice || 0,
        exitPrice: tradeData.exitPrice || 0,
        profit: tradeData.profit || 0,
        profitPercentage: tradeData.profitPercentage || 0,
        lotSize: tradeData.lotSize || 0,
        quantity: tradeData.quantity || 0,
        fees: tradeData.fees || 0,
        strategy: tradeData.strategy || '',
        setup: tradeData.setup || '',
        notes: tradeData.notes || '',
        tags: tradeData.tags || [],
        screenshots: tradeData.screenshots || [],
        stopLoss: tradeData.stopLoss || 0,
        takeProfit: tradeData.takeProfit || 0,
        timeFrame: tradeData.timeFrame || '',
        emotions: tradeData.emotions || '',
        rating: tradeData.rating || 0,
        violations: tradeData.violations || []
      };

      const tradeWithMetadata = {
        ...completeTradeData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const tradeId = await firebaseService.addTrade(user.uid, tradeWithMetadata);
      const newTrade: Trade = { ...tradeWithMetadata, id: tradeId };
      const newTrades = [...trades, newTrade];
      setTrades(newTrades);
      setFilteredTrades(newTrades);
    } catch (error) {
      console.error('Error adding trade:', error);
      throw error; // Re-throw the error so the AddTrade component can handle it
    }
  };

  const updateTrade = async (updatedTrade: Trade) => {
    if (!user?.uid || !updatedTrade.id) return;
    try {
      const tradeWithMetadata = {
        ...updatedTrade,
        updatedAt: new Date().toISOString()
      };

      await firebaseService.updateTrade(updatedTrade.id, tradeWithMetadata);
      const newTrades = trades.map(trade => 
        trade.id === updatedTrade.id ? tradeWithMetadata : trade
      );
      setTrades(newTrades);
      setFilteredTrades(newTrades);
    } catch (error) {
      console.error('Error updating trade:', error);
      throw error;
    }
  };

  const deleteTrade = async (id: string) => {
    if (!user) return;
    try {
      await firebaseService.deleteTrade(id);
      const newTrades = trades.filter(trade => trade.id !== id);
      setTrades(newTrades);
      setFilteredTrades(newTrades);
    } catch (error) {
      console.error('Error deleting trade:', error);
      throw error;
    }
  };

  const clearFilters = () => {
    setFilterOptions(defaultFilterOptions);
  };

  return (
    <TradeContext.Provider
      value={{
        trades,
        filteredTrades,
        addTrade,
        updateTrade,
        deleteTrade,
        filterOptions,
        updateFilters: setFilterOptions,
        clearFilters
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTrades = (): TradeContextType => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTrades must be used within a TradeProvider');
  }
  return context;
};