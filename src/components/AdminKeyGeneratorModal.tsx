import React, { useState } from 'react';
import { MASTER_VIP_KEYS, generateNewLicenseKey, getCustomKeys } from '../utils/license';
import { Key, ShieldCheck, Copy, Check, Plus, RefreshCw, X, Sparkles, Lock } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface AdminKeyGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKey: (key: string) => void;
}

export const AdminKeyGeneratorModal: React.FC<AdminKeyGeneratorModalProps> = ({
  isOpen,
  onClose,
  onSelectKey,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [clientName, setClientName] = useState('');
  const [planType, setPlanType] = useState<'VIP_LIFETIME' | 'PRO_ANNUAL' | 'OTC_MASTER'>('VIP_LIFETIME');
  const [customKeys, setCustomKeys] = useState(getCustomKeys());
  const [newlyGenerated, setNewlyGenerated] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (key: string) => {
    soundFx.playClick();
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClick();
    const name = clientName.trim() || 'VIP Client Trader';
    const key = generateNewLicenseKey(name, planType);
    setNewlyGenerated(key);
    setCustomKeys(getCustomKeys());
    setClientName('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-xl bg-[#161A1E] border border-gray-800 rounded-xl shadow-2xl p-6 text-gray-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg bg-blue-600/15 text-blue-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                VIP License Manager <ShieldCheck className="w-4 h-4 text-blue-400" />
              </h2>
              <p className="text-xs text-gray-400">Authorized VIP License Keys for MANI SIGNALS AI BOT</p>
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

        {/* Generate New Key Form */}
        <div className="my-5 p-4 rounded-xl bg-[#1E2329] border border-gray-800">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-blue-400" /> Generate New VIP License Key
          </h3>
          <form onSubmit={handleGenerate} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Trader / Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. VIP Trader 007"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#161A1E] border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">License Tier</label>
                <select
                  value={planType}
                  onChange={(e) => setPlanType(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-lg bg-[#161A1E] border border-gray-700 text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="VIP_LIFETIME">Lifetime VIP Access (Unlimited)</option>
                  <option value="PRO_ANNUAL">Pro Annual Access (1 Year)</option>
                  <option value="OTC_MASTER">Amir FX + OTC Master (6 Months)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Issue Encrypted License Key
            </button>
          </form>

          {newlyGenerated && (
            <div className="mt-3 p-3 rounded-lg bg-blue-600/10 border border-blue-500/50 flex items-center justify-between animate-pulse">
              <div>
                <div className="text-[10px] text-blue-400 font-mono">NEW KEY CREATED:</div>
                <div className="font-mono text-sm font-bold text-white">{newlyGenerated}</div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleCopy(newlyGenerated)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 cursor-pointer"
                >
                  {copiedKey === newlyGenerated ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === newlyGenerated ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={() => {
                    onSelectKey(newlyGenerated);
                    onClose();
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-[#161A1E] hover:bg-gray-800 border border-gray-700 text-white cursor-pointer"
                >
                  Use Now
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Master Preset Keys */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-blue-400" /> Authorized Master Keys
            </h3>
            <span className="text-[10px] text-blue-400 font-mono bg-[#1E2329] px-2 py-0.5 rounded border border-gray-700">
              {MASTER_VIP_KEYS.length + customKeys.length} Keys Active
            </span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {MASTER_VIP_KEYS.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-lg bg-[#1E2329] border border-gray-800 hover:border-gray-700 transition flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white">{item.key}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-600/15 text-blue-400 border border-blue-500/20 font-medium">
                      {item.plan.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {item.owner} • Valid to: <span className="text-gray-300 font-mono">{item.expiry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.key)}
                    className="p-2 rounded-lg bg-[#161A1E] hover:bg-gray-800 text-gray-300 hover:text-white border border-gray-700 transition text-xs flex items-center gap-1 cursor-pointer"
                    title="Copy Key"
                  >
                    {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectKey(item.key);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            ))}

            {customKeys.map((item) => (
              <div
                key={item.key}
                className="p-3 rounded-lg bg-[#1E2329] border border-gray-800 hover:border-gray-700 transition flex items-center justify-between gap-3 group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">{item.key}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      CUSTOM KEY
                    </span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-0.5">
                    {item.owner} • Expires: <span className="text-gray-300 font-mono">{item.expiry}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleCopy(item.key)}
                    className="p-2 rounded-lg bg-[#161A1E] hover:bg-gray-800 text-gray-300 hover:text-emerald-400 border border-gray-700 transition cursor-pointer"
                  >
                    {copiedKey === item.key ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={() => {
                      onSelectKey(item.key);
                      onClose();
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs transition cursor-pointer"
                  >
                    Auto-Fill
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-5 pt-3 border-t border-gray-800 text-center text-xs text-gray-500">
          Encrypted Hardware Locking Enabled • Locked to Owner Master Key
        </div>
      </div>
    </div>
  );
};
