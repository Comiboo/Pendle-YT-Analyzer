
import { MarketData } from '../types';

// Helper to add days to current date
const addDays = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

// Mock Data mimicking Pendle Markets
export const MOCK_MARKETS: MarketData[] = [
  {
    id: '1',
    name: 'Ether.fi eETH (26 Dec 2024)',
    protocol: 'Ether.fi',
    symbol: 'eETH',
    expiry: addDays(120), // ~4 months out
    impliedAPY: 12.5,
    underlyingAPY: 18.2, // Gap > 3%, Strong
    historicalUnderlyingAPY: [17.0, 17.2, 17.5, 17.8, 18.0, 18.1, 18.2], // Uptrend
    imageUrl: 'https://picsum.photos/id/1/200/200', // Placeholder
    marketUrl: 'https://app.pendle.finance/trade/markets',
    leverage: 15.2,
  },
  {
    id: '2',
    name: 'Ethena USDe (24 Oct 2024)',
    protocol: 'Ethena',
    symbol: 'USDe',
    expiry: addDays(45), // > 30 days
    impliedAPY: 25.0,
    underlyingAPY: 15.0, // Negative spread (Bad for YT)
    historicalUnderlyingAPY: [20.0, 19.0, 18.5, 17.0, 16.0, 15.5, 15.0], // Downtrend
    imageUrl: 'https://picsum.photos/id/2/200/200',
    marketUrl: 'https://app.pendle.finance/trade/markets',
    leverage: 8.5,
  },
  {
    id: '3',
    name: 'Renzo ezETH (26 Dec 2024)',
    protocol: 'Renzo',
    symbol: 'ezETH',
    expiry: addDays(120),
    impliedAPY: 14.0,
    underlyingAPY: 16.5, // Gap < 3% (2.5%)
    historicalUnderlyingAPY: [16.0, 16.1, 16.0, 16.2, 16.3, 16.4, 16.5], // Slight Uptrend
    imageUrl: 'https://picsum.photos/id/3/200/200',
    marketUrl: 'https://app.pendle.finance/trade/markets',
    leverage: 12.1,
  },
  {
    id: '4',
    name: 'Kelp DAO rsETH (Short Term)',
    protocol: 'Kelp DAO',
    symbol: 'rsETH',
    expiry: addDays(15), // < 30 Days (Penalty)
    impliedAPY: 8.0,
    underlyingAPY: 12.0, // Good gap, but maturity risk
    historicalUnderlyingAPY: [11.0, 11.2, 11.5, 11.8, 11.9, 12.0, 12.0],
    imageUrl: 'https://picsum.photos/id/4/200/200',
    marketUrl: 'https://app.pendle.finance/trade/markets',
    leverage: 35.0, // High leverage due to short maturity
  },
  {
    id: '5',
    name: 'Puffer pufETH (High Volatility)',
    protocol: 'Puffer',
    symbol: 'pufETH',
    expiry: addDays(90),
    impliedAPY: 10.0,
    underlyingAPY: 14.5, // Gap > 3%
    historicalUnderlyingAPY: [14.5, 14.0, 13.5, 13.0, 13.5, 14.0, 14.5], // Volatile/Recovering
    imageUrl: 'https://picsum.photos/id/5/200/200',
    marketUrl: 'https://app.pendle.finance/trade/markets',
    leverage: 18.4,
  },
];
