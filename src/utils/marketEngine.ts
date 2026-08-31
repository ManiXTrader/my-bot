import { Candlestick, SupportResistance, TradingPair, TradeSignal, TimeFrame, BrokerType } from '../types';

// Generate historical candlesticks for a pair
export function generateInitialCandles(pair: TradingPair, count: number = 40): Candlestick[] {
  const candles: Candlestick[] = [];
  const now = Date.now();
  const stepMs = 5000; // 5s intervals
  let price = pair.currentPrice;
  const spread = price * (pair.volatility === 'HIGH' ? 0.0018 : pair.volatility === 'MEDIUM' ? 0.001 : 0.0005);

  const patterns = [
    'Bullish Engulfing',
    'Hammer (Support Bounce)',
    'Shooting Star (Resistance)',
    'Morning Star',
    'Bearish Engulfing',
    'S&R Rejection',
    'Doji Reversal',
  ];

  for (let i = count; i >= 0; i--) {
    const time = now - i * stepMs;
    const delta = (Math.random() - 0.49) * spread;
    const open = price;
    const close = +(open + delta).toFixed(pair.currentPrice > 50 ? 2 : 5);
    const high = +(Math.max(open, close) + Math.random() * spread * 0.7).toFixed(pair.currentPrice > 50 ? 2 : 5);
    const low = +(Math.min(open, close) - Math.random() * spread * 0.7).toFixed(pair.currentPrice > 50 ? 2 : 5);
    const volume = Math.floor(Math.random() * 800) + 200;

    let pattern: string | undefined = undefined;
    if (i % 7 === 0) {
      pattern = patterns[Math.floor(Math.random() * patterns.length)];
    }

    candles.push({
      time,
      open,
      high,
      low,
      close,
      volume,
      pattern,
    });

    price = close;
  }

  return candles;
}

// Calculate Dynamic Support & Resistance levels from candles
export function calculateSupportResistance(candles: Candlestick[]): SupportResistance {
  if (!candles.length) {
    return {
      resistance1: 1.088,
      resistance2: 1.092,
      support1: 1.081,
      support2: 1.077,
      pivot: 1.0845,
      currentZone: 'NEUTRAL',
    };
  }

  const highs = candles.map((c) => c.high);
  const lows = candles.map((c) => c.low);
  const closes = candles.map((c) => c.close);

  const highest = Math.max(...highs);
  const lowest = Math.min(...lows);
  const latestClose = closes[closes.length - 1];

  const pivot = +((highest + lowest + latestClose) / 3).toFixed(5);
  const r1 = +(2 * pivot - lowest).toFixed(5);
  const r2 = +(pivot + (highest - lowest)).toFixed(5);
  const s1 = +(2 * pivot - highest).toFixed(5);
  const s2 = +(pivot - (highest - lowest)).toFixed(5);

  let currentZone: SupportResistance['currentZone'] = 'NEUTRAL';
  const threshold = (r1 - s1) * 0.15;

  if (Math.abs(latestClose - s1) <= threshold || latestClose <= s1) {
    currentZone = 'NEAR_SUPPORT';
  } else if (Math.abs(latestClose - r1) <= threshold || latestClose >= r1) {
    currentZone = 'NEAR_RESISTANCE';
  } else if (latestClose > r1 + threshold || latestClose < s1 - threshold) {
    currentZone = 'BREAKOUT';
  }

  return {
    resistance1: r1,
    resistance2: r2,
    support1: s1,
    support2: s2,
    pivot,
    currentZone,
  };
}

// Calculate RSI
export function calculateRSI(candles: Candlestick[], period: number = 14): number {
  if (candles.length < period + 1) return 52.4;
  let gains = 0;
  let losses = 0;

  for (let i = candles.length - period; i < candles.length; i++) {
    const diff = candles[i].close - candles[i - 1].close;
    if (diff >= 0) {
      gains += diff;
    } else {
      losses -= diff;
    }
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  const rsi = 100 - 100 / (1 + rs);
  return +rsi.toFixed(1);
}

// Timeframe to seconds helper
export function timeframeToSeconds(tf: TimeFrame): number {
  switch (tf) {
    case '5s':
      return 5;
    case '15s':
      return 15;
    case '30s':
      return 30;
    case '1m':
      return 60;
    case '2m':
      return 120;
    case '5m':
      return 300;
    case '15m':
      return 900;
    default:
      return 60;
  }
}

// Amir FX AI Pattern Matching & High Accuracy Signal Generator
export function generateSignal(
  pair: TradingPair,
  candles: Candlestick[],
  timeframe: TimeFrame = '1m',
  broker: BrokerType = 'POCKET_OPTION'
): TradeSignal {
  const sr = calculateSupportResistance(candles);
  const rsi = calculateRSI(candles);
  const latest = candles[candles.length - 1] || { close: pair.currentPrice };
  const currentPrice = latest.close;

  // Decide direction based on S&R touch + Amir FX candlestick logic
  let direction: 'CALL' | 'PUT' = 'CALL';
  let patternName = 'Amir FX S&R Bounce + Bullish Hammer';
  let accuracy = +(94 + Math.random() * 5.2).toFixed(1); // 94.0% to 99.2%

  if (sr.currentZone === 'NEAR_SUPPORT' || rsi < 42 || pair.trend === 'UP') {
    direction = 'CALL';
    const callPatterns = [
      'Amir FX Bullish Engulfing at S1 Level',
      'Strong Support Zone Rejection (Hammer)',
      'Double Bottom + Stochastic Bullish Crossover',
      'Morning Star Reversal on Support Line',
      'OTC Liquidity Sweep + Reversal Surge',
      'Amir FX Algorithmic Trend Continuation (CALL)',
    ];
    patternName = callPatterns[Math.floor(Math.random() * callPatterns.length)];
  } else {
    direction = 'PUT';
    const putPatterns = [
      'Amir FX Bearish Engulfing at R1 Resistance',
      'Shooting Star Rejection at Resistance Zone',
      'Double Top Formation + RSI Overbought (>70)',
      'Evening Star Breakdown on Resistance Zone',
      'S&R False Breakout Trap (Instant PUT)',
      'Amir FX OTC Momentum Drop (PUT)',
    ];
    patternName = putPatterns[Math.floor(Math.random() * putPatterns.length)];
  }

  const expirySecs = timeframeToSeconds(timeframe);
  const now = Date.now();

  const safeEntryRules = [
    'Enter at exactly 00:00s of next candle (1-Second Precision)',
    'Wait for minor pullback towards Support line then trigger entry',
    'Follow direct Amir FX candle close price without delay',
    'Safe Entry at candle opening with broker fixed time',
  ];

  return {
    id: 'SIG-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
    pair: { ...pair, currentPrice },
    direction,
    timeframe,
    entryPrice: currentPrice,
    supportResistance: sr,
    pattern: patternName,
    accuracy,
    rsi,
    stochastic: {
      k: direction === 'CALL' ? +(20 + Math.random() * 15).toFixed(1) : +(75 + Math.random() * 18).toFixed(1),
      d: direction === 'CALL' ? +(22 + Math.random() * 12).toFixed(1) : +(72 + Math.random() * 15).toFixed(1),
    },
    timestamp: now,
    expirySeconds: expirySecs,
    expiryTime: now + expirySecs * 1000,
    safeEntryRule: safeEntryRules[Math.floor(Math.random() * safeEntryRules.length)],
    martingaleStep: 'Direct Win (94%+) | Max 1-Step Backup if needed',
    status: 'ACTIVE',
    broker,
  };
}
