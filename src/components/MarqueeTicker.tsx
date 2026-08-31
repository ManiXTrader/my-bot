import React from 'react';
import { TradingPair } from '../types';
import { TrendingUp, TrendingDown, Sparkles } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface MarqueeTickerProps {
  pairs: TradingPair[];
  selectedPair: TradingPair;
  onSelectPair: (pair: TradingPair) => void;
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  pairs,
  selectedPair,
  onSelectPair,
}) => {
  // Duplicate pairs for continuous seamless loop
  const displayList = [...pairs, ...pairs];

  return (
    <div className="w-full bg-[#161A1E] border-b border-gray-800 overflow-hidden py-2 relative group">
      {/* Left/Right Fade gradients */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-[#161A1E] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#161A1E] to-transparent z-10 pointer-events-none" />

      <div className="flex items-center gap-4 whitespace-nowrap animate-[marquee_35s_linear_infinite] hover:[animation-play-state:paused]">
        {displayList.map((item, index) => {
          const isSelected = selectedPair.id === item.id;
          return (
            <button
              key={`${item.id}-${index}`}
              onClick={() => {
                soundFx.playClick();
                onSelectPair(item);
              }}
              className={`inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                isSelected
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500 font-bold shadow-sm'
                  : 'bg-[#1E2329] border border-gray-800 text-gray-300 hover:text-white hover:border-gray-700'
              }`}
            >
              <span className="font-semibold text-[#EAECEF]">{item.name}</span>
              <span className="text-gray-500">•</span>
              <span className="text-emerald-400 font-bold">{item.winRate.toFixed(0)}% Acc.</span>

              {item.winRate >= 97 && (
                <span className="inline-flex items-center gap-0.5 text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                  <TrendingUp className="w-2.5 h-2.5" />
                  HOT
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
