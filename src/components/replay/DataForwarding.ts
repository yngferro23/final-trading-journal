import { SimulatedTrade } from './ChartReplay';

interface ForwardingOptions {
  includeDashboard?: boolean;
  includeAnalytics?: boolean;
}

class DataForwarding {
  private static instance: DataForwarding;
  private subscribers: ((trade: SimulatedTrade) => void)[] = [];

  private constructor() {}

  static getInstance(): DataForwarding {
    if (!DataForwarding.instance) {
      DataForwarding.instance = new DataForwarding();
    }
    return DataForwarding.instance;
  }

  subscribe(callback: (trade: SimulatedTrade) => void) {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(cb => cb !== callback);
    };
  }

  forwardTrade(trade: SimulatedTrade, options: ForwardingOptions = {}) {
    // Forward to all subscribers
    this.subscribers.forEach(callback => callback(trade));

    // Format trade for dashboard/analytics integration
    const formattedTrade = {
      id: `sim_${Date.now()}`,
      date: trade.timestamp,
      symbol: trade.symbol,
      direction: trade.direction,
      entryPrice: trade.entryPrice,
      exitPrice: trade.exitPrice,
      profit: trade.profit,
      isSimulated: true
    };

    // Emit events for dashboard/analytics integration
    if (options.includeDashboard) {
      window.dispatchEvent(new CustomEvent('simulated-trade-dashboard', {
        detail: formattedTrade
      }));
    }

    if (options.includeAnalytics) {
      window.dispatchEvent(new CustomEvent('simulated-trade-analytics', {
        detail: formattedTrade
      }));
    }
  }
}

export default DataForwarding;
