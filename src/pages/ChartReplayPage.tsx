import React from 'react';

const ChartReplayPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-yellow-50 dark:bg-yellow-900 px-6">
      <div className="text-center max-w-xl">
        <h1 className="text-4xl font-bold text-yellow-800 dark:text-yellow-200">
          Chart Replay Coming Soon
        </h1>
        <p className="mt-6 text-lg text-yellow-700 dark:text-yellow-300">
          We're currently building a powerful and intuitive chart replay experience designed to help you simulate trades,
          refine your strategy, and grow as a trader.
        </p>
        <p className="mt-4 text-yellow-700 dark:text-yellow-300">
          This feature is under active development, and we can't wait to share it with you. Whether you're practicing market
          entries or journaling your trading performance, this tool will help you gain confidence and improve decision-making.
        </p>
        <p className="mt-4 font-medium text-yellow-800 dark:text-yellow-100">
          Thank you for your patience and for choosing to grow with us.
        </p>
      </div>
    </div>
  );
};

export default ChartReplayPage;
