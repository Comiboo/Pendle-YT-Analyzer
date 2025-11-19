
export type Language = 'en' | 'ko';

export interface MarketData {
  id: string;
  name: string;
  protocol: string; // e.g., Ether.fi, Ethena
  symbol: string; // e.g., eETH, USDe
  expiry: Date;
  impliedAPY: number; // Percentage (e.g., 10.5 for 10.5%)
  underlyingAPY: number; // Percentage
  historicalUnderlyingAPY: number[]; // Last 7 days of APY
  imageUrl: string;
  marketUrl: string; // Link to the Pendle market page
  leverage: number; // Estimated YT Leverage (e.g., 15.5)
}

export interface ScoringResult {
  score: number; // 0 to 100
  tier: 'Strong Buy' | 'Buy' | 'Hold' | 'Avoid';
  color: string;
  breakdown: {
    spreadFactor: number;
    maturityFactor: number;
    trendFactor: number;
  };
  analysis: string;
}

export interface AnalysisResult {
  description: string;
  aiVerdict: string;
}
