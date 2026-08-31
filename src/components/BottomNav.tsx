import React from 'react';
import { ActiveTab } from '../types';
import { LayoutGrid, History, Bot, BarChart3, Settings } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface BottomNavProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#161A1E]/95 border-t border-gray-800 backdrop-blur-md py-1.5 px-4">
      <div className="max-w-md mx-auto flex items-center justify-around">
        
        {/* 1. Dashboard */}
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectTab('dashboard');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition cursor-pointer ${
            activeTab === 'dashboard'
              ? 'text-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <LayoutGrid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider">
            Dashboard
          </span>
        </button>

        {/* 2. History */}
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectTab('history');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition cursor-pointer ${
            activeTab === 'history'
              ? 'text-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <History className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider">
            History
          </span>
        </button>

        {/* 3. Center Elevated BOT Button */}
        <div className="-mt-5 relative">
          <button
            onClick={() => {
              soundFx.playClick();
              onSelectTab('bot');
            }}
            className={`w-12 h-12 rounded-xl p-[2px] shadow-lg transition-transform active:scale-95 cursor-pointer ${
              activeTab === 'bot'
                ? 'bg-blue-500 shadow-blue-900/50'
                : 'bg-gray-700 hover:bg-gray-600'
            }`}
          >
            <div className="w-full h-full rounded-[10px] bg-[#161A1E] flex flex-col items-center justify-center text-blue-400">
              <Bot className="w-5 h-5" />
              <span className="text-[8px] font-['Rajdhani'] font-black uppercase text-white mt-0.5">
                BOT
              </span>
            </div>
          </button>
        </div>

        {/* 4. Analytics */}
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectTab('analytics');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition cursor-pointer ${
            activeTab === 'analytics'
              ? 'text-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <BarChart3 className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider">
            Analytics
          </span>
        </button>

        {/* 5. Settings */}
        <button
          onClick={() => {
            soundFx.playClick();
            onSelectTab('settings');
          }}
          className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition cursor-pointer ${
            activeTab === 'settings'
              ? 'text-blue-400'
              : 'text-gray-400 hover:text-gray-200'
          }`}
        >
          <Settings className="w-5 h-5 mb-0.5" />
          <span className="text-[10px] font-['Rajdhani'] font-bold uppercase tracking-wider">
            Settings
          </span>
        </button>

      </div>
    </nav>
  );
};
