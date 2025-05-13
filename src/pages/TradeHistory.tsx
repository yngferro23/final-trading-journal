import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTrades } from '../context/TradeContext';
import { Trade } from '../types';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import TradeDetailsModal from '../components/TradeDetailsModal';
import { Edit, Trash2, Filter, Search, X } from 'lucide-react';
import { calculateRRR } from '../utils/rrrCalculations';

const TradeHistory: React.FC = () => {
  const { filteredTrades, deleteTrade, filterOptions, updateFilters, clearFilters } = useTrades();
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const itemsPerPage = 10;

  // Collect unique values for filter dropdowns
  const symbols = Array.from(new Set(filteredTrades.map(trade => trade.symbol)));
  const strategies = Array.from(new Set(filteredTrades.map(trade => trade.strategy).filter(Boolean)));

  const handleSymbolFilterChange = (symbol: string) => {
    updateFilters({
      ...filterOptions,
      symbols: symbol ? [symbol] : []
    });
  };

  const handleDirectionFilterChange = (direction: string) => {
    updateFilters({
      ...filterOptions,
      direction: direction ? direction as 'long' | 'short' : null
    });
  };

  const handleStrategyFilterChange = (strategy: string) => {
    updateFilters({
      ...filterOptions,
      strategies: strategy ? [strategy] : []
    });
  };

  const handleClearFilters = () => {
    clearFilters();
    setSearchTerm('');
  };

  // Format numbers
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  // Local filtering by search term and sort by date
  const displayedTrades = [...(searchTerm 
    ? filteredTrades.filter(trade => 
        trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.setup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.strategy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trade.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : filteredTrades)].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

  const currentTrades = displayedTrades.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Trade History</h1>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} className="mr-1" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </Button>
          <Link to="/add-trade">
            <Button size="sm">Add New Trade</Button>
          </Link>
        </div>
      </div>
      
      {/* Search and Filters */}
      <Card className={`${showFilters ? 'block' : 'hidden'}`}>
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full sm:w-auto flex-1">
              <Input
                type="text"
                placeholder="Search trades..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                fullWidth
                className="pl-10"
              />
              <Search 
                size={16} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleClearFilters}
              className="whitespace-nowrap"
            >
              Clear Filters
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Symbol"
              options={[
                { value: '', label: 'All Symbols' },
                ...symbols.map(symbol => ({ value: symbol, label: symbol }))
              ]}
              value={filterOptions.symbols[0] || ''}
              onChange={handleSymbolFilterChange}
              fullWidth
            />
            
            <Select
              label="Direction"
              options={[
                { value: '', label: 'All Directions' },
                { value: 'long', label: 'Long' },
                { value: 'short', label: 'Short' }
              ]}
              value={filterOptions.direction || ''}
              onChange={handleDirectionFilterChange}
              fullWidth
            />
            
            <Select
              label="Strategy"
              options={[
                { value: '', label: 'All Strategies' },
                ...strategies.map(strategy => ({ value: strategy, label: strategy }))
              ]}
              value={filterOptions.strategies[0] || ''}
              onChange={handleStrategyFilterChange}
              fullWidth
            />
          </div>
        </div>
      </Card>
      
      {/* Trade Table */}
      <Card>
        <div className="overflow-x-auto">
          {selectedTrade && (
            <TradeDetailsModal
              trade={selectedTrade}
              onClose={() => setSelectedTrade(null)}
            />
          )}
          {/* Pagination */}
          <div className="flex justify-between items-center mb-4">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Showing {Math.min((currentPage - 1) * itemsPerPage + 1, displayedTrades.length)} to {Math.min(currentPage * itemsPerPage, displayedTrades.length)} of {displayedTrades.length} trades
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage * itemsPerPage >= displayedTrades.length}
                className="px-3 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Next
              </button>
            </div>
          </div>

          {displayedTrades.length > 0 ? (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Symbol</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Direction</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Entry</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Exit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Profit</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Emotions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Planned RRR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Achieved RRR
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {currentTrades.map((trade) => (
                  <tr
                    key={trade.id}
                    className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => setSelectedTrade(trade)}
                  >
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {trade.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                        {formatCurrency(trade.profit)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {trade.emotions || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {trade.rating ? `${trade.rating}/5` : '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {(() => {
                        const rrr = calculateRRR(trade);
                        return rrr.plannedRRR !== null ? rrr.plannedRRR.toFixed(2) : 'N/A';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">
                      {(() => {
                        const rrr = calculateRRR(trade);
                        return rrr.achievedRRR !== null ? rrr.achievedRRR.toFixed(2) : 'N/A';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link 
                          to={`/edit-trade/${trade.id}`}
                          className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                        >
                          <Edit size={18} />
                        </Link>
                        <button
                          onClick={() => {
                            if (window.confirm('Are you sure you want to delete this trade?')) {
                              deleteTrade(trade.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-8 text-center text-gray-500 dark:text-gray-400">
              {filteredTrades.length === 0 ? (
                <>
                  <p className="mb-2">No trades have been recorded yet.</p>
                  <Link to="/add-trade">
                    <Button>Add Your First Trade</Button>
                  </Link>
                </>
              ) : (
                <>
                  <p className="mb-2">No trades match your current filters.</p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default TradeHistory;