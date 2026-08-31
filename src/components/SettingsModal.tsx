import React, { useState } from 'react';
import { LicenseData, BrokerType } from '../types';
import {
  SlidersHorizontal,
  Key,
  ShieldCheck,
  Volume2,
  VolumeX,
  LogOut,
  X,
  Calculator,
  Cpu,
  Lock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { soundFx } from '../utils/audio';
import { AdminKeyGeneratorModal } from './AdminKeyGeneratorModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: LicenseData;
  onLogout: () => void;
  currentBroker: BrokerType;
  onSelectBroker: (broker: BrokerType) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  license,
  onLogout,
  currentBroker,
  onSelectBroker,
}) => {
  const [showKeyManager, setShowKeyManager] = useState(false);
  const [balance, setBalance] = useState(500);
  const [baseBet, setBaseBet] = useState(10);
  const [payoutRate, setPayoutRate] = useState(90);

  if (!isOpen) return null;

  // Martingale steps calculation
  const step1 = baseBet;
  const step2 = +(baseBet * 2.2).toFixed(1);
  const step3 = +(baseBet * 4.8).toFixed(1);
  const winProfitStep1 = +(step1 * (payoutRate / 100)).toFixed(1);
  const winProfitStep2 = +(step2 * (payoutRate / 100) - step1).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#161A1E] border border-gray-800 rounded-xl shadow-2xl p-5 sm:p-6 text-gray-200 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-600/15 text-blue-400">
              <SlidersHorizontal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white font-['Rajdhani'] uppercase tracking-wider">
                MANI SIGNALS SETTINGS
              </h2>
              <p className="text-xs text-gray-400">Trading Engine, Risk Calculator & License</p>
            </div>
          </div>
          <button
            onClick={() => {
              soundFx.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="my-4 space-y-4">
          
          {/* License Info Card */}
          <div className="p-4 rounded-xl bg-[#1E2329] border border-gray-700">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-white">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                Active VIP License
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
                LOCKED & SECURED
              </span>
            </div>

            <div className="space-y-1.5 text-xs text-gray-300 font-mono">
              <div className="flex justify-between">
                <span className="text-gray-500">Key:</span>
                <span className="text-white font-bold">{license.key}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Licensed To:</span>
                <span className="text-blue-400">{license.ownerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Hardware ID:</span>
                <span className="text-gray-400">{license.deviceId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Valid Until:</span>
                <span className="text-emerald-400">{license.expiresAt} (Lifetime VIP)</span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-800 flex gap-2">
              <button
                onClick={() => setShowKeyManager(true)}
                className="w-full py-2 px-3 rounded-lg bg-[#161A1E] hover:bg-gray-800 border border-gray-700 text-blue-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Key className="w-3.5 h-3.5" /> Open VIP Key Manager / Generator
              </button>
            </div>
          </div>

          {/* Martingale Risk Calculator */}
          <div className="p-4 rounded-xl bg-[#1E2329] border border-gray-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 mb-3">
              <Calculator className="w-4 h-4 text-blue-400" /> Money & Risk Management (Martingale)
            </h3>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Account Balance ($)</label>
                <input
                  type="number"
                  value={balance}
                  onChange={(e) => setBalance(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#161A1E] border border-gray-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[11px] text-gray-400 mb-1">Base Bet (Step 0)</label>
                <input
                  type="number"
                  value={baseBet}
                  onChange={(e) => setBaseBet(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs rounded-lg bg-[#161A1E] border border-gray-700 text-white font-mono focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Calculated Plan */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-[#161A1E] border border-gray-800">
                <div className="text-[10px] text-gray-400">Step 0 (Direct)</div>
                <div className="font-bold text-white mt-0.5">${step1}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">+${winProfitStep1}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161A1E] border border-gray-800">
                <div className="text-[10px] text-gray-400">Step 1 (Backup)</div>
                <div className="font-bold text-yellow-400 mt-0.5">${step2}</div>
                <div className="text-[10px] text-emerald-400 mt-0.5">+${winProfitStep2}</div>
              </div>
              <div className="p-2.5 rounded-lg bg-[#161A1E] border border-gray-800">
                <div className="text-[10px] text-gray-400">Step 2 (Safety)</div>
                <div className="font-bold text-rose-400 mt-0.5">${step3}</div>
                <div className="text-[10px] text-gray-400 mt-0.5">Safe Cap</div>
              </div>
            </div>
          </div>

          {/* Logout / Lock BOT */}
          <div className="pt-2">
            <button
              onClick={() => {
                soundFx.playClick();
                onLogout();
              }}
              className="w-full py-2.5 px-4 rounded-lg bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 text-rose-400 font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Lock Bot & Sign Out
            </button>
          </div>
        </div>

        {/* Child Admin Modal */}
        <AdminKeyGeneratorModal
          isOpen={showKeyManager}
          onClose={() => setShowKeyManager(false)}
          onSelectKey={() => {}}
        />
      </div>
    </div>
  );
};
