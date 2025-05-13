import React, { useState } from 'react';
import { useTrades } from '../context/TradeContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { Download, Upload, AlertTriangle } from 'lucide-react';

const Settings: React.FC = () => {
  const { trades } = useTrades();
  const [exportFormat, setExportFormat] = useState('json');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  
  // Export data
  const handleExport = () => {
    const data = JSON.stringify(trades, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `trader_journal_export_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Handle file selection for import
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImportFile(e.target.files[0]);
      setImportError(null);
    }
  };
  
  // Import data
  const handleImport = () => {
    if (!importFile) {
      setImportError('Please select a file to import');
      return;
    }
    
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedData = JSON.parse(content);
        
        // Validate imported data
        if (!Array.isArray(importedData)) {
          throw new Error('Invalid data format. Expected an array of trades');
        }
        
        // TODO: Add more validation here
        
        // Import data
        alert(`Would import ${importedData.length} trades. Functionality limited in demo.`);
        setImportError(null);
        
      } catch (error) {
        setImportError(`Error importing data: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    };
    
    reader.onerror = () => {
      setImportError('Error reading file');
    };
    
    reader.readAsText(importFile);
  };
  
  // Reset all data
  const handleResetAllData = () => {
    if (window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      alert('This would clear all data in a full implementation.');
      // TODO: Implement data reset
    }
  };
  
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h1>
      
      {/* Export Data */}
      <Card title="Export Data">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Export your trading journal data to a file for backup or transfer to another device.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            label="Export Format"
            options={[
              { value: 'json', label: 'JSON' },
              { value: 'csv', label: 'CSV (Coming soon)' }
            ]}
            value={exportFormat}
            onChange={setExportFormat}
          />
          <div className="self-end">
            <Button onClick={handleExport} className="flex items-center">
              <Download size={16} className="mr-2" />
              Export Data
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Import Data */}
      <Card title="Import Data">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          Import trading journal data from a file. Only JSON format is supported.
        </p>
        
        <div className="flex flex-col gap-4">
          <Input 
            type="file" 
            accept=".json" 
            onChange={handleFileChange}
            fullWidth
          />
          
          {importError && (
            <div className="flex items-center p-3 text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30 rounded-md">
              <AlertTriangle size={18} className="mr-2" />
              <span>{importError}</span>
            </div>
          )}
          
          <div>
            <Button 
              onClick={handleImport} 
              disabled={!importFile}
              className="flex items-center"
            >
              <Upload size={16} className="mr-2" />
              Import Data
            </Button>
          </div>
        </div>
      </Card>
      
      {/* Danger Zone */}
      <Card title="Danger Zone" className="border-red-200 dark:border-red-900">
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          These actions are permanent and cannot be undone. Please be careful.
        </p>
        
        <Button 
          variant="danger" 
          onClick={handleResetAllData}
          className="flex items-center"
        >
          <AlertTriangle size={16} className="mr-2" />
          Reset All Data
        </Button>
      </Card>
    </div>
  );
};

export default Settings;