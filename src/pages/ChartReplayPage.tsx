import React, { useState } from 'react';
import ChartReplay from '../components/replay/ChartReplay';
import TradeSimulation from '../components/replay/TradeSimulation';
import DataForwarding from '../components/replay/DataForwarding';
import { SimulatedTrade } from '../components/replay/ChartReplay';
import Card from '../components/ui/Card';

const ChartReplayPage: React.FC = () => {
  const [simulatedTrades, setSimulatedTrades] = useState<SimulatedTrade[]>([]);
  const dataForwarding = DataForwarding.getInstance();

  // Sample market data - in a real app, this would come from your data source
  const sampleData = Array.from({ length: 1000 }, (_, i) => ({
    timestamp: new Date(Date.now() - (1000 - i) * 60000).toISOString(),
    price: 100 + Math.sin(i / 50) * 10 + Math.random() * 2
  }));

  const handleTradeSimulated = (trade: SimulatedTrade) => {
    setSimulatedTrades(prev => [...prev, trade]);

    // Forward trade data to dashboard and analytics
    dataForwarding.forwardTrade(trade, {
      includeDashboard: true,
      includeAnalytics: true
    });
  };

  const handleClearTrades = () => {
    setSimulatedTrades([]);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        Chart Replay
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartReplay
            data={sampleData}
            onTradeSimulated={handleTradeSimulated}
            symbol="SAMPLE"
          />
        </div>
        <div>
          <TradeSimulation
            trades={simulatedTrades}
            onClear={handleClearTrades}
          />
        </div>
      </div>

      <Card className="p-4">
        <h2 className="text-lg font-semibold mb-4">How to Use</h2>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <li>• Use the play/pause button to control the chart replay</li>
          <li>• Click the forward/back buttons to skip through the data</li>
          <li>• Click "Buy" to simulate a long trade or "Sell" for a short trade</li>
          <li>• Click the same button again to close your position</li>
          <li>• View your simulated trade results in the panel on the right</li>
          <li>• All simulated trades will be reflected in the dashboard and analytics</li>
        </ul>
      </Card>

      <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 dark:border-yellow-600">
        <h2 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200">Coming Soon</h2>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-2">
          Chart Replay is still in development. We’re working hard to bring you a complete simulation experience.
          Thank you for choosing to journal and grow with us — exciting updates are on the way!
        </p>
      </Card>
    </div>
  );
};

export default ChartReplayPage;
