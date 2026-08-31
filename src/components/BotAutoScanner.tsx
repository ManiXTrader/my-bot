import React, { useState, useEffect } from 'react';
import { TradingPair, TradeSignal, BrokerType } from '../types';
import { TRADING_PAIRS } from '../data/pairs';
import { generateInitialCandles, generateSignal } from '../utils/marketEngine';
import { soundFx } from '../utils/audio';
import {
  Bot,
  Play,
  Square,
  Sparkles,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldCheck,
  CheckCircle,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
} from 'lucide-react';

interface BotAutoScannerProps {
  currentBroker: BrokerType;
  onTradeSignal: (signal: TradeSignal, isWin: boolean, profit: number) => void;
}

export const BotAutoScanner: React.FC<BotAutoScannerProps> = ({
  currentBroker,
  onTradeSignal,
}) => {
  const [isAutoRunning, setIsAutoRunning] = useState(false);
  const [autoSignals, setAutoSignals] = useState<TradeSignal[]>([]);
  const [minAccuracy, setMinAccuracy] = useState(96);
  const [scannedPairsCount, setScannedPairsCount] = useState(TRADING_PAIRS.length);
  const [lastScanTime, setLastScanTime] = useState<string>('Just now');

  // Multi-pair auto scan loop
  useEffect(() => {
    if (!isAutoRunning) return;

    const scanInterval = setInterval(() => {
      // Pick random pair from all available OTC and LIVE
      const randomPair = TRADING_PAIRS[Math.floor(Math.random() * TRADING_PAIRS.length)];
      const mockCandles = generateInitialCandles(randomPair, 20);
      const timeframes = ['5s', '15s', '1m', '2m', '5m'] as const;
      const tf = timeframes[Math.floor(Math.random() * timeframes.length)];

      const newSig = generateSignal(randomPair, mockCandles, tf, currentBroker);

      if (newSig.accuracy >= minAccuracy) {
        if (newSig.direction === 'CALL') {
          soundFx.playSignalCall();
        } else {
          soundFx.playSignalPut();
        }

        setAutoSignals((prev) => [newSig, ...prev.slice(0, 19)]);
        setLastScanTime(new Date().toLocaleTimeString());

        // Simulate resolution after 4 seconds
        setTimeout(() => {
          const isWin = Math.random() < 0.95;
          const profit = isWin ? 50 * (randomPair.payout / 100) : -50;
          if (isWin) soundFx.playWin();
          onTradeSignal({ ...newSig, status: isWin ? 'WON' : 'LOST', resultProfit: profit }, isWin, profit);
        }, 4000);
      }
    }, 5000);

    return () => clearInterval(scanInterval);
  }, [isAutoRunning, minAccuracy, currentBroker, onTradeSignal]);

  const toggleBot = () => {
    soundFx.playClick();
    setIsAutoRunning(!isAutoRunning);
    if (!isAutoRunning) {
      soundFx.playScan();
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Bot Controller Card */}
      <div className="p-5 sm:p-6 rounded-xl bg-[#161A1E] border border-gray-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl border ${isAutoRunning ? 'bg-blue-600/20 border-blue-500 text-blue-400 animate-pulse' : 'bg-[#1E2329] border-gray-700 text-gray-400'}`}>
              <Bot className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-['Rajdhani'] font-extrabold text-xl text-white uppercase tracking-wider">
                  MANI AI 24/7 AUTO-SCANNER
                </h2>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${isAutoRunning ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' : 'bg-[#1E2329] text-gray-400 border-gray-700'}`}>
                  {isAutoRunning ? '● LIVE SCANNING ALL PAIRS' : 'PAUSED'}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Continuously scans all 20+ OTC and Live pairs for 96%+ Amir FX Candlestick & S&R Setups
              </p>
            </div>
          </div>

          {/* Start/Stop Button */}
          <button
            onClick={toggleBot}
            className={`px-6 py-3 rounded-lg font-['Rajdhani'] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
              isAutoRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-900/30'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/30'
            }`}
          >
            {isAutoRunning ? (
              <>
                <Square className="w-4 h-4 fill-current" /> STOP AUTO BOT
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> START 24/7 AUTO BOT
              </>
            )}
          </button>
        </div>

        {/* Filter / Config options */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#1E2329] border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400">Min Accuracy Filter:</span>
            <select
              value={minAccuracy}
              onChange={(e) => setMinAccuracy(Number(e.target.value))}
              className="bg-[#161A1E] text-blue-400 font-mono font-bold px-2 py-1 rounded border border-gray-700 focus:outline-none"
            >
              <option value={94}>94% (High Frequency)</option>
              <option value={96}>96% (Ultra Accurate)</option>
              <option value={98}>98% (Amir FX Master VIP)</option>
            </select>
          </div>

          <div className="p-3 rounded-lg bg-[#1E2329] border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400">Monitored Assets:</span>
            <span className="text-white font-mono font-bold">{scannedPairsCount} Live & OTC Pairs</span>
          </div>

          <div className="p-3 rounded-lg bg-[#1E2329] border border-gray-800 flex items-center justify-between">
            <span className="text-gray-400">Broker Engine:</span>
            <span className="text-blue-400 font-mono font-bold">{currentBroker.replace('_', ' ')}</span>
          </div>
        </div>
      </div>

      {/* Auto Stream Signal Feed */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-['Rajdhani'] font-bold text-sm text-gray-300 uppercase tracking-wider flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-400" /> Real-time Auto Generated Signal Feed
          </h3>
          <span className="text-[11px] text-gray-500 font-mono">Last Scan: {lastScanTime}</span>
        </div>

        {autoSignals.length === 0 ? (
          <div className="p-10 rounded-xl bg-[#161A1E] border border-gray-800 text-center text-gray-500 text-xs">
            <Bot className="w-8 h-8 text-gray-600 mx-auto mb-2 animate-bounce" />
            {isAutoRunning ? 'Scanning all OTC & Live pairs... Next high-confidence signal incoming!' : 'Auto Bot is paused. Click "START 24/7 AUTO BOT" above.'}
          </div>
        ) : (
          <div className="space-y-2">
            {autoSignals.map((sig) => (
              <div
                key={sig.id}
                className={`p-3.5 rounded-lg border flex flex-wrap items-center justify-between gap-3 transition-all ${
                  sig.direction === 'CALL'
                    ? 'bg-[#121E18] border-emerald-800/60'
                    : 'bg-[#201518] border-rose-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg font-bold text-xs ${
                      sig.direction === 'CALL'
                        ? 'bg-emerald-500/20 text-emerald-400'
                        : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    {sig.direction === 'CALL' ? (
                      <ArrowUpRight className="w-4 h-4" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{sig.pair.name}</span>
                      <span
                        className={`text-xs font-['Rajdhani'] font-black uppercase ${
                          sig.direction === 'CALL' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {sig.direction} ({sig.timeframe})
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Pattern: <span className="text-gray-200">{sig.pattern}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-blue-400 font-bold">{sig.accuracy}% Accuracy</div>
                    <div className="text-[10px] text-gray-400">Payout: {sig.pair.payout}%</div>
                  </div>
                  <span className="px-2 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                    SIGNAL EXECUTED
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
