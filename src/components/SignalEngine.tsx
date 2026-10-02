```tsx
import React, { useEffect, useState } from 'react';
import {
  BrokerType,
  MarketType,
  TimeFrame,
  TradeSignal,
  TradingPair,
  Candlestick,
} from '../types';

import { TRADING_PAIRS } from '../data/pairs';
import {
  generateSignal,
  timeframeToSeconds,
} from '../utils/marketEngine';

import { soundFx } from '../utils/audio';
import { AllPairsModal } from './AllPairsModal';

import confetti from 'canvas-confetti';

import {
  Boxes,
  Globe,
  Zap,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Clock,
  ShieldAlert,
  ChevronDown,
  Activity,
  Layers,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Bot,
  Play,
  Search,
  Flame,
  Grid,
} from 'lucide-react';

interface SignalEngineProps {
  currentBroker: BrokerType;
  onSelectBroker: (broker: BrokerType) => void;

  selectedPair: TradingPair;
  onSelectPair: (pair: TradingPair) => void;

  currentMarket: MarketType;
  onSelectMarket: (market: MarketType) => void;

  candles: Candlestick[];

  onSignalResult: (
    signal: TradeSignal,
    won: boolean,
    profit: number
  ) => void;
}

export const SignalEngine: React.FC<SignalEngineProps> = ({
  currentBroker,
  onSelectBroker,
  selectedPair,
  onSelectPair,
  currentMarket,
  onSelectMarket,
  candles,
  onSignalResult,
}) => {
  const [timeframe, setTimeframe] =
    useState<TimeFrame>('1m');

  const [scanning, setScanning] =
    useState(false);

  const [scanStep, setScanStep] =
    useState(0);

  const [currentSignal, setCurrentSignal] =
    useState<TradeSignal | null>(null);

  const [countdown, setCountdown] =
    useState<number | null>(null);

  const [activeTradeSim, setActiveTradeSim] =
    useState<{
      entryPrice: number;
      investment: number;
      timeRemaining: number;
    } | null>(null);

  const [showPairDropdown, setShowPairDropdown] =
    useState(false);

  const [showAllPairsModal, setShowAllPairsModal] =
    useState(false);

  const [tradeAmount, setTradeAmount] =
    useState(50);

  const filteredPairs =
    TRADING_PAIRS.filter(
      (pair) => pair.type === currentMarket
    );

  const scanMessages = [
    'Scanning Live Tick Feed & Volatility...',
    'Calculating Support & Resistance (S1/R1 Zones)...',
    'Amir FX Candlestick Pattern Recognition...',
    'Confirming RSI Momentum & Stochastic Cross...',
    'Generating High-Probability Signal...',
  ];

  /*
   * Start AI scan
   */
  const handleStartScan = () => {
    if (scanning || activeTradeSim) {
      return;
    }

    if (!candles || candles.length === 0) {
      return;
    }

    try {
      soundFx.playScan();
    } catch {
      // Ignore sound errors
    }

    setScanning(true);
    setScanStep(0);
    setCurrentSignal(null);
    setCountdown(null);

    let currentStep = 0;

    const stepInterval = window.setInterval(() => {
      currentStep += 1;

      if (currentStep < scanMessages.length) {
        setScanStep(currentStep);

        try {
          soundFx.playScan();
        } catch {
          // Ignore sound errors
        }
      } else {
        window.clearInterval(stepInterval);
      }
    }, 450);

    window.setTimeout(() => {
      window.clearInterval(stepInterval);

      try {
        const signal = generateSignal(
          selectedPair,
          candles,
          timeframe,
          currentBroker
        );

        setScanning(false);
        setCurrentSignal(signal);

        try {
          if (signal.direction === 'CALL') {
            soundFx.playSignalCall();
          } else {
            soundFx.playSignalPut();
          }
        } catch {
          // Ignore sound errors
        }

        const seconds =
          timeframeToSeconds(timeframe);

        setCountdown(seconds);

        setActiveTradeSim({
          entryPrice: signal.entryPrice,
          investment: tradeAmount,
          timeRemaining: seconds,
        });
      } catch (error) {
        console.error(
          'Signal generation error:',
          error
        );

        setScanning(false);
        setCurrentSignal(null);
      }
    }, 2400);
  };

  /*
   * Trade expiry / demo result
   */
  useEffect(() => {
    if (
      countdown === null ||
      countdown <= 0 ||
      !currentSignal ||
      !activeTradeSim
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      setCountdown((previous) => {
        if (
          previous === null ||
          previous <= 1
        ) {
          window.clearInterval(timer);

          /*
           * Demo result only.
           * This does NOT connect to a broker.
           */
          const isWin =
            Math.random() < 0.94;

          const profit = isWin
            ? activeTradeSim.investment *
              (selectedPair.payout / 100)
            : -activeTradeSim.investment;

          if (isWin) {
            try {
              soundFx.playWin();
            } catch {
              // Ignore sound errors
            }

            try {
              confetti({
                particleCount: 75,
                spread: 70,
                origin: {
                  y: 0.7,
                },
              });
            } catch {
              // Ignore confetti errors
            }
          }

          const completedSignal: TradeSignal = {
            ...currentSignal,
            status: isWin
              ? 'WON'
              : 'LOST',
            resultProfit: profit,
          };

          onSignalResult(
            completedSignal,
            isWin,
            profit
          );

          setActiveTradeSim(null);

          return 0;
        }

        return previous - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    countdown,
    currentSignal,
    activeTradeSim,
    selectedPair,
    onSignalResult,
  ]);

  /*
   * Broker display name
   */
  const getBrokerName = (
    broker: BrokerType
  ) => {
    switch (broker) {
      case 'POCKET_OPTION':
        return 'POCKET OPTION';

      case 'QUOTEX':
        return 'QUOTEX';

      case 'IQ_OPTION':
        return 'IQ OPTION';

      case 'BINOMO':
        return 'BINOMO';

      case 'FOREX':
        return 'FOREX MT4/MT5';

      default:
        return 'TRADING PLATFORM';
    }
  };

  return (
    <div className="w-full space-y-4">

      {/* =====================================================
          MARKET SELECTION
      ====================================================== */}

      <div className="grid grid-cols-2 gap-3">

        {/* OTC */}
        <button
          type="button"
          onClick={() => {
            try {
              soundFx.playClick();
            } catch {}

            onSelectMarket('OTC');

            const firstOtc =
              TRADING_PAIRS.find(
                (pair) => pair.type === 'OTC'
              );

            if (firstOtc) {
              onSelectPair(firstOtc);
            }
          }}
          className={`relative p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
            currentMarket === 'OTC'
              ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-900/20 text-white'
              : 'bg-[#161A1E] border-gray-800 hover:border-gray-700 text-gray-400'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg border ${
              currentMarket === 'OTC'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-[#1E2329] border-gray-700 text-gray-400'
            }`}
          >
            <Boxes className="w-5 h-5" />
          </div>

          <div className="text-left">
            <div className="font-['Rajdhani'] font-bold text-sm sm:text-base tracking-wider uppercase">
              OTC MARKET
            </div>

            <div className="text-[11px] text-gray-400 font-mono">
              3s - 15m Fast Binary
            </div>
          </div>

          {currentMarket === 'OTC' && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          )}
        </button>

        {/* LIVE */}
        <button
          type="button"
          onClick={() => {
            try {
              soundFx.playClick();
            } catch {}

            onSelectMarket('LIVE');

            const firstLive =
              TRADING_PAIRS.find(
                (pair) => pair.type === 'LIVE'
              );

            if (firstLive) {
              onSelectPair(firstLive);
            }
          }}
          className={`relative p-3.5 rounded-xl border transition-all duration-200 flex items-center gap-3 cursor-pointer ${
            currentMarket === 'LIVE'
              ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-900/20 text-white'
              : 'bg-[#161A1E] border-gray-800 hover:border-gray-700 text-gray-400'
          }`}
        >
          <div
            className={`p-2.5 rounded-lg border ${
              currentMarket === 'LIVE'
                ? 'bg-blue-600 text-white border-blue-400'
                : 'bg-[#1E2329] border-gray-700 text-gray-400'
            }`}
          >
            <Globe className="w-5 h-5" />
          </div>

          <div className="text-left">
            <div className="font-['Rajdhani'] font-bold text-sm sm:text-base tracking-wider uppercase">
              LIVE MARKET
            </div>

            <div className="text-[11px] text-gray-400 font-mono">
              1m - 15m Forex, Gold & Crypto
            </div>
          </div>

          {currentMarket === 'LIVE' && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
          )}
        </button>
      </div>

      {/* =====================================================
          BROKER + ENGINE STATUS
      ====================================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

        {/* Broker */}
        <div className="p-3.5 rounded-xl bg-[#161A1E] border border-gray-800">
          <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
            TRADING PLATFORM
          </div>

          <div className="relative">

            <button
              type="button"
              onClick={() =>
                setShowPairDropdown(
                  (previous) => !previous
                )
              }
              className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-[#1E2329] border border-gray-700 text-white font-['Rajdhani'] font-bold text-sm tracking-wide hover:border-blue-400 transition cursor-pointer"
            >
              <div className="flex items-center gap-2">

                <div className="w-4 h-4 rounded bg-blue-600 flex items-center justify-center text-[10px] font-black text-white">
                  P
                </div>

                <span>
                  {getBrokerName(currentBroker)}
                </span>
              </div>

              <ChevronDown className="w-4 h-4 text-blue-400" />
            </button>

            {showPairDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#161A1E] border border-gray-700 rounded-lg shadow-2xl z-40 py-1 overflow-hidden">

                {(
                  [
                    'POCKET_OPTION',
                    'QUOTEX',
                    'IQ_OPTION',
                    'BINOMO',
                    'FOREX',
                  ] as BrokerType[]
                ).map((broker) => (
                  <button
                    type="button"
                    key={broker}
                    onClick={() => {
                      try {
                        soundFx.playClick();
                      } catch {}

                      onSelectBroker(broker);
                      setShowPairDropdown(false);
                    }}
                    className={`w-full px-3 py-2 text-left text-xs font-semibold flex items-center justify-between hover:bg-[#1E2329] transition cursor-pointer ${
                      currentBroker === broker
                        ? 'text-blue-400 bg-blue-600/10'
                        : 'text-gray-300'
                    }`}
                  >
                    <span>
                      {getBrokerName(broker)}
                    </span>

                    {currentBroker === broker && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="p-3.5 rounded-xl bg-[#161A1E] border border-gray-800 flex items-center justify-between">

          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold mb-1">
              ENGINE STATUS
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs sm:text-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ONLINE & SYNCHRONIZED
              </span>
            </div>

            <div className="text-[11px] text-gray-400 font-mono mt-0.5">
              Algorithm:{' '}
              <span className="text-gray-200">
                Amir FX Price Action Core
              </span>
            </div>
          </div>

          <div className="flex items-end gap-1 h-6 pr-2">
            <div className="w-1 bg-emerald-400 h-3 rounded-full animate-pulse" />
            <div className="w-1 bg-emerald-400 h-4 rounded-full animate-pulse" />
            <div className="w-1 bg-emerald-400 h-6 rounded-full animate-pulse" />
            <div className="w-1 bg-emerald-400 h-5 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* =====================================================
          PAIR + TIMEFRAME
      ====================================================== */}

      <div className="p-3 rounded-xl bg-[#161A1E] border border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">

        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-thin">

          <button
            type="button"
            onClick={() => {
              try {
                soundFx.playClick();
              } catch {}

              setShowAllPairsModal(true);
            }}
            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-['Rajdhani'] font-extrabold text-xs uppercase tracking-wider shadow-md shadow-blue-900/30 flex items-center gap-1.5 whitespace-nowrap cursor-pointer shrink-0"
          >
            <Grid className="w-3.5 h-3.5" />
            <span>
              ALL PAIRS ({TRADING_PAIRS.length})
            </span>
          </button>

          <span className="w-[1px] h-5 bg-gray-700 mx-1 shrink-0" />

          {filteredPairs
            .slice(0, 7)
            .map((pair) => (
              <button
                type="button"
                key={pair.id}
                onClick={() => {
                  try {
                    soundFx.playClick();
                  } catch {}

                  onSelectPair(pair);
                }}
                className={`px-2.5 py-1 rounded-md text-xs font-mono font-semibold whitespace-nowrap transition cursor-pointer flex items-center gap-1 shrink-0 ${
                  selectedPair.id === pair.id
                    ? 'bg-blue-600 text-white font-bold shadow-sm'
                    : 'bg-[#1E2329] text-gray-300 hover:text-white hover:bg-gray-800 border border-gray-700/60'
                }`}
              >
                <span>{pair.name}</span>

                {pair.payout >= 93 && (
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {pair.payout}%
                  </span>
                )}
              </button>
            ))}

          <button
            type="button"
            onClick={() => {
              try {
                soundFx.playClick();
              } catch {}

              setShowAllPairsModal(true);
            }}
            className="px-2 py-1 rounded-md text-xs font-mono text-blue-400 hover:text-blue-300 bg-[#1E2329] border border-blue-500/30 whitespace-nowrap cursor-pointer shrink-0"
          >
            + More Assets
          </button>
        </div>

        <div className="flex items-center gap-1 shrink-0">

          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider px-1">
            TIMEFRAME:
          </span>

          {(
            [
              '5s',
              '15s',
              '30s',
              '1m',
              '2m',
              '5m',
              '15m',
            ] as TimeFrame[]
          ).map((tf) => (
            <button
              type="button"
              key={tf}
              onClick={() => {
                try {
                  soundFx.playClick();
                } catch {}

                setTimeframe(tf);
              }}
              className={`px-2 py-1 rounded-md text-xs font-mono transition cursor-pointer ${
                timeframe === tf
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-[#1E2329] text-gray-400 hover:text-white border border-gray-700/60'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* =====================================================
          AI SIGNAL ENGINE
      ====================================================== */}

      <div className="w-full rounded-xl bg-[#161A1E] border border-gray-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">

          <div className="flex items-center gap-2.5">

            <div className="p-1.5 rounded-lg bg-blue-600/10 text-blue-400">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>

            <div>

              <div className="font-['Rajdhani'] font-bold text-base sm:text-lg text-white uppercase tracking-wider flex items-center gap-2">
                <span>AI SIGNAL ENGINE</span>

                <span className="text-xs text-blue-400 font-mono font-bold px-2 py-0.5 rounded bg-blue-600/10 border border-blue-500/20">
                  {selectedPair.name}
                </span>
              </div>

              <div className="text-[11px] text-gray-400 font-medium">
                {scanning
                  ? scanMessages[scanStep]
                  : `Analyzing ${selectedPair.category} S&R levels & candlestick patterns...`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">

            <button
              type="button"
              onClick={() =>
                setShowAllPairsModal(true)
              }
              className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1E2329] border border-gray-700 hover:border-blue-400 text-gray-300 hover:text-white text-xs font-mono transition cursor-pointer"
            >
              <Search className="w-3 h-3 text-blue-400" />
              <span>Change Asset</span>
            </button>

            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              AI ENGINE
            </div>
          </div>
        </div>

        {/* Main scanner */}
        <div className="py-6 flex flex-col items-center justify-center min-h-[220px]">

          {/* IDLE */}
          {!scanning && !currentSignal && (
            <div className="flex flex-col items-center text-center">

              <div className="relative w-40 h-40 sm:w-44 sm:h-44 flex items-center justify-center mb-4">

                <div className="absolute inset-0 rounded-full border border-blue-500/20 animate-[spin_12s_linear_infinite]" />

                <div className="absolute inset-2 rounded-full border border-dashed border-gray-700 animate-[spin_8s_linear_infinite_reverse]" />

                <div className="absolute inset-5 rounded-full border border-blue-400/30" />

                <button
                  type="button"
                  onClick={handleStartScan}
                  disabled={candles.length === 0}
                  className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 disabled:opacity-50 disabled:cursor-not-allowed p-[2px] shadow-xl shadow-blue-900/40 active:scale-95 transition-all duration-200 cursor-pointer flex flex-col items-center justify-center group"
                >
                  <div className="w-full h-full rounded-full bg-[#161A1E] flex flex-col items-center justify-center relative overflow-hidden">

                    <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/25 transition" />

                    <Zap className="w-8 h-8 text-blue-400 group-hover:scale-110 transition" />

                    <span className="text-[10px] font-['Rajdhani'] font-extrabold text-white tracking-widest uppercase mt-0.5">
                      GET SIGNAL
                    </span>
                  </div>
                </button>
              </div>

              <div className="font-['Rajdhani'] text-lg font-bold text-white tracking-wider uppercase">
                READY TO SCAN
              </div>

              <p className="text-xs text-gray-400 font-medium mt-0.5">
                Press GET SIGNAL to analyze{' '}
                <strong className="text-blue-400">
                  {selectedPair.name}
                </strong>{' '}
                ({selectedPair.payout}% Payout)
              </p>
            </div>
          )}

          {/* SCANNING */}
          {scanning && (
            <div className="flex flex-col items-center text-center">

              <div className="relative w-40 h-40 flex items-center justify-center mb-4">

                <div className="absolute inset-0 rounded-full border-2 border-blue-500/40 animate-ping opacity-30" />

                <div className="absolute inset-0 rounded-full border border-blue-500 animate-[spin_2s_linear_infinite]">
                  <div className="w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-transparent rounded-tl-full" />
                </div>

                <div className="w-20 h-20 rounded-full bg-[#1E2329] border border-blue-500 flex items-center justify-center shadow-lg shadow-blue-900/40">
                  <Bot className="w-10 h-10 text-blue-400 animate-bounce" />
                </div>
              </div>

              <div className="font-['Rajdhani'] text-base font-bold text-blue-400 tracking-wider uppercase animate-pulse">
                {scanMessages[scanStep]}
              </div>

              <div className="w-48 h-1.5 bg-[#1E2329] rounded-full mt-3 overflow-hidden border border-gray-800">

                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
                  style={{
                    width: `${
                      ((scanStep + 1) /
                        scanMessages.length) *
                      100
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* SIGNAL */}
          {!scanning && currentSignal && (
            <div className="w-full max-w-lg space-y-4 animate-in fade-in zoom-in-95">

              <div
                className={`p-4 sm:p-5 rounded-xl border-2 flex items-center justify-between gap-4 shadow-xl relative overflow-hidden ${
                  currentSignal.direction === 'CALL'
                    ? 'bg-emerald-950/40 border-emerald-500/80 shadow-emerald-950/30'
                    : 'bg-rose-950/40 border-rose-500/80 shadow-rose-950/30'
                }`}
              >

                <div className="flex items-center gap-3.5">

                  <div
                    className={`p-3 rounded-xl border ${
                      currentSignal.direction === 'CALL'
                        ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400'
                        : 'bg-rose-500/20 border-rose-400 text-rose-400'
                    }`}
                  >
                    {currentSignal.direction === 'CALL' ? (
                      <ArrowUpRight className="w-8 h-8" />
                    ) : (
                      <ArrowDownRight className="w-8 h-8" />
                    )}
                  </div>

                  <div>

                    <div className="flex items-center gap-2">

                      <span
                        className={`font-['Rajdhani'] font-black text-2xl sm:text-3xl uppercase tracking-wider ${
                          currentSignal.direction === 'CALL'
                            ? 'text-emerald-
