
import { MarketData } from '../types';
import { MOCK_MARKETS } from './mockData';

const PENDLE_API_BASE = 'https://api-v2.pendle.finance/core/v1';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

// Chain IDs: 1 = Ethereum, 42161 = Arbitrum, 56 = BNB Chain
const CHAINS = [1, 42161];

export const fetchPendleMarkets = async (): Promise<MarketData[]> => {
  try {
    const allMarkets: MarketData[] = [];

    // Fetch from multiple chains in parallel
    const requests = CHAINS.map(async (chainId) => {
      try {
        const targetUrl = `${PENDLE_API_BASE}/${chainId}/markets?order_by=liquidity%3Adesc&skip=0&limit=20&is_active=true&is_expired=false`;
        // Use Proxy to bypass CORS
        const response = await fetch(CORS_PROXY + encodeURIComponent(targetUrl));
        
        if (!response.ok) {
          console.warn(`Failed to fetch chain ${chainId}: ${response.statusText}`);
          return [];
        }

        const data = await response.json();
        
        // Map API response to our MarketData structure
        return (data.results || []).map((m: any): MarketData => {
          const impliedAPY = (m.impliedApy || 0) * 100;
          const underlyingAPY = (m.underlyingApy || 0) * 100;
          const expiryDate = new Date(m.expiry);
          
          // Leverage Calculation Simulation
          // Since API doesn't provide explicit leverage, we estimate it based on duration.
          // YT Leverage is roughly 1 / Duration(Years). E.g. 0.1 year duration ~ 10x leverage.
          // We clamp it between 1x and 100x.
          const daysToMaturity = Math.max(1, (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          const yearsToMaturity = daysToMaturity / 365;
          let estimatedLeverage = 1 / yearsToMaturity;
          
          // Apply some randomness to make it look realistic if data is missing, 
          // or refine based on yield if possible.
          // For Safety, clamp:
          if (estimatedLeverage > 50) estimatedLeverage = 50;
          if (estimatedLeverage < 1) estimatedLeverage = 1;

          // Mocking history for trend analysis
          // (Real history requires separate API calls per ID, skipping for performance in this demo)
          const mockHistory = Array.from({ length: 7 }).map((_, i) => {
            const noise = (Math.random() - 0.5) * 2; 
            // Create a synthetic trend based on the spread. 
            // If Good Spread -> Slightly Upward trend simulation
            const trendBias = (underlyingAPY - impliedAPY) > 0 ? 0.1 : -0.1;
            return underlyingAPY + noise - ((3 - i) * trendBias); 
          });

          // Protocol & Symbol Safe Extraction
          const protocolName = m.protocol || m.name.split(' ')[0] || 'Unknown';
          // Handle 'PT-eETH' -> 'eETH'
          const symbol = m.pt?.symbol?.replace(/^PT-/, '') || m.accountingAsset?.symbol || m.name;

          // Construct Pendle Market URL
          const marketUrl = `https://app.pendle.finance/trade/markets/${m.address}/swap?view=yt&chain=${chainId}`;

          // Image Handling
          // Pendle API structure for images varies.
          const image1 = m.inputToken?.logos?.[0];
          const image2 = m.underlyingAsset?.logos?.[0];
          const image3 = m.accountingAsset?.logos?.[0];
          const imageUrl = image1 || image2 || image3 || 'https://cryptologos.cc/logos/ethereum-eth-logo.png';

          return {
            id: m.address,
            name: m.name,
            protocol: protocolName,
            symbol: symbol,
            expiry: expiryDate,
            impliedAPY: impliedAPY,
            underlyingAPY: underlyingAPY,
            historicalUnderlyingAPY: mockHistory,
            imageUrl: imageUrl,
            marketUrl: marketUrl,
            leverage: parseFloat(estimatedLeverage.toFixed(1)),
          };
        });
      } catch (innerError) {
        console.warn(`Error processing chain ${chainId}`, innerError);
        return [];
      }
    });

    const results = await Promise.all(requests);
    results.forEach(chainData => allMarkets.push(...chainData));

    // Filter out invalid data if any
    const validMarkets = allMarkets.filter(m => m.impliedAPY >= 0 && m.underlyingAPY >= 0);

    console.log(`Fetched ${validMarkets.length} markets from API.`);
    return validMarkets.length > 0 ? validMarkets : MOCK_MARKETS;
    
  } catch (error) {
    console.error("CRITICAL Error fetching Pendle data:", error);
    return MOCK_MARKETS;
  }
};
