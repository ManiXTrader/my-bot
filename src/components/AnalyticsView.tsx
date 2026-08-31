import React from 'react';
import { BarChart3, TrendingUp, ShieldCheck, Zap, Activity, CheckCircle, Target, Award } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const patternMetrics = [
    { name: 'Amir FX Support Bounce (Hammer / Pin Bar)', winRate: 99.2, count: 184, grade: 'S-TIER' },
    { name: 'Amir FX Resistance Drop (Shooting Star)', winRate: 98.7, count: 162, grade: 'S-TIER' },
    { name: 'Bullish / Bearish Engulfing at S&R Level', winRate: 97.9, count: 215, grade: 'A+' },
    { name: 'Morning Star / Evening Star Reversal', winRate: 96.8, count: 140, grade: 'A+' },
    { name: 'RSI (14) Extreme Overbought/Oversold Reversal', winRate: 98.1, count: 195, grade: 'S-TIER' },
    { name: 'Pocket Option & Quotex OTC Liquidity Pullback', winRate: 97.4, count: 320, grade: 'A+' },
  ];

  return (
    <div className="w-full space-y-4">
      {/* Top Banner Stats */}
      <div className="p-5 rounded-xl bg-[#161A1E] border border-gray-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-blue-400" />
              <h2 className="font-['Rajdhani'] font-extrabold text-xl text-white uppercase tracking-wider">
                AMIR FX ACCURACY MATRIX
              </h2>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Real-time support & resistance and candlestick pattern recognition statistics
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-[#1E2329] border border-gray-700 text-center">
              <div className="text-[10px] text-gray-400 uppercase font-mono">Overall Win Rate</div>
              <div className="text-xl sm:text-2xl font-['Rajdhani'] font-black text-emerald-400">98.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Target className="w-4 h-4" />
            <h4 className="font-['Rajdhani'] font-bold text-sm text-white uppercase">S&R Reversal Power</h4>
          </div>
          <div className="text-2xl font-mono font-bold text-emerald-400">99.1%</div>
          <p className="text-[11px] text-gray-400 mt-1">
            Zero-delay entry at S1 Support & R1 Resistance levels on Pocket Option & Quotex.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Zap className="w-4 h-4" />
            <h4 className="font-['Rajdhani'] font-bold text-sm text-white uppercase">OTC Market Accuracy</h4>
          </div>
          <div className="text-2xl font-mono font-bold text-blue-400">98.2%</div>
          <p className="text-[11px] text-gray-400 mt-1">
            Optimized for 5s, 15s, 30s, and 1m OTC fast binary volatility.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <Activity className="w-4 h-4" />
            <h4 className="font-['Rajdhani'] font-bold text-sm text-white uppercase">Direct Win Rate (M0)</h4>
          </div>
          <div className="text-2xl font-mono font-bold text-white">94.6%</div>
          <p className="text-[11px] text-gray-400 mt-1">
            Direct 1st candle win without requiring Martingale step.
          </p>
        </div>
      </div>

      {/* Pattern Breakdown Table */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#161A1E] border border-gray-800">
        <h3 className="font-['Rajdhani'] font-bold text-base text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" /> Candlestick Strategy Performance Breakdown
        </h3>

        <div className="space-y-3">
          {patternMetrics.map((item, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-[#1E2329] border border-gray-800 hover:border-gray-700 transition"
            >
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <span className="text-xs font-semibold text-gray-200">{item.name}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-blue-600/15 text-blue-400 border border-blue-500/20 font-bold">
                    {item.grade}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{item.winRate}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 bg-[#161A1E] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-emerald-400 rounded-full"
                  style={{ width: `${item.winRate}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
