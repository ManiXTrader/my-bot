import React, { useState, useEffect } from 'react';
import { BrokerType, LicenseData } from '../types';
import { Bot, Volume2, VolumeX, MoreVertical, LogOut, ShieldCheck, Zap, Sparkles, SlidersHorizontal } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeaderProps {
  currentBroker: BrokerType;
  onSelectBroker: (broker: BrokerType) => void;
  license: LicenseData;
  onLogout: () => void;
  onOpenSettings: () => void;
  totalProfit: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentBroker,
  onSelectBroker,
  license,
  onLogout,
  onOpenSettings,
  totalProfit,
}) => {
  const [activeTraders, setActiveTraders] = useState(3428);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showDropdown, setShowDropdown] = useState(false);

  // Fluctuating active traders realistic simulator
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTraders((prev) => prev + (Math.random() > 0.48 ? 1 : -1) * Math.floor(Math.random() * 4 + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundFx.enabled = next;
    if (next) soundFx.playClick();
  };

  const getBrokerLabel = (b: BrokerType) => {
    switch (b) {
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
        return 'POCKET OPTION';
    }
  };

  return (
    <header className="w-full bg-[#161A1E] border-b border-gray-800 sticky top-0 z-30 px-4 sm:px-6 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
        
        {/* Left: Bot Identity & Sleek Gradient Icon */}
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-lg bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-900/30 cursor-pointer hover:opacity-95 transition"
            onClick={onOpenSettings}
            title="Open Bot Settings"
          >
            <span className="text-white font-extrabold text-lg font-['Rajdhani']">M</span>
          </div>

          {/* Titles & Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold tracking-tight text-white font-['Rajdhani'] flex items-center gap-1.5">
                MANI SIGNALS AI BOT
                <span className="text-[10px] bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded tracking-wider uppercase font-mono">PRO</span>
              </h1>
            </div>
            
            <div className="flex items-center gap-2 text-[11px]">
              <span className="text-gray-400 font-medium">
                Advanced Trading Engine • <span className="text-cyan-400 font-bold">{getBrokerLabel(currentBroker)}</span>
              </span>
              <span className="text-gray-600 hidden sm:inline">•</span>
              <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/40">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {activeTraders.toLocaleString()} TRADERS ACTIVE
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active License Status Pill (From Sleek Interface HTML) */}
          <div className="hidden lg:flex items-center bg-[#1E2329] px-3.5 py-1.5 rounded-full border border-emerald-500/30 shadow-inner">
            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse mr-2" />
            <span className="text-xs font-mono text-emerald-400 font-medium">
              LICENSE: {license.key ? license.key.slice(0, 14) + '...' : 'ACTIVE-LOCKED'}
            </span>
          </div>

          {/* Live Profit Counter Pill */}
          <div className="flex items-center px-3 py-1.5 rounded-lg bg-[#1E2329] border border-gray-700/80">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider mr-2 hidden xs:inline">Profit</span>
            <span className={`font-mono text-xs font-bold ${totalProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalProfit >= 0 ? '+' : ''}${totalProfit.toFixed(2)}
            </span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            className="p-2 rounded-lg bg-[#1E2329] border border-gray-700 hover:border-gray-500 text-gray-300 hover:text-white transition cursor-pointer"
            title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-blue-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
          </button>

          {/* Settings & More Menu */}
          <div className="relative">
            <button
              onClick={() => {
                soundFx.playClick();
                setShowDropdown(!showDropdown);
              }}
              className="p-2 rounded-lg bg-[#1E2329] border border-blue-500/40 hover:border-blue-400 text-blue-400 hover:text-white transition cursor-pointer"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {showDropdown && (
              <div 
                className="absolute right-0 mt-2 w-56 rounded-xl bg-[#161A1E] border border-gray-700 shadow-2xl shadow-black/80 py-2 z-50 animate-in fade-in zoom-in-95"
                onClick={() => setShowDropdown(false)}
              >
                <div className="px-3 py-2 border-b border-gray-800">
                  <div className="text-xs font-bold text-white flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                    {license.ownerName}
                  </div>
                  <div className="text-[10px] text-blue-400 font-mono mt-0.5">
                    {license.plan.replace('_', ' ')} • ACTIVE VIP
                  </div>
                </div>

                <div className="py-1">
                  <button
                    onClick={onOpenSettings}
                    className="w-full px-3 py-2 text-left text-xs text-gray-300 hover:text-white hover:bg-[#1E2329] flex items-center gap-2 transition cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                    Bot Engine & S&R Settings
                  </button>

                  <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Switch Broker Platform
                  </div>

                  {(['POCKET_OPTION', 'QUOTEX', 'IQ_OPTION', 'BINOMO', 'FOREX'] as BrokerType[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => {
                        soundFx.playClick();
                        onSelectBroker(b);
                      }}
                      className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition cursor-pointer ${
                        currentBroker === b
                          ? 'text-blue-400 bg-blue-600/10 font-bold'
                          : 'text-gray-400 hover:text-white hover:bg-[#1E2329]'
                      }`}
                    >
                      <span>{getBrokerLabel(b)}</span>
                      {currentBroker === b && <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />}
                    </button>
                  ))}
                </div>

                <div className="pt-1 border-t border-gray-800">
                  <button
                    onClick={() => {
                      soundFx.playClick();
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-xs text-rose-400 hover:bg-rose-950/30 flex items-center gap-2 transition cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    Lock Bot & Logout License
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
