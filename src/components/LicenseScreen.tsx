import React, { useState } from 'react';
import { validateLicenseKey, saveActiveLicense, getDeviceFingerprint } from '../utils/license';
import { LicenseData } from '../types';
import { Lock, Shield, KeyRound, AlertCircle, CheckCircle2, Bot, Cpu, Sparkles, HelpCircle } from 'lucide-react';
import { soundFx } from '../utils/audio';
import { AdminKeyGeneratorModal } from './AdminKeyGeneratorModal';

interface LicenseScreenProps {
  onSuccess: (license: LicenseData) => void;
}

export const LicenseScreen: React.FC<LicenseScreenProps> = ({ onSuccess }) => {
  const [inputKey, setInputKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [successAnim, setSuccessAnim] = useState(false);

  const formatKeyInput = (value: string) => {
    // Auto-uppercase and keep hyphens clean
    return value.toUpperCase();
  };

  const handleActivate = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    soundFx.playClick();

    if (!inputKey.trim()) {
      setError('Please enter your VIP License Key.');
      soundFx.playAccessDenied();
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const result = validateLicenseKey(inputKey);
      setLoading(false);

      if (result.valid && result.license) {
        soundFx.playAccessGranted();
        setSuccessAnim(true);
        saveActiveLicense(result.license);
        setTimeout(() => {
          onSuccess(result.license!);
        }, 900);
      } else {
        soundFx.playAccessDenied();
        setError(result.message || 'Access Denied: Invalid or Unregistered License Key.');
      }
    }, 700);
  };

  const fillMasterKey = (key: string) => {
    setInputKey(key);
    setError(null);
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#0B0E11] overflow-hidden">
      {/* Background Subtle Glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Glow Spheres */}
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px]" />

        {/* Ambient Candlestick Silhouettes */}
        <div className="absolute inset-0 opacity-10 flex justify-between items-center px-8">
          <div className="flex items-end gap-3 h-64">
            <div className="w-1.5 h-32 bg-emerald-500 rounded-full relative">
              <div className="absolute -inset-x-1 top-6 h-16 bg-emerald-500 rounded-sm" />
            </div>
            <div className="w-1.5 h-44 bg-rose-500 rounded-full relative">
              <div className="absolute -inset-x-1 top-8 h-24 bg-rose-500 rounded-sm" />
            </div>
            <div className="w-1.5 h-28 bg-emerald-500 rounded-full relative">
              <div className="absolute -inset-x-1 top-4 h-14 bg-emerald-500 rounded-sm" />
            </div>
          </div>
          <div className="flex items-end gap-3 h-64">
            <div className="w-1.5 h-40 bg-emerald-500 rounded-full relative">
              <div className="absolute -inset-x-1 top-6 h-20 bg-emerald-500 rounded-sm" />
            </div>
            <div className="w-1.5 h-52 bg-emerald-500 rounded-full relative">
              <div className="absolute -inset-x-1 top-10 h-28 bg-emerald-500 rounded-sm" />
            </div>
            <div className="w-1.5 h-36 bg-rose-500 rounded-full relative">
              <div className="absolute -inset-x-1 top-8 h-16 bg-rose-500 rounded-sm" />
            </div>
          </div>
        </div>

        {/* High-tech grid overlay */}
        <div 
          className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px]" 
        />
      </div>

      {/* Main Card Container */}
      <div className="relative z-10 w-full max-w-[440px] flex flex-col items-center">
        
        {/* Robot AI Avatar Box */}
        <div className="relative mb-6 group">
          {/* Outer glowing frame */}
          <div className="w-24 h-24 rounded-2xl p-[2px] bg-gradient-to-tr from-blue-600 via-cyan-500 to-blue-400 shadow-xl shadow-blue-900/30">
            <div className="w-full h-full rounded-2xl bg-[#161A1E] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-blue-600/10" />
              
              {/* SVG Robot Face */}
              <svg viewBox="0 0 100 100" className="w-16 h-16 relative z-10 drop-shadow-md">
                <path
                  d="M20 38 C20 22 80 22 80 38 L80 65 C80 78 20 78 20 65 Z"
                  fill="#EAECEF"
                />
                <rect x="26" y="32" width="48" height="30" rx="8" fill="#161A1E" />
                <circle cx="40" cy="46" r="6" fill="#3B82F6" className="animate-pulse" />
                <circle cx="40" cy="46" r="2.5" fill="#60A5FA" />
                <circle cx="60" cy="46" r="6" fill="#3B82F6" className="animate-pulse" />
                <circle cx="60" cy="46" r="2.5" fill="#60A5FA" />
                <path d="M44 56 Q50 59 56 56" stroke="#60A5FA" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                <rect x="14" y="42" width="6" height="14" rx="3" fill="#2563EB" />
                <rect x="80" y="42" width="6" height="14" rx="3" fill="#2563EB" />
                <rect x="46" y="16" width="8" height="6" rx="2" fill="#60A5FA" />
              </svg>
            </div>
          </div>
          {/* Live indicator */}
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500 border-2 border-[#0B0E11]"></span>
          </div>
        </div>

        {/* Title Branding */}
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-['Rajdhani'] uppercase">
            MANI SIGNALS
          </h1>
          <div className="text-2xl sm:text-3xl font-extrabold tracking-widest text-blue-400 font-['Rajdhani'] uppercase flex items-center justify-center gap-2 mt-0.5">
            AI BOT
            <span className="text-white text-2xl sm:text-3xl font-black">PRO</span>
          </div>
          <p className="text-xs text-gray-400 mt-1.5 font-medium tracking-wide flex items-center justify-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" />
            Amir FX Candlestick & S&R Algorithmic Engine
          </p>
        </div>

        {/* Form Box */}
        <div className="w-full rounded-xl bg-[#161A1E] border border-gray-800 p-6 sm:p-7 shadow-2xl relative">
          
          {/* Center Lock Header Indicator */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-[1px] w-12 bg-gray-800" />
            <div className="p-1.5 rounded-full bg-[#1E2329] border border-gray-700 text-blue-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <div className="h-[1px] w-12 bg-gray-800" />
          </div>

          <div className="text-center mb-5">
            <h2 className="text-sm sm:text-base font-bold tracking-wider text-white uppercase font-['Rajdhani']">
              ENTER YOUR <span className="text-blue-400">LICENSE KEY</span>
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">Secure Encrypted Authentication</p>
          </div>

          <form onSubmit={handleActivate} className="space-y-4">
            {/* Input Field with lock */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                <Lock className="w-4 h-4 text-blue-400" />
              </div>
              <input
                type="text"
                value={inputKey}
                onChange={(e) => setInputKey(formatKeyInput(e.target.value))}
                placeholder="XXXX-XXXX-XXXX-XXXX"
                autoComplete="off"
                spellCheck="false"
                className="w-full pl-10 pr-4 py-3 bg-[#1E2329] border border-gray-700 rounded-lg text-center text-sm font-mono font-semibold tracking-wider text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/60 flex items-start gap-2.5 text-xs text-rose-300 animate-in fade-in slide-in-from-top-1">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Success Animation */}
            {successAnim && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-center gap-2 text-xs text-emerald-300 animate-bounce font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>License Verified! Loading MANI Signals Dashboard...</span>
              </div>
            )}

            {/* Activate Button */}
            <button
              type="submit"
              disabled={loading || successAnim}
              className="w-full py-3 px-6 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider font-['Rajdhani'] flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-[0.98] transition-all duration-200 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>DECRYPTING & VERIFYING...</span>
                </div>
              ) : (
                <>
                  <Shield className="w-4 h-4 text-white" />
                  <span>ACTIVATE LICENSE</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Helper for Master Keys / Owner Key Access */}
          <div className="mt-5 pt-4 border-t border-gray-800 flex flex-col items-center gap-2">
            <button
              type="button"
              onClick={() => {
                soundFx.playClick();
                setShowAdminModal(true);
              }}
              className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1.5 hover:underline transition cursor-pointer"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Owner & VIP Keys Manager (Click here)</span>
            </button>
            <div className="flex items-center gap-2 text-[10px] text-gray-500">
              <span>HWID: {getDeviceFingerprint()}</span>
              <span>•</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                Live Bot Engine Ready
              </span>
            </div>
          </div>
        </div>

        {/* Footnote */}
        <div className="mt-6 text-center text-[11px] text-gray-500 flex items-center gap-1.5">
          <Bot className="w-3.5 h-3.5 text-blue-400/80" />
          <span>Pocket Option • Quotex • IQ Option • Forex Live & OTC Signals</span>
        </div>
      </div>

      {/* Admin Key Manager Modal */}
      <AdminKeyGeneratorModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSelectKey={fillMasterKey}
      />
    </div>
  );
};
