import React from 'react';
import { Trade } from '../types';
import { X } from 'lucide-react';

interface TradeDetailsModalProps {
  trade: Trade | null;
  onClose: () => void;
}

const TradeDetailsModal: React.FC<TradeDetailsModalProps> = ({ trade, onClose }) => {
  if (!trade) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X size={24} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {trade.symbol}
            <span className={`text-lg ${trade.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {trade.profit >= 0 ? '+' : ''}{trade.profit.toFixed(2)}
            </span>
          </h2>
          <p className="text-gray-500 dark:text-gray-400">{new Date(trade.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        {/* Trade Details Sections */}
        <div className="space-y-8">
          {/* Basic Info */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Trade Details</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Direction</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{trade.direction}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Strategy</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{trade.strategy || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Entry Price</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trade.entryPrice}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Exit Price</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trade.exitPrice}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Stop Loss</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trade.stopLoss || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Take Profit</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trade.takeProfit || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Lot Size</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white">{trade.lotSize}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Setup</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{trade.setup || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Setup and Emotions */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Setup & Emotions</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Setup Type</h3>
                <p className="text-lg font-semibold text-gray-900 dark:text-white capitalize">{trade.setup || 'N/A'}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Trade Rating</h3>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-5 h-5 ${star <= (trade.rating || 0) ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Setup Description</h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">{trade.setupDescription || 'No setup description provided'}</p>
              </div>
              <div className="col-span-2">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Emotions During Trade</h3>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">{trade.emotions || 'No emotions recorded'}</p>
              </div>
            </div>
          </div>

          {/* Notes Section */}
          {trade.notes && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Trade Notes</h3>
              <p className="text-gray-900 dark:text-white whitespace-pre-wrap rounded-lg bg-gray-50 dark:bg-gray-800/50 p-4">{trade.notes}</p>
            </div>
          )}

          {/* Rule Violations */}
          {trade.violations && trade.violations.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Rule Violations</h3>
              <div className="flex flex-wrap gap-2">
                {(trade.violations || []).map((violation: { id: string; label: string }, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-sm"
                  >
                    {violation.label}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TradeDetailsModal;
