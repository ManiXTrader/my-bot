import React, { useRef, useEffect, useState } from 'react';
import { Candlestick, SupportResistance, TradingPair } from '../types';
import { Layers, ChevronDown } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CandleChartProps {
  pair: TradingPair;
  candles: Candlestick[];
  supportResistance: SupportResistance;
  onOpenPairsModal?: () => void;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  pair,
  candles,
  supportResistance,
  onOpenPairsModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hoveredCandle, setHoveredCandle] = useState<Candlestick | null>(null);
  const [candleTimer, setCandleTimer] = useState(5);

  // Countdown timer for next candle tick
  useEffect(() => {
    const interval = setInterval(() => {
      setCandleTimer((prev) => (prev <= 1 ? 5 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Render High Quality Canvas Chart
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !candles.length) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle high DPI displays
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 25, right: 65, bottom: 25, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Clear background
    ctx.fillStyle = '#0B0E11';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#161A1E';
    ctx.lineWidth = 1;

    for (let i = 0; i < 5; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    for (let i = 0; i < 6; i++) {
      const x = padding.left + (chartWidth / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, padding.top);
      ctx.lineTo(x, height - padding.bottom);
      ctx.stroke();
    }

    // Determine min/max price for scaling
    const prices = candles.flatMap((c) => [c.high, c.low]);
    if (supportResistance.resistance1) prices.push(supportResistance.resistance1);
    if (supportResistance.support1) prices.push(supportResistance.support1);

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice || 0.001;

    const getY = (price: number) => {
      return padding.top + chartHeight - ((price - minPrice) / priceRange) * chartHeight;
    };

    // Draw Support (Green Dashed) & Resistance (Red Dashed)
    const drawLevel = (price: number, label: string, color: string, isDashed: boolean = true) => {
      const y = getY(price);
      if (y < padding.top || y > height - padding.bottom) return;

      ctx.save();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      if (isDashed) ctx.setLineDash([4, 4]);

      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Right price badge
      ctx.setLineDash([]);
      ctx.fillStyle = color;
      ctx.fillRect(width - padding.right + 2, y - 10, padding.right - 4, 20);

      ctx.fillStyle = '#020612';
      ctx.font = 'bold 9px JetBrains Mono, monospace';
      ctx.fillText(label, width - padding.right + 5, y - 1);
      ctx.fillText(price > 50 ? price.toFixed(2) : price.toFixed(5), width - padding.right + 5, y + 8);

      ctx.restore();
    };

    // Resistance levels
    if (supportResistance.resistance1) {
      drawLevel(supportResistance.resistance1, 'R1 (RESIST)', '#f43f5e');
    }
    // Support levels
    if (supportResistance.support1) {
      drawLevel(supportResistance.support1, 'S1 (SUPPORT)', '#10b981');
    }
    // Pivot line
    if (supportResistance.pivot) {
      drawLevel(supportResistance.pivot, 'PIVOT', '#06b6d4', true);
    }

    // Draw Candlesticks
    const candleCount = candles.length;
    const candleSpacing = chartWidth / candleCount;
    const candleWidth = Math.max(candleSpacing * 0.7, 4);

    candles.forEach((c, index) => {
      const x = padding.left + index * candleSpacing + candleSpacing / 2;
      const isUp = c.close >= c.open;
      const openY = getY(c.open);
      const closeY = getY(c.close);
      const highY = getY(c.high);
      const lowY = getY(c.low);

      const color = isUp ? '#10b981' : '#f43f5e';
      const shadowColor = isUp ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, highY);
      ctx.lineTo(x, lowY);
      ctx.stroke();

      // Body
      const top = Math.min(openY, closeY);
      const bodyHeight = Math.max(Math.abs(closeY - openY), 2);

      ctx.fillStyle = color;
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = index === candleCount - 1 ? 10 : 0;
      ctx.fillRect(x - candleWidth / 2, top, candleWidth, bodyHeight);
      ctx.shadowBlur = 0;

      // Pattern indicator marker on top of candle
      if (c.pattern) {
        ctx.fillStyle = '#00e5ff';
        ctx.beginPath();
        ctx.arc(x, isUp ? highY - 8 : highY - 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Current live price horizontal pulse line
    const lastCandle = candles[candles.length - 1];
    if (lastCandle) {
      const liveY = getY(lastCandle.close);
      ctx.save();
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(padding.left, liveY);
      ctx.lineTo(width - padding.right, liveY);
      ctx.stroke();
      ctx.restore();
    }
  }, [candles, supportResistance, pair]);

  const latest = candles[candles.length - 1] || { close: pair.currentPrice, open: pair.currentPrice };
  const isUp = latest.close >= latest.open;

  return (
    <div className="w-full rounded-xl bg-[#161A1E] border border-gray-800 p-4 shadow-lg">
      {/* Chart Top Info Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-gray-800">
        <div className="flex items-center gap-2">
          {onOpenPairsModal ? (
            <button
              onClick={() => {
                soundFx.playClick();
                onOpenPairsModal();
              }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1E2329] border border-gray-700 hover:border-blue-500 hover:text-blue-400 transition cursor-pointer group"
              title="Click to change trading pair"
            >
              <span className="font-['Rajdhani'] font-bold text-sm sm:text-base text-white group-hover:text-blue-400 tracking-wide">
                {pair.name}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400" />
            </button>
          ) : (
            <span className="font-['Rajdhani'] font-bold text-sm sm:text-base text-white tracking-wide">
              {pair.name}
            </span>
          )}
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#1E2329] text-blue-400 border border-gray-700">
            Payout: {pair.payout}%
          </span>
          <span
            className={`font-mono text-xs font-bold px-2 py-0.5 rounded border ${
              isUp ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40' : 'bg-rose-950/40 text-rose-400 border-rose-800/40'
            }`}
          >
            {pair.currentPrice > 50 ? latest.close.toFixed(2) : latest.close.toFixed(5)}
          </span>
        </div>

        {/* Dynamic Pattern Indicator Badge & Candle Timer */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-300 font-medium bg-[#1E2329] px-2.5 py-1 rounded border border-gray-700">
            <span className="text-gray-500 uppercase text-[10px]">Zone:</span>
            <span className="font-bold text-white uppercase font-mono">{supportResistance.currentZone.replace('_', ' ')}</span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-gray-300 bg-[#1E2329] px-2.5 py-1 rounded border border-gray-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-ping" />
            <span>00:0{candleTimer}s</span>
          </div>
        </div>
      </div>

      {/* Canvas Element */}
      <div ref={containerRef} className="relative w-full h-52 sm:h-64 rounded-lg overflow-hidden bg-[#0B0E11] border border-gray-800/60">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>

      {/* Bottom Chart Legend */}
      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-3 px-1">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-rose-400 font-mono text-[10px]">
            <span className="w-2.5 h-[2px] bg-rose-500 inline-block" /> Resistance (R1)
          </span>
          <span className="flex items-center gap-1 text-emerald-400 font-mono text-[10px]">
            <span className="w-2.5 h-[2px] bg-emerald-500 inline-block" /> Support (S1)
          </span>
          <span className="flex items-center gap-1 text-blue-400 font-mono text-[10px] hidden sm:inline-flex">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" /> Amir FX Pattern
          </span>
        </div>
        <div className="font-mono text-[10px] text-gray-500">
          5s Real-Time Engine
        </div>
      </div>
    </div>
  );
};
