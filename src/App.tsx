/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, BrokerType, Candlestick, LicenseData, MarketType, TradeSignal, TradingPair, TradingMode } from './types';
import { TRADING_PAIRS } from './data/pairs';
import { getSavedLicense, revokeLicense } from './utils/license';
import { generateInitialCandles, calculateSupportResistance } from './utils/marketEngine';
import { LicenseScreen } from './components/LicenseScreen';
import { Header } from './components/Header';
import { MarqueeTicker } from './components/MarqueeTicker';
import { SignalEngine } from './components/SignalEngine';
import { CandleChart } from './components/CandleChart';
import { BotAutoScanner } from './components/BotAutoScanner';
import { TradeHistory } from './components/TradeHistory';
import { AnalyticsView } from './components/AnalyticsView';
import { SettingsModal } from './components/SettingsModal';
import { AllPairsModal } from './components/AllPairsModal';
import { BottomNav } from './components/BottomNav';

export default function App() {
  const [license, setLicense] = useState<LicenseData | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Active Trading state
  const [currentBroker, setCurrentBroker] = useState<BrokerType>('POCKET_OPTION');
  const [currentMarket, setCurrentMarket] = useState<MarketType>('OTC');
  
  const [selectedPair, setSelectedPair] = useState<TradingPair>(TRADING_PAIRS[0]);
  const [candles, setCandles] = useState<Candlestick[]>(() => generateInitialCandles(TRADING_PAIRS[0], 35));
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [tradeHistory, setTradeHistory] = useState<TradeSignal[]>([]);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showAllPairsModal, setShowAllPairsModal] = useState(false);

  // Check saved license on mount
  useEffect(() => {
    const saved = getSavedLicense();
    if (saved) {
      setLicense(saved);
    }
    setIsCheckingAuth(false);
  }, []);

  // Update candles when selected pair changes
  useEffect(() => {
    setCandles(generateInitialCandles(selectedPair, 35));
  }, [selectedPair]);

  // Live real-time tick engine (updates candles and current price every 3.5 seconds)
  useEffect(() => {
    if (!license) return;

    const tickInterval = setInterval(() => {
      setCandles((prevCandles) => {
        if (!prevCandles.length) return prevCandles;
        const last = prevCandles[prevCandles.length - 1];
        const spread = selectedPair.currentPrice * 0.0006;
        const delta = (Math.random() - 0.49) * spread;
        const newClose = +(last.close + delta).toFixed(selectedPair.currentPrice > 50 ? 2 : 5);
        const newHigh = Math.max(last.high, newClose);
        const newLow = Math.min(last.low, newClose);

        // Update last candle in-place
        const updatedLast = {
          ...last,
          close: newClose,
          high: newHigh,
          low: newLow,
          volume: last.volume + Math.floor(Math.random() * 20),
        };

        // Every 6 ticks, push a brand new candle
        if (Math.random() > 0.8) {
          const newCandle: Candlestick = {
            time: Date.now(),
            open: newClose,
            close: newClose,
            high: newClose,
            low: newClose,
            volume: Math.floor(Math.random() * 200) + 50,
          };
          return [...prevCandles.slice(1), newCandle];
        }

        return [...prevCandles.slice(0, -1), updatedLast];
      });
    }, 2500);

    return () => clearInterval(tickInterval);
  }, [license, selectedPair]);

  const handleLicenseSuccess = (validLicense: LicenseData) => {
    setLicense(validLicense);
  };

  const handleLogout = () => {
    revokeLicense();
    setLicense(null);
    setIsSettingsOpen(false);
  };

  const handleSignalResult = (signal: TradeSignal, won: boolean, profit: number) => {
    setTradeHistory((prev) => [signal, ...prev]);
    setTotalProfit((prev) => +(prev + profit).toFixed(2));
  };

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#0B0E11] flex items-center justify-center text-blue-400 font-['Rajdhani'] font-bold text-lg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <span className="tracking-wider text-slate-200">INITIALIZING MANI SIGNALS AI BOT...</span>
        </div>
      </div>
    );
  }

  // If no active license, render the locked License Screen (Screenshot 1)
  if (!license) {
    return <LicenseScreen onSuccess={handleLicenseSuccess} />;
  }

  const supportResistance = calculateSupportResistance(candles);

  return (
    <div className="min-h-screen w-full bg-[#0B0E11] text-[#EAECEF] font-sans pb-28 selection:bg-blue-600/30 selection:text-blue-200">
      {/* 1. Header */}
      <Header
       
      />
    </div>
  );
}
