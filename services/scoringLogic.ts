
import { MarketData, ScoringResult, Language } from '../types';
import { translations } from './translations';

export const calculateInvestmentScore = (market: MarketData, language: Language = 'en'): ScoringResult => {
  let score = 50; // Base score
  const breakdown = {
    spreadFactor: 0,
    maturityFactor: 0,
    trendFactor: 0,
  };

  const now = new Date();
  const daysToMaturity = Math.ceil((market.expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const apyDiff = market.underlyingAPY - market.impliedAPY;
  
  // 1. APY Spread Logic
  if (apyDiff > 0) {
    const spreadBonus = Math.min(apyDiff * 4, 30); 
    breakdown.spreadFactor += spreadBonus;
    score += spreadBonus;

    if (apyDiff >= 3) {
      breakdown.spreadFactor += 20; 
      score += 20;
    }
  } else {
    const spreadPenalty = Math.max(apyDiff * 4, -40);
    breakdown.spreadFactor += spreadPenalty;
    score += spreadPenalty;
  }

  // 2. Trend Logic
  const history = market.historicalUnderlyingAPY;
  let isRising = false;
  if (history.length >= 2) {
    const start = history[0];
    const end = history[history.length - 1];
    if (end > start) {
      breakdown.trendFactor += 20;
      score += 20;
      isRising = true;
    } else if (end < start) {
      breakdown.trendFactor -= 10;
      score -= 10;
    }
  }

  // 3. Maturity Logic
  if (daysToMaturity < 30) {
    breakdown.maturityFactor -= 35;
    score -= 35;
  } else {
    breakdown.maturityFactor += 5;
    score += 5;
  }

  // Clamp Score 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine Tier
  let tier: ScoringResult['tier'] = 'Avoid';
  let color = 'text-red-500 border-red-500 bg-red-500/10';

  if (score >= 80) {
    tier = 'Strong Buy';
    color = 'text-emerald-400 border-emerald-400 bg-emerald-400/10';
  } else if (score >= 60) {
    tier = 'Buy';
    color = 'text-blue-400 border-blue-400 bg-blue-400/10';
  } else if (score >= 40) {
    tier = 'Hold';
    color = 'text-yellow-400 border-yellow-400 bg-yellow-400/10';
  }

  // Generate analysis string
  const t = translations[language].logic;
  const trendStr = isRising ? t.rising : t.falling;
  const spreadNote = apyDiff >= 3 ? t.spreadIdeal : '';
  const analysis = `${t.spread}: ${apyDiff.toFixed(2)}% ${spreadNote}. ${t.trend}: ${trendStr}. ${t.maturity}: ${daysToMaturity}d.`;

  return {
    score,
    tier,
    color,
    breakdown,
    analysis
  };
};
