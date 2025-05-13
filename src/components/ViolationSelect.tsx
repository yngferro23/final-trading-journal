import React, { useState } from 'react';
import { ViolationRule, defaultViolationRules } from '../utils/violationRules';

interface ViolationSelectProps {
  selectedViolations: ViolationRule[];
  onChange: (violations: ViolationRule[]) => void;
}

export const ViolationSelect: React.FC<ViolationSelectProps> = ({
  selectedViolations,
  onChange
}) => {
  const [customRule, setCustomRule] = useState('');
  const [availableRules, setAvailableRules] = useState<ViolationRule[]>(defaultViolationRules);

  const handleAddCustomRule = () => {
    if (customRule.trim()) {
      const newRule: ViolationRule = {
        id: `custom-${Date.now()}`,
        label: customRule.trim(),
        isCustom: true
      };
      setAvailableRules([...availableRules, newRule]);
      setCustomRule('');
    }
  };

  const handleToggleViolation = (rule: ViolationRule) => {
    const isSelected = selectedViolations.some(v => v.id === rule.id);
    if (isSelected) {
      onChange(selectedViolations.filter(v => v.id !== rule.id));
    } else {
      onChange([...selectedViolations, rule]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {availableRules.map(rule => (
          <button
            key={rule.id}
            onClick={() => handleToggleViolation(rule)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors
              ${selectedViolations.some(v => v.id === rule.id)
                ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {rule.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customRule}
          onChange={(e) => setCustomRule(e.target.value)}
          placeholder="Add custom rule..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
            focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        <button
          onClick={handleAddCustomRule}
          disabled={!customRule.trim()}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 
            disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};
