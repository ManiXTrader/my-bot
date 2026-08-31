export type MarketType = 'OTC' | 'LIVE';

export type AssetCategory = 'ALL' | 'FOREX' | 'CRYPTO' | 'COMMODITIES' | 'STOCKS' | 'INDICES';

export type BrokerType = 'POCKET_OPTION' | 'QUOTEX' | 'IQ_OPTION' | 'BINOMO' | 'FOREX';

export type TimeFrame = '5s' | '15s' | '30s' | '1m' | '2m' | '5m' | '15m';

export type SignalDirection = 'CALL' | 'PUT';

export interface TradingPair {
  id: string;
  name: string;
  base: string;
  quote: string;
  type: MarketType;
  category: AssetCategory;
  payout: number;
  currentPrice: number;
  change24h: number;
  winRate: number;
  trend: 'UP' | 'DOWN' | 'SIDEWAYS';
  volatility: 'LOW' | 'MEDIUM' | 'HIGH';
  isFavorite?: boolean;
}

export interface Candlestick {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  pattern?: string;
}

export interface SupportResistance {
  resistance1: number;
  resistance2: number;
  support1: number;
  support2: number;
  pivot: number;
  currentZone: 'NEAR_SUPPORT' | 'NEAR_RESISTANCE' | 'BREAKOUT' | 'NEUTRAL';
}

export interface TradeSignal {
  id: string;
  pair: TradingPair;
  direction: SignalDirection;
  timeframe: TimeFrame;
  entryPrice: number;
  supportResistance: SupportResistance;
  pattern: string;
  accuracy: number; // e.g. 96.8%
  rsi: number;
  stochastic: { k: number; d: number };
  timestamp: number;
  expirySeconds: number;
  expiryTime: number;
  safeEntryRule: string;
  martingaleStep: string;
  status: 'ACTIVE' | 'WON' | 'LOST' | 'EXPIRED';
  resultProfit?: number;
  broker: BrokerType;
}

export interface LicenseData {
  key: string;
  ownerName: string;
  plan: 'VIP_LIFETIME' | 'PRO_ANNUAL' | 'OTC_MASTER';
  activatedAt: string;
  expiresAt: string;
  deviceId: string;
  isValid: boolean;
}

export type ActiveTab = 'dashboard' | 'history' | 'bot' | 'analytics' | 'settings';
