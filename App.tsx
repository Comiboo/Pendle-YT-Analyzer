
import React, { useMemo, useState } from 'react';
import { MOCK_MARKETS } from './services/mockData';
import { MarketCard } from './components/MarketCard';
import { calculateInvestmentScore } from './services/scoringLogic';
import { translations } from './services/translations';
import { Language } from './types';

type SortOption = 'scoreDesc' | 'scoreAsc';
type FilterOption = 'All' | 'Strong Buy' | 'Buy' | 'Hold' | 'Avoid';

function App() {
  const [sortOrder, setSortOrder] = useState<SortOption>('scoreDesc');
  const [filterTier, setFilterTier] = useState<FilterOption>('All');
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  // Process markets: Add score and leverage filtering/sorting
  const processedMarkets = useMemo(() => {
    const scored = MOCK_MARKETS.map(market => ({
      ...market,
      scoring: calculateInvestmentScore(market, language)
    }));

    // Filter
    const filtered = scored.filter(item => {
      if (filterTier === 'All') return true;
      return item.scoring.tier === filterTier;
    });

    // Sort
    const sorted = filtered.sort((a, b) => {
      if (sortOrder === 'scoreDesc') {
        return b.scoring.score - a.scoring.score;
      } else {
        return a.scoring.score - b.scoring.score;
      }
    });

    return sorted;
  }, [sortOrder, filterTier, language]);

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ko' : 'en');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
              YT
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              {t.appTitle}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleLanguage}
              className="px-3 py-1 rounded-md bg-slate-800 hover:bg-slate-700 border border-slate-600 text-xs font-bold text-slate-200 transition-colors"
            >
              {language === 'en' ? '🇺🇸 EN' : '🇰🇷 KO'}
            </button>
            <a href="https://app.pendle.finance/trade/markets" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block">
              {t.officialApp} ↗
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Introduction / Score Guide */}
        <section className="mb-10">
          <div className="bg-gradient-to-r from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{t.scoreCriteriaTitle}</h2>
              <p className="text-slate-300 max-w-2xl mb-6 text-sm md:text-base">
                {t.scoreCriteriaDesc}
              </p>
              <ul className="list-disc list-inside text-slate-400 mb-6 space-y-1 text-sm">
                {t.criteria.map((crit, idx) => (
                  <li key={idx}>{crit}</li>
                ))}
              </ul>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-emerald-500/30">
                  <div className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></div>
                  <div>
                    <span className="block text-white font-bold text-sm">80 - 100 ({t.tiers['Strong Buy']})</span>
                    <span className="text-xs text-slate-400">{t.tierDescs.strongBuy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-blue-500/30">
                  <div className="w-3 h-3 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"></div>
                  <div>
                    <span className="block text-white font-bold text-sm">60 - 79 ({t.tiers['Buy']})</span>
                    <span className="text-xs text-slate-400">{t.tierDescs.buy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-900/60 rounded-lg border border-red-500/30">
                  <div className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
                  <div>
                    <span className="block text-white font-bold text-sm">0 - 59 ({t.tiers['Avoid']})</span>
                    <span className="text-xs text-slate-400">{t.tierDescs.avoid}</span>
                  </div>
                </div>
              </div>
            </div>
             {/* Decoration */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>
          </div>
        </section>

        {/* Controls & Grid Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {t.activeOpp} ({processedMarkets.length})
            </h3>

            <div className="flex flex-col sm:flex-row gap-3">
                {/* Filter Group */}
                <div className="inline-flex rounded-md shadow-sm bg-slate-800 p-1 border border-slate-700">
                    <button
                      onClick={() => setFilterTier('All')}
                      className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                          filterTier === 'All'
                          ? 'bg-slate-600 text-white shadow-sm' 
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                      }`}
                    >
                      {t.filterAll}
                    </button>
                    {(['Strong Buy', 'Buy', 'Hold', 'Avoid'] as const).map((tier) => (
                        <button
                            key={tier}
                            onClick={() => setFilterTier(tier)}
                            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors ${
                                filterTier === tier 
                                ? 'bg-slate-600 text-white shadow-sm' 
                                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                            }`}
                        >
                            {t.tiers[tier]}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOption)}
                    className="block w-full sm:w-auto pl-3 pr-8 py-1.5 text-xs font-medium text-white bg-slate-800 border border-slate-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                    <option value="scoreDesc">{t.sortHigh}</option>
                    <option value="scoreAsc">{t.sortLow}</option>
                </select>
            </div>
        </div>
        
        {/* Market Grid */}
        {processedMarkets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processedMarkets.map((item) => (
                <MarketCard key={item.id} market={item} scoring={item.scoring} language={language} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-slate-900/30 rounded-xl border border-slate-800 border-dashed">
                <p className="text-slate-500">{t.noMarkets}</p>
                <button 
                    onClick={() => setFilterTier('All')}
                    className="mt-4 text-indigo-400 hover:text-indigo-300 text-sm font-medium"
                >
                    {t.clearFilters}
                </button>
            </div>
        )}

        <div className="mt-12 text-center border-t border-slate-800 pt-8">
            <p className="text-slate-500 text-sm max-w-3xl mx-auto">
                {t.disclaimer}
            </p>
        </div>
      </main>
    </div>
  );
}

export default App;
