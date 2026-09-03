import React from 'react';
import { X, Send, Clock, Infinity } from 'lucide-react';

interface AdminKeyGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKey: (key: string) => void;
}

export const AdminKeyGeneratorModal: React.FC<AdminKeyGeneratorModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const telegram = 'https://t.me/TWZcommunity';

  const plans = [
    { title: '30 DAYS', icon: <Clock className="w-5 h-5" /> },
    { title: '90 DAYS', icon: <Clock className="w-5 h-5" /> },
    { title: '120 DAYS', icon: <Clock className="w-5 h-5" /> },
    { title: 'LIFETIME', icon: <Infinity className="w-6 h-6" /> },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-[#161A1E] border border-gray-800 rounded-xl shadow-2xl p-6 text-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-800">
          <div>
            <h2 className="text-lg font-bold text-white">
              VIP ACCESS
            </h2>
            <p className="text-xs text-gray-400 mt-1">
              Contact Owner for VIP License
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Contact */}
        <div className="mt-5 p-4 rounded-xl bg-[#1E2329] border border-gray-800">
          <div className="text-center">
            <h3 className="text-base font-semibold text-white">
              CONTACT ME FOR VIP ACCESS
            </h3>

            <p className="text-xs text-gray-400 mt-2">
              Choose your preferred VIP plan and contact the owner on Telegram.
            </p>

            <a
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition"
            >
              <Send className="w-4 h-4" />
              Telegram: @TWZcommunity
            </a>
          </div>
        </div>

        {/* Plans */}
        <div className="mt-5 space-y-3">
          {plans.map((plan) => (
            <a
              key={plan.title}
              href={telegram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 rounded-xl bg-[#1E2329] border border-gray-800 hover:border-blue-500 hover:bg-[#232932] transition"
            >
              <div className="flex items-center gap-3">
                <div className="text-blue-400">
                  {plan.icon}
                </div>

                <div>
                  <div className="text-sm font-bold text-white">
                    {plan.title}
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Contact owner for access
                  </div>
                </div>
              </div>

              <div className="text-xs font-semibold text-blue-400">
                CONTACT
              </div>
            </a>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-gray-800 text-center">
          <p className="text-[11px] text-gray-500">
            MANI SIGNALS AI BOT • VIP LICENSE SUPPORT
          </p>
        </div>

      </div>
    </div>
  );
};
