import React, { useState } from 'react';
import Card from '../ui/Card';
import { SimulatedTrade } from './ChartReplay';

interface TradeSimulationProps {
  trades: SimulatedTrade[];
  onClear: () => void;
}

const TradeSimulation: React.FC<TradeSimulationProps> = ({ trades, onClear }) => {
  const totalProfit = trades.reduce((sum, trade) => sum + trade.profit, 0);
  const winningTrades = trades.filter(trade => trade.profit > 0).length;
  const winRate = trades.length > 0 ? (winningTrades / trades.length) * 100 : 0;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Simulation Results</h3>
          <button
            onClick={onClear}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Clear
          </button>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-500">Total Trades</p>
            <p className="text-lg font-semibold">{trades.length}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Win Rate</p>
            <p className="text-lg font-semibold">{winRate.toFixed(2)}%</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Total P/L</p>
            <p className={`text-lg font-semibold ${
              totalProfit >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${totalProfit.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Trade History</h4>
          <div className="max-h-60 overflow-y-auto">
            <table className="min-w-full">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="text-left py-2">Time</th>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right py-2">Entry</th>
                  <th className="text-right py-2">Exit</th>
                  <th className="text-right py-2">P/L</th>
                </tr>
              </thead>
              <tbody>
                {trades.map((trade, index) => (
                  <tr key={index} className="border-t border-gray-200">
                    <td className="py-2 text-sm">
                      {new Date(trade.timestamp).toLocaleTimeString()}
                    </td>
                    <td className={`py-2 text-sm ${
                      trade.direction === 'long' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {trade.direction === 'long' ? 'Long' : 'Short'}
                    </td>
                    <td className="py-2 text-sm text-right">
                      ${trade.entryPrice.toFixed(2)}
                    </td>
                    <td className="py-2 text-sm text-right">
                      ${trade.exitPrice.toFixed(2)}
                    </td>
                    <td className={`py-2 text-sm text-right ${
                      trade.profit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${trade.profit.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TradeSimulation;
