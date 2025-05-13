import React, { useState } from 'react';
import { ViolationSelect } from '../components/ViolationSelect';
import { ViolationRule } from '../utils/violationRules';
import { useNavigate } from 'react-router-dom';

import { useTrades } from '../context/TradeContext';
import { calculatePipsAndProfit } from '../utils/pipCalculations';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Button from '../components/ui/Button';
import { Plus, X } from 'lucide-react';

const AddTrade: React.FC = () => {
  const navigate = useNavigate();
  const { addTrade } = useTrades();
  
  // Form state
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [symbol, setSymbol] = useState<string>('');
  const [direction, setDirection] = useState<'long' | 'short'>('long');
  const [entryPrice, setEntryPrice] = useState<string>('');
  const [exitPrice, setExitPrice] = useState<string>('');
  const [lotSize, setLotSize] = useState<string>('0.01');
  const [fees, setFees] = useState<string>('0');
  const [strategy, setStrategy] = useState<string>('');
  const [setup, setSetup] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [selectedViolations, setSelectedViolations] = useState<ViolationRule[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [timeFrame, setTimeFrame] = useState<string>('');
  const [customTimeFrame, setCustomTimeFrame] = useState<string>('');
  const [emotions, setEmotions] = useState<string>('');
  const [rating, setRating] = useState<string>('3');
  
  // Validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  
  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};
    
    if (!date) newErrors.date = 'Date is required';
    if (!symbol) newErrors.symbol = 'Symbol is required';
    if (!entryPrice) newErrors.entryPrice = 'Entry price is required';
    if (!exitPrice) newErrors.exitPrice = 'Exit price is required';
    if (!lotSize) newErrors.lotSize = 'Lot size is required';
    
    // Validate numbers
    if (entryPrice && isNaN(Number(entryPrice))) newErrors.entryPrice = 'Must be a number';
    if (exitPrice && isNaN(Number(exitPrice))) newErrors.exitPrice = 'Must be a number';
    if (lotSize && isNaN(Number(lotSize))) newErrors.lotSize = 'Must be a number';
    if (fees && isNaN(Number(fees))) newErrors.fees = 'Must be a number';
    if (stopLoss && isNaN(Number(stopLoss))) newErrors.stopLoss = 'Must be a number';
    if (takeProfit && isNaN(Number(takeProfit))) newErrors.takeProfit = 'Must be a number';
    if (rating && (isNaN(Number(rating)) || Number(rating) < 1 || Number(rating) > 5)) {
      newErrors.rating = 'Rating must be between 1 and 5';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      // Calculate pips and profit using the new utility
      const { profit, profitPercentage } = calculatePipsAndProfit({
        symbol: symbol.toUpperCase(),
        direction,
        entryPrice: Number(entryPrice),
        exitPrice: Number(exitPrice),
        lotSize: Number(lotSize),
        fees: Number(fees)
      });
      
      // Create trade object without ID (Firebase will generate one)
      const tradeData = {
        date: date,
        symbol: symbol.toUpperCase(),
        direction: direction,
        entryPrice: Number(entryPrice),
        exitPrice: Number(exitPrice),
        quantity: 1, // Default to 1 since we're using lot size
        lotSize: Number(lotSize),
        fees: Number(fees),
        profit: profit,
        profitPercentage: profitPercentage,
        strategy: strategy,
        setup: setup,
        notes: notes,
        tags: tags,
        screenshots: [],
        stopLoss: stopLoss ? Number(stopLoss) : undefined,
        takeProfit: takeProfit ? Number(takeProfit) : undefined,
        timeFrame: timeFrame === 'custom' ? customTimeFrame : timeFrame || undefined,
        emotions: emotions || undefined,
        rating: rating ? Number(rating) : undefined,
        violations: selectedViolations
      };

      // Add trade to context and navigate to history
      await addTrade(tradeData);
      navigate('/history');
    } catch (error) {
      console.error(error);
    }
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Add New Trade</h1>
      
      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Trade Date */}
            <Input
              type="date"
              label="Date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              error={errors.date}
              fullWidth
            />
            
            {/* Symbol */}
            <Input
              type="text"
              label="Symbol"
              placeholder="e.g., EURUSD"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              error={errors.symbol}
              fullWidth
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Direction */}
            <Select
              label="Direction"
              options={[
                { value: 'long', label: 'Long' },
                { value: 'short', label: 'Short' }
              ]}
              value={direction}
              onChange={(value) => setDirection(value as 'long' | 'short')}
              fullWidth
            />
            
            {/* Time Frame */}
            <Select
              label="Time Frame"
              options={[
                { value: '', label: 'Select Time Frame' },
                { value: '1m', label: '1 Minute' },
                { value: '3m', label: '3 Minutes' },
                { value: '5m', label: '5 Minutes' },
                { value: '15m', label: '15 Minutes' },
                { value: '30m', label: '30 Minutes' },
                { value: '1h', label: '1 Hour' },
                { value: '2h', label: '2 Hours' },
                { value: '4h', label: '4 Hours' },
                { value: '1d', label: 'Daily' },
                { value: '1w', label: 'Weekly' },
                { value: 'custom', label: 'Custom' }
              ]}
              value={timeFrame}
              onChange={setTimeFrame}
              fullWidth
            />
            
            {/* Custom Time Frame */}
            {timeFrame === 'custom' && (
              <Input
                type="text"
                label="Custom Time Frame"
                placeholder="e.g., 45m, 6h"
                value={customTimeFrame}
                onChange={(e) => setCustomTimeFrame(e.target.value)}
                fullWidth
              />
            )}
            
            {/* Strategy */}
            <Input
              type="text"
              label="Strategy"
              placeholder="e.g., Breakout"
              value={strategy}
              onChange={(e) => setStrategy(e.target.value)}
              fullWidth
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Entry Price */}
            <Input
              type="number"
              label="Entry Price"
              placeholder="0.00"
              step="0.00001"
              value={entryPrice}
              onChange={(e) => setEntryPrice(e.target.value)}
              error={errors.entryPrice}
              fullWidth
            />
            
            {/* Exit Price */}
            <Input
              type="number"
              label="Exit Price"
              placeholder="0.00"
              step="0.00001"
              value={exitPrice}
              onChange={(e) => setExitPrice(e.target.value)}
              error={errors.exitPrice}
              fullWidth
            />
            
            {/* Lot Size */}
            <Input
              type="number"
              label="Lot Size"
              placeholder="0.01"
              step="0.01"
              value={lotSize}
              onChange={(e) => setLotSize(e.target.value)}
              error={errors.lotSize}
              fullWidth
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stop Loss */}
            <Input
              type="number"
              label="Stop Loss (optional)"
              placeholder="0.00"
              step="0.00001"
              value={stopLoss}
              onChange={(e) => setStopLoss(e.target.value)}
              error={errors.stopLoss}
              fullWidth
            />
            
            {/* Take Profit */}
            <Input
              type="number"
              label="Take Profit (optional)"
              placeholder="0.00"
              step="0.00001"
              value={takeProfit}
              onChange={(e) => setTakeProfit(e.target.value)}
              error={errors.takeProfit}
              fullWidth
            />
            
            {/* Fees */}
            <Input
              type="number"
              label="Fees"
              placeholder="0.00"
              step="0.01"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              error={errors.fees}
              fullWidth
            />
          </div>
          
          {/* Setup */}
          <Textarea
            label="Setup"
            placeholder="Describe your trade setup..."
            value={setup}
            onChange={(e) => setSetup(e.target.value)}
            fullWidth
          />
          
          {/* Notes */}
          <Textarea
            label="Notes"
            placeholder="Additional notes about this trade..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            fullWidth
          />
          
          {/* Emotions */}
          <Input
            type="text"
            label="Emotions (optional)"
            placeholder="How did you feel during this trade?"
            value={emotions}
            onChange={(e) => setEmotions(e.target.value)}
            fullWidth
          />
          
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Trade Rating
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star.toString())}
                  className={`w-10 h-10 flex items-center justify-center rounded-full
                    ${Number(rating) >= star 
                      ? 'bg-yellow-400 text-white' 
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500'
                    }`}
                >
                  {star}
                </button>
              ))}
            </div>
            {errors.rating && <p className="mt-1 text-sm text-red-500">{errors.rating}</p>}
          </div>
          
          {/* Rule Violations */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Rule Violations
            </label>
            <ViolationSelect
              selectedViolations={selectedViolations}
              onChange={setSelectedViolations}
            />
          </div>
          
          {/* Tags */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Tags
            </label>
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Add a tag..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="ml-2"
                disabled={!tagInput.trim()}
              >
                <Plus size={16} />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <div
                  key={tag}
                  className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 text-blue-800 dark:text-blue-400 hover:text-blue-600 dark:hover:text-blue-300"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No tags added yet</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/history')}
            >
              Cancel
            </Button>
            <Button type="submit">Save Trade</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddTrade;