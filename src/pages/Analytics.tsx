import React from 'react';
import { useTrades } from '../context/TradeContext';
import Card from '../components/ui/Card';
import { calculateDashboardStats, generateMonthlyPerformance, generateSymbolPerformance } from '../utils/tradeCalculations';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const Analytics: React.FC = () => {
  const { trades } = useTrades();
  const stats = calculateDashboardStats(trades);
  
  // Format numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };
  
  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };
  
  // Calculate win/loss ratio
  const winningTrades = trades.filter(trade => trade.profit > 0).length;
  const losingTrades = trades.filter(trade => trade.profit <= 0).length;
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics</h1>
      
      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20">
          <h3 className="text-lg font-medium text-blue-800 dark:text-blue-400 mb-2">Win Rate</h3>
          <div className="flex items-center justify-between">
            <p className="text-3xl font-bold text-blue-800 dark:text-blue-400">
              {formatPercentage(stats.winRate)}
            </p>
            <div className="flex items-center">
              <span className="text-sm font-medium text-green-600 dark:text-green-400 mr-1">Win: {winningTrades}</span>
              <span className="mx-1 text-gray-500">/</span>
              <span className="text-sm font-medium text-red-600 dark:text-red-400">Loss: {losingTrades}</span>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20">
          <h3 className="text-lg font-medium text-green-800 dark:text-green-400 mb-2">Total Profit</h3>
          <p className="text-3xl font-bold text-green-800 dark:text-green-400">
            {formatCurrency(stats.totalProfit)}
          </p>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/20">
          <h3 className="text-lg font-medium text-purple-800 dark:text-purple-400 mb-2">Profit Factor</h3>
          <p className="text-3xl font-bold text-purple-800 dark:text-purple-400">
            {stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
          </p>
        </Card>
      </div>
      
      {/* Chart: Monthly Performance */}
      <Card title="Monthly Performance">
        <div className="h-64">
          {trades.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={generateMonthlyPerformance(trades).labels.map((month, index) => ({
                  month,
                  profit: generateMonthlyPerformance(trades).data[index]
                }))}
                margin={{ top: 20, right: 30, left: 60, bottom: 50 }}
                barSize={40}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis 
                  dataKey="month" 
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  tick={{ fontSize: 12, fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                />
                <YAxis
                  tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                  tick={{ fontSize: 12, fill: '#4B5563' }}
                  tickLine={{ stroke: '#9CA3AF' }}
                  axisLine={{ stroke: '#9CA3AF' }}
                  label={{ 
                    value: 'Net Profit ($)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: -45,
                    style: { fill: '#4B5563', fontSize: 12 }
                  }}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 shadow-lg rounded-lg">
                          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{data.month}</p>
                          <p className={`text-sm font-bold ${data.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                            {formatCurrency(data.profit)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="profit"
                  name="Monthly Net Profit"
                >
                  {generateMonthlyPerformance(trades).data.map((profit, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={profit >= 0 ? '#22C55E' : '#EF4444'}
                      opacity={0.85}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No data available</p>
          )}
        </div>
      </Card>
      
      {/* Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Win/Loss Distribution */}
        <Card title="Win/Loss Distribution">
          <div className="h-64">
            {trades.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: 'Winning Trades', value: winningTrades, color: '#22C55E' },
                      { name: 'Losing Trades', value: losingTrades, color: '#EF4444' }
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    nameKey="name"
                  >
                    {[
                      { name: 'Winning Trades', value: winningTrades, color: '#22C55E' },
                      { name: 'Losing Trades', value: losingTrades, color: '#EF4444' }
                    ].map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => Number(value)}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </Card>
        
        {/* Chart: Symbol Performance */}
        <Card title="Symbol Performance">
          <div className="h-64">
            {trades.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={generateSymbolPerformance(trades).labels.map((symbol, index) => ({
                    symbol,
                    profit: generateSymbolPerformance(trades).data[index],
                    gain: generateSymbolPerformance(trades).data[index] > 0 ? generateSymbolPerformance(trades).data[index] : 0,
                    loss: generateSymbolPerformance(trades).data[index] < 0 ? generateSymbolPerformance(trades).data[index] : 0
                  }))}
                  margin={{ top: 20, right: 30, left: 60, bottom: 20 }}
                  barSize={30}
                  layout="vertical"
                  barGap={0}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} />
                  <XAxis
                    type="number"
                    tickFormatter={(value) => formatCurrency(value).replace('.00', '')}
                    tick={{ fontSize: 12, fill: '#4B5563' }}
                    tickLine={{ stroke: '#9CA3AF' }}
                    axisLine={{ stroke: '#9CA3AF' }}
                  />
                  <YAxis
                    type="category"
                    dataKey="symbol"
                    tick={{ fontSize: 12, fill: '#4B5563', fontWeight: 'medium' }}
                    tickLine={{ stroke: '#9CA3AF' }}
                    axisLine={{ stroke: '#9CA3AF' }}
                    width={80}
                  />
                  <Tooltip
                    cursor={{ fill: 'rgba(229, 231, 235, 0.2)' }}
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-3 shadow-lg rounded-lg">
                            <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{data.symbol}</p>
                            <p className={`text-sm font-bold ${data.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {formatCurrency(data.profit)}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={36}
                    formatter={(value) => {
                      return <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{value}</span>;
                    }}
                  />
                  <Bar
                    dataKey="gain"
                    name="Profit"
                    fill="#22C55E"
                    opacity={0.8}
                  />
                  <Bar
                    dataKey="loss"
                    name="Loss"
                    fill="#EF4444"
                    opacity={0.8}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No data available</p>
            )}
          </div>
        </Card>
      </div>
      
      {/* Performance Metrics Table */}
      <Card title="Performance Metrics">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ul className="space-y-4">
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Trades</span>
                <span className="font-medium text-gray-900 dark:text-white">{stats.totalTrades}</span>
              </li>
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Winning Trades</span>
                <span className="font-medium text-green-600 dark:text-green-400">{winningTrades}</span>
              </li>
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Losing Trades</span>
                <span className="font-medium text-red-600 dark:text-red-400">{losingTrades}</span>
              </li>
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Win Rate</span>
                <span className="font-medium text-gray-900 dark:text-white">{formatPercentage(stats.winRate)}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Profit Factor</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {stats.profitFactor === Infinity ? "∞" : stats.profitFactor.toFixed(2)}
                </span>
              </li>
            </ul>
          </div>
          
          <div>
            <ul className="space-y-4">
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Total Profit</span>
                <span className={`font-medium ${stats.totalProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.totalProfit)}
                </span>
              </li>
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Average Trade</span>
                <span className={`font-medium ${stats.averageProfit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatCurrency(stats.averageProfit)}
                </span>
              </li>
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Average Win</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(stats.averageWin)}
                </span>
              </li>
              <li className="flex justify-between pb-2 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Average Loss</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  {formatCurrency(stats.averageLoss)}
                </span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Largest Win</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(stats.largestWin)}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Analytics;