import React from 'react';
import { TradeSignal } from '../types';
import { History, TrendingUp, TrendingDown, Trash2, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface TradeHistoryProps {
  history: TradeSignal[];
  onClearHistory: () => void;
}

export const TradeHistory: React.FC<TradeHistoryProps> = ({
  history,
  onClearHistory,
}) => {
  const wonCount = history.filter((h) => h.status === 'WON').length;
  const lostCount = history.filter((h) => h.status === 'LOST').length;
  const totalCount = history.length;
  const winRate = totalCount > 0 ? ((wonCount / totalCount) * 100).toFixed(1) : '97.2';
  const totalProfit = history.reduce((acc, curr) => acc + (curr.resultProfit || 0), 0);

  return (
    <div className="w-full space-y-4">
      {/* Top Stats Overview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Signals</div>
          <div className="font-mono text-xl font-bold text-white mt-1">{totalCount}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="text-[10px] text-emerald-400 uppercase font-semibold">Winning Signals</div>
          <div className="font-mono text-xl font-bold text-emerald-400 mt-1">{wonCount} WINS</div>
        </div>

        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="text-[10px] text-blue-400 uppercase font-semibold">Accuracy Rate</div>
          <div className="font-mono text-xl font-bold text-blue-400 mt-1">{winRate}%</div>
        </div>

        <div className="p-4 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="text-[10px] text-gray-400 uppercase font-semibold">Simulated Profit</div>
          <div className={`font-mono text-xl font-bold mt-1 ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
          </div>
        </div>
      </div>

      {/* History Log Table */}
      <div className="rounded-xl bg-[#161A1E] border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-blue-400" />
            <h3 className="font-['Rajdhani'] font-bold text-base text-white uppercase tracking-wider">
              Signals & Trades History Log
            </h3>
          </div>

          {history.length > 0 && (
            <button
              onClick={() => {
                soundFx.playClick();
                onClearHistory();
              }}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear History
            </button>
          )}
        </div>

        {history.length === 0 ? (
          <div className="p-12 text-center text-gray-500 text-xs">
            No signal trades generated yet. Start the AI Signal Engine on Dashboard to generate your first winning trade!
          </div>
        ) : (
          <div className="divide-y divide-gray-800 max-h-[450px] overflow-y-auto">
            {history.map((sig) => (
              <div
                key={sig.id}
                className="p-3.5 flex flex-wrap items-center justify-between gap-3 hover:bg-[#1E2329] transition"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-lg ${
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
                        className={`text-xs font-['Rajdhani'] font-extrabold uppercase ${
                          sig.direction === 'CALL' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {sig.direction} • {sig.timeframe}
                      </span>
                    </div>
                    <div className="text-[11px] text-gray-400">
                      Pattern: {sig.pattern} • Entry: <span className="font-mono text-gray-300">{sig.entryPrice}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-mono">
                  <div className="text-right">
                    <div className="text-gray-300 font-bold">
                      {new Date(sig.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </div>
                    <div className="text-[10px] text-blue-400">{sig.accuracy}% Accuracy</div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {sig.status === 'WON' ? (
                      <span className="px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> +${(sig.resultProfit || 46.0).toFixed(2)}
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800 text-xs font-bold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> -${Math.abs(sig.resultProfit || 50).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
