import React from 'react';
import { useTrades } from '../context/TradeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { calculateDashboardStats } from '../utils/tradeCalculations';
import { calculateStreaks } from '../utils/streakCalculations';
import { calculateViolationStats } from '../utils/violationRules';
import { calculateRRRStats } from '../utils/rrrCalculations';
import { downloadTradeReport } from '../utils/pdfExport';
import { AlertTriangle, BarChart as BarChartIcon, TrendingUp, DollarSign, BarChart2, Flame, Award, Target, Share2 } from 'lucide-react';

interface Trade {
  id: string;
  date: string;
  symbol: string;
  direction: 'long' | 'short';
  entryPrice: number;
  exitPrice: number;
  profit: number;
}

const Dashboard: React.FC = () => {
  const { trades } = useTrades();
  const stats = calculateDashboardStats(trades);
  const streakInfo = calculateStreaks(trades);
  const violationStats = calculateViolationStats(trades);
  const rrrStats = calculateRRRStats(trades);

  // Format numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatPercentage = (value: number | null | undefined) => {
    if (value === null || value === undefined) return 'N/A';
    return `${value.toFixed(2)}%`;
  };
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <BarChartIcon size={24} className="text-blue-800 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Trades</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats.totalTrades}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <TrendingUp size={24} className="text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Win Rate</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats?.winRate !== undefined ? formatPercentage(stats.winRate) : 'N/A'}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
              <DollarSign size={24} className="text-purple-600 dark:text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Profit</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(stats.totalProfit)}</h3>
            </div>
          </div>
        </Card>
        
        <Card className="transition-transform hover:scale-105">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full mr-4">
              <BarChart2 size={24} className="text-orange-600 dark:text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Profit Factor</p>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">{stats?.profitFactor !== undefined ? formatPercentage(stats.profitFactor) : 'N/A'}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Recent Trades */}
      <Card title="Recent Trades">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Direction</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {trades.length > 0 ? (
                trades
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .slice(0, 5)
                  .map((trade: Trade) => (
                    <tr key={trade.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {new Date(trade.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">
                        {trade.symbol}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${trade.direction === 'long' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                          }`}
                        >
                          {trade.direction.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {formatCurrency(trade.entryPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                        {formatCurrency(trade.exitPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <span className={trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                          {formatCurrency(trade.profit)}
                        </span>
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    No trades recorded yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Risk-Reward Ratio */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Risk-Reward Ratio</h3>
            <Target size={20} className="text-blue-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Planned RRR
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {rrrStats.averagePlannedRRR !== null 
                  ? rrrStats.averagePlannedRRR.toFixed(2)
                  : 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Average Achieved RRR
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {rrrStats.averageAchievedRRR !== null 
                  ? rrrStats.averageAchievedRRR.toFixed(2)
                  : 'N/A'}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Trades Without Stop Loss
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {rrrStats.tradesWithoutStopLoss}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Mentor Sharing */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Mentor Sharing</h3>
            <Share2 size={20} className="text-blue-500" />
          </div>
          
          <div className="space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Export your trading journal as a clean, well-formatted report to share with your mentor.
              Includes performance metrics, trade history, and analysis.
            </p>
            
            <div className="flex gap-4">
              <Button 
                onClick={() => downloadTradeReport(trades)}
                className="w-full sm:w-auto"
              >
                <Share2 size={16} className="mr-2" />
                Export Trading Journal
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Rule Violations */}
      <Card>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Rule Violations</h3>
            <div className="flex items-center space-x-2">
              <AlertTriangle size={20} className="text-yellow-500" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">
                {violationStats.totalViolations}
              </span>
            </div>
          </div>

          {violationStats.violationFrequency.length > 0 ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Most Broken Rule
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 dark:text-white">
                    {violationStats.mostBrokenRule.rule}
                  </span>
                  <span className="text-sm font-medium text-red-600 dark:text-red-400">
                    {violationStats.mostBrokenRule.count}x
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Win Rate with Violations</span>
                  <span className="font-medium text-red-600 dark:text-red-400">
                    {formatPercentage(violationStats.winRateWithViolations)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Win Rate without Violations</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatPercentage(violationStats.winRateWithoutViolations)}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Violation Breakdown
                </p>
                <div className="space-y-2">
                  {violationStats.violationFrequency.map(({ ruleId, label, count }) => (
                    <div key={ruleId} className="flex justify-between items-center">
                      <span className="text-sm text-gray-900 dark:text-white">{label}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-red-500 dark:bg-red-600"
                            style={{
                              width: `${(count / violationStats.totalViolations) * 100}%`
                            }}
                          />
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400 text-center py-4">
              No rule violations recorded
            </p>
          )}
        </div>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full mr-4">
              <Award size={24} className="text-blue-800 dark:text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</p>
              <div className="flex items-center space-x-2">
                <h3 className={`text-xl font-bold ${
                  streakInfo.currentStreak >= 0 
                    ? 'text-green-600 dark:text-green-500' 
                    : 'text-red-600 dark:text-red-500'
                }`}>
                  {Math.abs(streakInfo.currentStreak)} {streakInfo.currentStreak >= 0 ? 'Wins' : 'Losses'}
                </h3>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full mr-4">
              <TrendingUp size={24} className="text-green-600 dark:text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Best Streak</p>
              <h3 className="text-xl font-bold text-green-600 dark:text-green-500">
                {streakInfo.longestWinStreak} Wins
              </h3>
            </div>
          </div>
        </Card>

        {streakInfo.isOnTilt ? (
          <Card className="bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800">
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-red-900/30 p-3 rounded-full mr-4">
                <Flame size={24} className="text-red-600 dark:text-red-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Tilt Warning!</p>
                <h3 className="text-xl font-bold text-red-700 dark:text-red-500">
                  {Math.abs(streakInfo.currentStreak)} Consecutive Losses
                </h3>
                <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                  Consider taking a break
                </p>
              </div>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="flex items-center">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-3 rounded-full mr-4">
                <DollarSign size={24} className="text-purple-600 dark:text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Average Trade</p>
                <h3 className={`text-xl font-bold ${
                  stats.averageProfit >= 0 
                    ? 'text-green-600 dark:text-green-500' 
                    : 'text-red-600 dark:text-red-500'
                }`}>
                  {formatCurrency(stats.averageProfit)}
                </h3>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;