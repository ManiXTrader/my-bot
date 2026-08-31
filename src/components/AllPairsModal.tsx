import React, { useState, useMemo } from 'react';
import { TradingPair, MarketType, AssetCategory } from '../types';
import { TRADING_PAIRS } from '../data/pairs';
import { soundFx } from '../utils/audio';
import {
  Search,
  X,
  TrendingUp,
  TrendingDown,
  Percent,
  Award,
  Sparkles,
  Zap,
  Globe,
  Boxes,
  Layers,
  Check,
  Flame,
  ArrowUpDown,
} from 'lucide-react';

interface AllPairsModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPair: TradingPair;
  onSelectPair: (pair: TradingPair) => void;
  currentMarket: MarketType;
  onSelectMarket?: (market: MarketType) => void;
}

export const AllPairsModal: React.FC<AllPairsModalProps> = ({
  isOpen,
  onClose,
  selectedPair,
  onSelectPair,
  currentMarket,
  onSelectMarket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('ALL');
  const [marketFilter, setMarketFilter] = useState<'ALL' | 'OTC' | 'LIVE'>(currentMarket);
  const [sortBy, setSortBy] = useState<'PAYOUT' | 'ACCURACY' | 'CHANGE' | 'NAME'>('PAYOUT');

  // Categories definitions
  const categories: { id: AssetCategory; label: string; count: number }[] = useMemo(() => {
    const counts: Record<string, number> = { ALL: TRADING_PAIRS.length };
    TRADING_PAIRS.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return [
      { id: 'ALL', label: 'All Assets', count: counts['ALL'] || 0 },
      { id: 'FOREX', label: 'Forex Pairs', count: counts['FOREX'] || 0 },
      { id: 'COMMODITIES', label: 'Commodities / Gold', count: counts['COMMODITIES'] || 0 },
      { id: 'CRYPTO', label: 'Crypto Assets', count: counts['CRYPTO'] || 0 },
      { id: 'STOCKS', label: 'Global Stocks', count: counts['STOCKS'] || 0 },
      { id: 'INDICES', label: 'Stock Indices', count: counts['INDICES'] || 0 },
    ];
  }, []);

  // Filter and sort pairs
  const filteredPairs = useMemo(() => {
    return TRADING_PAIRS.filter((pair) => {
      // Market filter
      if (marketFilter !== 'ALL' && pair.type !== marketFilter) return false;

      // Category filter
      if (selectedCategory !== 'ALL' && pair.category !== selectedCategory) return false;

      // Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesName = pair.name.toLowerCase().includes(query);
        const matchesBase = pair.base.toLowerCase().includes(query);
        const matchesQuote = pair.quote.toLowerCase().includes(query);
        const matchesCat = pair.category.toLowerCase().includes(query);
        if (!matchesName && !matchesBase && !matchesQuote && !matchesCat) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'PAYOUT') return b.payout - a.payout;
      if (sortBy === 'ACCURACY') return b.winRate - a.winRate;
      if (sortBy === 'CHANGE') return Math.abs(b.change24h) - Math.abs(a.change24h);
      return a.name.localeCompare(b.name);
    });
  }, [marketFilter, selectedCategory, searchQuery, sortBy]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-3xl max-h-[90vh] bg-[#161A1E] border border-gray-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-gray-200 animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-800 flex items-center justify-between bg-[#1A1F24]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-['Rajdhani'] font-extrabold text-lg sm:text-xl text-white uppercase tracking-wider">
                  ALL ASSET MARKET PAIRS
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-600/20 text-blue-400 text-xs font-mono font-bold border border-blue-500/30">
                  {filteredPairs.length} Available
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Pocket Option, Quotex, IQ Option & Binomo OTC + Live Forex Pairs
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-2 rounded-lg bg-[#1E2329] border border-gray-700 hover:border-gray-500 text-gray-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Market Selector Row */}
        <div className="p-4 border-b border-gray-800 bg-[#161A1E] space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2.5">
            {/* Search Input */}
            <div className="relative w-full flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search any pair (e.g. INR, PKR, EUR, GOLD, BTC, OTC)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-[#1E2329] border border-gray-700 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition font-mono"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Market Switcher Buttons */}
            <div className="flex items-center gap-1.5 w-full sm:w-auto self-stretch">
              {(['ALL', 'OTC', 'LIVE'] as ('ALL' | 'OTC' | 'LIVE')[]).map((m) => (
                <button
                  key={m}
                  onClick={() => {
                    soundFx.playClick();
                    setMarketFilter(m);
                    if (m !== 'ALL' && onSelectMarket) onSelectMarket(m);
                  }}
                  className={`flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-['Rajdhani'] font-bold uppercase tracking-wider transition cursor-pointer border ${
                    marketFilter === m
                      ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-900/30'
                      : 'bg-[#1E2329] text-gray-400 border-gray-700 hover:text-white hover:border-gray-600'
                  }`}
                >
                  {m === 'ALL' ? 'ALL MARKETS' : m === 'OTC' ? '⚡ OTC ONLY' : '🌐 LIVE ONLY'}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  soundFx.playClick();
                  setSelectedCategory(cat.id);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-blue-600 text-white font-bold'
                    : 'bg-[#1E2329] text-gray-400 hover:text-gray-200 border border-gray-800'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedCategory === cat.id ? 'bg-blue-800 text-white' : 'bg-[#161A1E] text-gray-500'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Sort bar */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
            <span className="text-[11px] font-mono">
              Showing <strong className="text-white">{filteredPairs.length}</strong> trading pairs
            </span>

            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase tracking-wider text-gray-500">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#1E2329] border border-gray-700 text-xs text-blue-400 font-semibold rounded-md px-2 py-1 focus:outline-none cursor-pointer"
              >
                <option value="PAYOUT">Highest Payout (96% - 85%)</option>
                <option value="ACCURACY">Highest Accuracy (99% - 94%)</option>
                <option value="CHANGE">Highest 24h Volatility</option>
                <option value="NAME">Alphabetical (A - Z)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pairs List Grid (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-4 max-h-[480px] divide-y divide-gray-800/80">
          {filteredPairs.length === 0 ? (
            <div className="py-12 text-center text-gray-500 text-xs space-y-2">
              <p>No trading pairs found matching "{searchQuery}" in {selectedCategory} category.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setMarketFilter('ALL');
                }}
                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {filteredPairs.map((pair) => {
                const isSelected = selectedPair.id === pair.id;
                const isHighPayout = pair.payout >= 93;
                const isHighAcc = pair.winRate >= 98;

                return (
                  <div
                    key={pair.id}
                    onClick={() => {
                      soundFx.playClick();
                      onSelectPair(pair);
                      if (onSelectMarket && pair.type !== currentMarket) {
                        onSelectMarket(pair.type);
                      }
                      onClose();
                    }}
                    className={`p-3 rounded-xl border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer group ${
                      isSelected
                        ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-900/20'
                        : 'bg-[#1E2329] border-gray-800 hover:border-gray-700 hover:bg-[#222830]'
                    }`}
                  >
                    {/* Left Pair Meta */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs font-mono border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-400'
                            : pair.type === 'OTC'
                            ? 'bg-blue-950/40 text-blue-400 border-blue-800/40'
                            : 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40'
                        }`}
                      >
                        {pair.base.slice(0, 3)}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-['Rajdhani'] font-bold text-sm text-white group-hover:text-blue-400 transition truncate">
                            {pair.name}
                          </span>
                          {pair.type === 'OTC' && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                              OTC
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono mt-0.5">
                          <span className="text-gray-300">
                            {pair.currentPrice > 50 ? pair.currentPrice.toFixed(2) : pair.currentPrice.toFixed(4)}
                          </span>
                          <span className="text-gray-600">•</span>
                          <span className={pair.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                            {pair.change24h >= 0 ? '+' : ''}{pair.change24h.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right Badges (Payout & Win Rate) */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right font-mono">
                        <div className="flex items-center justify-end gap-1">
                          {isHighPayout && <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                          <span
                            className={`text-xs font-bold px-2 py-0.5 rounded border ${
                              isHighPayout
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-700/60 font-black'
                                : 'bg-[#161A1E] text-gray-300 border-gray-700'
                            }`}
                          >
                            {pair.payout}%
                          </span>
                        </div>
                        <div className="text-[10px] text-blue-400 font-semibold mt-0.5">
                          {pair.winRate}% Acc.
                        </div>
                      </div>

                      {isSelected ? (
                        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-transparent group-hover:bg-[#161A1E] flex items-center justify-center text-gray-500 group-hover:text-blue-400 transition">
                          →
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 sm:p-4 border-t border-gray-800 bg-[#1A1F24] flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">
              Selected: <strong className="text-white font-mono">{selectedPair.name}</strong> ({selectedPair.payout}% Payout • {selectedPair.winRate}% Accuracy)
            </span>
          </div>

          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-['Rajdhani'] font-bold text-xs uppercase tracking-wider transition cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
