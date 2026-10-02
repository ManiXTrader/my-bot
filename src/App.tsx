/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';

import {
  ActiveTab,
  BrokerType,
  Candlestick,
  LicenseData,
  MarketType,
  TradeSignal,
  TradingPair,
} from './types';

import { TRADING_PAIRS } from './data/pairs';

import {
  getSavedLicense,
  revokeLicense,
} from './utils/license';

import {
  generateInitialCandles,
  calculateSupportResistance,
} from './utils/marketEngine';

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
  const [license, setLicense] =
    useState<LicenseData | null>(null);

  const [isCheckingAuth, setIsCheckingAuth] =
    useState(true);

  const [currentBroker, setCurrentBroker] =
    useState<BrokerType>('POCKET_OPTION');

  const [currentMarket, setCurrentMarket] =
    useState<MarketType>('OTC');

  const [selectedPair, setSelectedPair] =
    useState<TradingPair>(TRADING_PAIRS[0]);

  const [candles, setCandles] =
    useState<Candlestick[]>([]);

  const [activeTab, setActiveTab] =
    useState<ActiveTab>('dashboard');

  const [tradeHistory, setTradeHistory] =
    useState<TradeSignal[]>([]);

  const [totalProfit, setTotalProfit] =
    useState(0);

  const [isSettingsOpen, setIsSettingsOpen] =
    useState(false);

  const [showAllPairsModal, setShowAllPairsModal] =
    useState(false);

  /* --------------------------------
     LICENSE / AUTH
  -------------------------------- */

  useEffect(() => {
    try {
      const savedLicense = getSavedLicense();

      if (savedLicense) {
        setLicense(savedLicense);
      }
    } catch (error) {
      console.error(
        'License initialization error:',
        error
      );
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  /* --------------------------------
     INITIAL CANDLES
  -------------------------------- */

  useEffect(() => {
    try {
      const initialCandles =
        generateInitialCandles(
          selectedPair,
          35
        );

      setCandles(initialCandles);
    } catch (error) {
      console.error(
        'Candle initialization error:',
        error
      );

      setCandles([]);
    }
  }, [selectedPair]);

  /* --------------------------------
     REAL-TIME CANDLE SIMULATION
  -------------------------------- */

  useEffect(() => {
    if (!license || candles.length === 0) {
      return;
    }

    const interval = window.setInterval(() => {
      setCandles((previousCandles) => {
        if (
          previousCandles.length === 0
        ) {
          return previousCandles;
        }

        const last =
          previousCandles[
            previousCandles.length - 1
          ];

        const spread =
          selectedPair.currentPrice * 0.0006;

        const delta =
          (Math.random() - 0.49) * spread;

        const decimals =
          selectedPair.currentPrice > 50
            ? 2
            : 5;

        const newClose = Number(
          (
            last.close + delta
          ).toFixed(decimals)
        );

        const updatedLast: Candlestick = {
          ...last,

          close: newClose,

          high: Math.max(
            last.high,
            newClose
          ),

          low: Math.min(
            last.low,
            newClose
          ),

          volume:
            last.volume +
            Math.floor(
              Math.random() * 20
            ),
        };

        /*
         * Occasionally create a new candle.
         */
        if (Math.random() > 0.8) {
          const newCandle: Candlestick = {
            time: Date.now(),
            open: newClose,
            close: newClose,
            high: newClose,
            low: newClose,
            volume:
              Math.floor(
                Math.random() * 200
              ) + 50,
          };

          return [
            ...previousCandles.slice(1),
            newCandle,
          ];
        }

        return [
          ...previousCandles.slice(
            0,
            -1
          ),
          updatedLast,
        ];
      });
    }, 2500);

    return () => {
      window.clearInterval(interval);
    };
  }, [
    license,
    selectedPair,
    candles.length,
  ]);

  /* --------------------------------
     LICENSE SUCCESS
  -------------------------------- */

  const handleLicenseSuccess = (
    validLicense: LicenseData
  ) => {
    setLicense(validLicense);
  };

  /* --------------------------------
     LOGOUT
  -------------------------------- */

  const handleLogout = () => {
    try {
      revokeLicense();
    } catch (error) {
      console.error(
        'License revoke error:',
        error
      );
    }

    setLicense(null);
    setIsSettingsOpen(false);
  };

  /* --------------------------------
     TRADE RESULT
  -------------------------------- */

  const handleSignalResult = (
    signal: TradeSignal,
    _won: boolean,
    profit: number
  ) => {
    setTradeHistory((previous) => [
      signal,
      ...previous,
    ]);

    setTotalProfit(
      (previous) =>
        Number(
          (
            previous + profit
          ).toFixed(2)
        )
    );
  };

  /* --------------------------------
     LOADING SCREEN
  -------------------------------- */

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen w-full bg-[#0B0E11] flex items-center justify-center text-blue-400 font-sans">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />

          <span className="tracking-wider text-slate-200 font-bold text-sm">
            INITIALIZING MANI SIGNALS AI BOT...
          </span>
        </div>
      </div>
    );
  }

  /* --------------------------------
     LICENSE SCREEN
  -------------------------------- */

  if (!license) {
    return (
      <LicenseScreen
        onSuccess={handleLicenseSuccess}
      />
    );
  }

  /* --------------------------------
     SUPPORT / RESISTANCE
  -------------------------------- */

  const supportResistance =
    candles.length > 0
      ? calculateSupportResistance(
          candles
        )
      : null;

  /* --------------------------------
     MAIN DASHBOARD
  -------------------------------- */

  return (
    <div className="min-h-screen w-full bg-[#0B0E11] text-[#EAECEF] font-sans pb-28">

      {/* HEADER */}
      <Header
        currentBroker={currentBroker}
        onSelectBroker={setCurrentBroker}
        license={license}
        onLogout={handleLogout}
        onOpenSettings={() =>
          setIsSettingsOpen(true)
        }
        totalProfit={totalProfit}
      />

      {/* MARKET TICKER */}
     <MarqueeTicker
  pairs={TRADING_PAIRS}
  selectedPair={selectedPair}
  onSelectPair={setSelectedPair}
/>

      {/* MAIN CONTENT */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4">

        {activeTab === 'dashboard' && (
          <div className="space-y-4">

            {/* CHART */}

            {candles.length > 0 &&
              supportResistance && (
                <CandleChart
                  pair={selectedPair}
                  candles={candles}
                  supportResistance={
                    supportResistance
                  }
                  onOpenPairsModal={() =>
                    setShowAllPairsModal(
                      true
                    )
                  }
                />
              )}

            {/* SIGNAL ENGINE */}

            <SignalEngine
              currentBroker={currentBroker}
              onSelectBroker={
                setCurrentBroker
              }
              selectedPair={selectedPair}
              onSelectPair={
                setSelectedPair
              }
              currentMarket={currentMarket}
              onSelectMarket={
                setCurrentMarket
              }
              candles={candles}
              onSignalResult={
                handleSignalResult
              }
            />

            {/* AUTO SCANNER */}

            <BotAutoScanner
              currentBroker={
                currentBroker
              }
              onTradeSignal={
                handleSignalResult
              }
            />

          </div>
        )}

        {/* HISTORY */}

        {activeTab === 'history' && (
          <TradeHistory
            history={tradeHistory}
            onClearHistory={() =>
              setTradeHistory([])
            }
          />
        )}

        {/* ANALYTICS */}

        {activeTab === 'analytics' && (
          <AnalyticsView
            tradeHistory={
              tradeHistory
            }
            totalProfit={
              totalProfit
            }
          />
        )}

      </main>

      {/* BOTTOM NAVIGATION */}

      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* SETTINGS */}

      {isSettingsOpen && (
        <SettingsModal
          onClose={() =>
            setIsSettingsOpen(false)
          }
          currentBroker={
            currentBroker
          }
          onSelectBroker={
            setCurrentBroker
          }
          currentMarket={
            currentMarket
          }
          onSelectMarket={
            setCurrentMarket
          }
        />
      )}

      {/* ALL PAIRS */}

      {showAllPairsModal && (
        <AllPairsModal
          isOpen={
            showAllPairsModal
          }
          onClose={() =>
            setShowAllPairsModal(
              false
            )
          }
          selectedPair={
            selectedPair
          }
          onSelectPair={(pair) => {
            setSelectedPair(pair);

            setShowAllPairsModal(
              false
            );
          }}
          currentMarket={
            currentMarket
          }
          onSelectMarket={
            setCurrentMarket
          }
        />
      )}

    </div>
  );
}
