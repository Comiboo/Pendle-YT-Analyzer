
import React, { useEffect, useState } from 'react';
import { LineChart, Line, ResponsiveContainer, YAxis } from 'recharts';
import { MarketData, ScoringResult, AnalysisResult, Language } from '../types';
import { getMarketAnalysis } from '../services/geminiService';
import { ScoreBadge } from './ScoreBadge';
import { translations } from '../services/translations';

interface MarketCardProps {
  market: MarketData;
  scoring: ScoringResult;
  language: Language;
}

export const MarketCard: React.FC<MarketCardProps> = ({ market, scoring, language }) => {
  const [aiData, setAiData] = useState<AnalysisResult | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const t = translations[language].card;

  useEffect(() => {
    // Fetch AI description only
    const fetchAI = async () => {
        setLoadingAi(true);
        const data = await getMarketAnalysis(market, scoring.score, language);
        setAiData(data);
        setLoadingAi(false);
    };
    fetchAI();
  }, [market, scoring.score, language]);

  const daysToMaturity = Math.ceil((market.expiry.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const chartData = market.historicalUnderlyingAPY.map((val, i) => ({ day: i, val }));
  const isPositiveSpread = market.underlyingAPY > market.impliedAPY;
  
  // Translate Tier for display using the ScoringResult tier key
  const displayTier = translations[language].tiers[scoring.tier];

  return (
    <div className="bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-xl p-5 hover:border-slate-500 transition-all duration-300 shadow-xl flex flex-col h-full group relative overflow-hidden">
      
      {/* Leverage Badge */}
      <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-br-lg z-10 shadow-lg">
        {market.leverage}x {t.leverage}
      </div>

      {/* Header */}
      <div className="flex justify-between items-start mb-4 mt-2">
        <div className="flex items-center gap-3">
          <div className="relative w-14 h-14 rounded-full overflow-hidden bg-slate-700 border-2 border-slate-600 shrink-0">
            <img 
                src={market.imageUrl} 
                alt={market.symbol} 
                className="w-full h-full object-cover" 
            />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white leading-tight">{market.symbol}</h3>
            <p className="text-xs text-slate-400">{market.protocol}</p>
            <p className="text-xs text-slate-500 mt-0.5">{market.expiry.toLocaleDateString()} ({daysToMaturity} {t.daysLeft})</p>
          </div>
        </div>
        <ScoreBadge score={scoring.score} tier={displayTier} colorClass={scoring.color} />
      </div>

      {/* Description (AI) */}
      <div className="mb-4 min-h-[40px]">
        {loadingAi ? (
           <div className="animate-pulse space-y-2">
             <div className="h-2 bg-slate-700 rounded w-3/4"></div>
             <div className="h-2 bg-slate-700 rounded w-1/2"></div>
           </div>
        ) : (
          <p className="text-xs text-slate-300 leading-relaxed">
             {aiData?.description}
          </p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
        <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.implied}</p>
            <p className="text-lg font-mono font-medium text-white">{market.impliedAPY.toFixed(2)}%</p>
        </div>
        <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold">{t.underlying}</p>
            <p className={`text-lg font-mono font-medium ${isPositiveSpread ? 'text-emerald-400' : 'text-red-400'}`}>
                {market.underlyingAPY.toFixed(2)}%
            </p>
        </div>
        <div className="col-span-2 border-t border-slate-800 pt-2 flex justify-between items-center">
            <span className="text-xs text-slate-400">{t.spread}</span>
            <span className={`text-sm font-bold ${isPositiveSpread ? 'text-emerald-400' : 'text-red-500'}`}>
                {isPositiveSpread ? '+' : ''}{(market.underlyingAPY - market.impliedAPY).toFixed(2)}%
            </span>
        </div>
      </div>

      {/* Chart - Micro Trend */}
      <div className="h-16 mb-4 w-full">
        <div className="flex justify-between items-end mb-1">
            <p className="text-[10px] text-slate-500">{t.trend7d}</p>
            {scoring.breakdown.trendFactor > 0 && (
                <span className="text-[10px] text-emerald-400 font-bold animate-pulse">{t.risingTrend}</span>
            )}
        </div>
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
                <Line type="monotone" dataKey="val" stroke={scoring.breakdown.trendFactor > 0 ? '#34d399' : '#ef4444'} strokeWidth={2} dot={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} hide />
            </LineChart>
        </ResponsiveContainer>
      </div>

      {/* AI Verdict / Analysis */}
      <div className={`p-3 rounded-lg text-xs border-l-2 mb-4 ${scoring.score >= 60 ? 'border-emerald-500 bg-emerald-900/10' : 'border-slate-600 bg-slate-800'}`}>
        <span className="font-bold block mb-1 text-slate-200">{t.analysis}</span>
        {loadingAi ? (
             <span className="text-slate-500">{t.generating}</span>
        ) : (
             <span className="text-slate-300">{aiData?.aiVerdict}</span>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-auto pt-3 border-t border-slate-700/50">
        <a 
            href={market.marketUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center w-full py-2 px-4 bg-slate-700 hover:bg-blue-600 text-white text-sm font-semibold rounded-lg transition-colors duration-200 gap-2 group/btn"
        >
            <span>{t.trade}</span>
            <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
        </a>
      </div>
    </div>
  );
};
