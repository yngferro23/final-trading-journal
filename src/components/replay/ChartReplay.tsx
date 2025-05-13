import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'recharts';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { Play, Pause, SkipForward, SkipBack, RefreshCw } from 'lucide-react';

interface MarketData {
  timestamp: string;
  price: number;
}

interface ChartReplayProps {
  data: MarketData[];
  onTradeSimulated: (trade: SimulatedTrade) => void;
  symbol: string;
}

export interface SimulatedTrade {
  timestamp: string;
  entryPrice: number;
  exitPrice: number;
  direction: 'long' | 'short';
  symbol: string;
  profit: number;
}

const ChartReplay: React.FC<ChartReplayProps> = ({ data, onTradeSimulated, symbol }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [speed, setSpeed] = useState(1); // Playback speed multiplier
  const [activeTrade, setActiveTrade] = useState<Partial<SimulatedTrade> | null>(null);
  const animationFrameRef = useRef<number>();

  const visibleDataPoints = 100; // Number of data points to show at once
  const visibleData = data.slice(
    Math.max(0, currentIndex - visibleDataPoints),
    currentIndex + 1
  );

  useEffect(() => {
    if (isPlaying) {
      const animate = () => {
        setCurrentIndex((prev) => {
          if (prev >= data.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
        animationFrameRef.current = requestAnimationFrame(animate);
      };
      animationFrameRef.current = requestAnimationFrame(animate);
    }
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, data.length, speed]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handleSkipForward = () => {
    setCurrentIndex((prev) => Math.min(prev + 10, data.length - 1));
  };

  const handleSkipBack = () => {
    setCurrentIndex((prev) => Math.max(prev - 10, 0));
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setIsPlaying(false);
    setActiveTrade(null);
  };

  const handleTrade = (direction: 'long' | 'short') => {
    const currentPrice = data[currentIndex].price;
    
    if (!activeTrade) {
      // Open new trade
      setActiveTrade({
        timestamp: data[currentIndex].timestamp,
        entryPrice: currentPrice,
        direction,
        symbol
      });
    } else {
      // Close existing trade
      const profit = activeTrade.direction === 'long'
        ? currentPrice - activeTrade.entryPrice!
        : activeTrade.entryPrice! - currentPrice;

      const completedTrade: SimulatedTrade = {
        ...activeTrade as SimulatedTrade,
        exitPrice: currentPrice,
        profit
      };

      onTradeSimulated(completedTrade);
      setActiveTrade(null);
    }
  };

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              onClick={handlePlayPause}
              variant="outline"
              size="sm"
            >
              {isPlaying ? <Pause size={16} /> : <Play size={16} />}
            </Button>
            <Button
              onClick={handleSkipBack}
              variant="outline"
              size="sm"
            >
              <SkipBack size={16} />
            </Button>
            <Button
              onClick={handleSkipForward}
              variant="outline"
              size="sm"
            >
              <SkipForward size={16} />
            </Button>
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              onClick={() => handleTrade('long')}
              variant={activeTrade?.direction === 'long' ? 'default' : 'outline'}
              size="sm"
              className="text-green-600"
              disabled={activeTrade?.direction === 'short'}
            >
              Buy
            </Button>
            <Button
              onClick={() => handleTrade('short')}
              variant={activeTrade?.direction === 'short' ? 'default' : 'outline'}
              size="sm"
              className="text-red-600"
              disabled={activeTrade?.direction === 'long'}
            >
              Sell
            </Button>
          </div>
        </div>

        <div className="h-64">
          <Line
            data={visibleData}
            type="monotone"
            dataKey="price"
            stroke="#2563eb"
            dot={false}
            isAnimationActive={false}
          />
        </div>

        <div className="flex justify-between text-sm text-gray-500">
          <span>Speed: {speed}x</span>
          <span>Time: {data[currentIndex]?.timestamp}</span>
          <span>Price: ${data[currentIndex]?.price.toFixed(2)}</span>
        </div>
      </div>
    </Card>
  );
};

export default ChartReplay;
