
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define types for our portfolio data
export type Asset = {
  id: string;
  name: string;
  symbol: string;
  assetType: 'stock' | 'crypto' | 'fund';
  shares: number;
  price: number;
  value: number;
  change: number;
  history: { date: string; value: number }[];
};

export type PortfolioContextType = {
  assets: Asset[];
  totalValue: number;
  addAsset: (asset: Omit<Asset, 'id' | 'value' | 'history'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  removeAsset: (id: string) => void;
  generatePerformanceData: () => { date: string; value: number }[];
  loading: boolean;
};

// Create the context
const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

// Dummy data generator functions
const generateRandomHistory = (days: number, startPrice: number, volatility: number) => {
  const history: { date: string; value: number }[] = [];
  let currentPrice = startPrice;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Random price movement, more volatile for crypto
    const change = (Math.random() - 0.5) * volatility * currentPrice;
    currentPrice = Math.max(0.1, currentPrice + change);
    
    history.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(currentPrice.toFixed(2))
    });
  }
  
  return history;
};

// Demo data
const initialAssets: Asset[] = [
  {
    id: '1',
    name: 'Apple Inc.',
    symbol: 'AAPL',
    assetType: 'stock',
    shares: 10,
    price: 175.34,
    value: 1753.40,
    change: 2.34,
    history: generateRandomHistory(30, 170, 0.01)
  },
  {
    id: '2',
    name: 'Microsoft Corporation',
    symbol: 'MSFT',
    assetType: 'stock',
    shares: 5,
    price: 324.76,
    value: 1623.80,
    change: 1.12,
    history: generateRandomHistory(30, 320, 0.01)
  },
  {
    id: '3',
    name: 'Bitcoin',
    symbol: 'BTC',
    assetType: 'crypto',
    shares: 0.25,
    price: 52341.20,
    value: 13085.30,
    change: 5.67,
    history: generateRandomHistory(30, 50000, 0.02)
  },
  {
    id: '4',
    name: 'Ethereum',
    symbol: 'ETH',
    assetType: 'crypto',
    shares: 2,
    price: 2812.45,
    value: 5624.90,
    change: -2.21,
    history: generateRandomHistory(30, 2900, 0.025)
  },
  {
    id: '5',
    name: 'Vanguard S&P 500 ETF',
    symbol: 'VOO',
    assetType: 'fund',
    shares: 8,
    price: 452.12,
    value: 3616.96,
    change: 0.87,
    history: generateRandomHistory(30, 448, 0.007)
  },
  {
    id: '6',
    name: 'Fidelity 500 Index Fund',
    symbol: 'FXAIX',
    assetType: 'fund',
    shares: 25,
    price: 182.47,
    value: 4561.75,
    change: 0.65,
    history: generateRandomHistory(30, 180, 0.006)
  }
];

// Create the provider
export const PortfolioProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>(initialAssets);
  const [loading, setLoading] = useState(true);

  // Calculate total portfolio value
  const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Add a new asset
  const addAsset = (asset: Omit<Asset, 'id' | 'value' | 'history'>) => {
    const value = asset.shares * asset.price;
    const newAsset: Asset = {
      ...asset,
      id: Date.now().toString(),
      value,
      history: generateRandomHistory(30, asset.price, asset.assetType === 'crypto' ? 0.02 : 0.01)
    };
    setAssets([...assets, newAsset]);
  };

  // Update an existing asset
  const updateAsset = (id: string, updatedFields: Partial<Asset>) => {
    setAssets(assets.map(asset => {
      if (asset.id === id) {
        const updated = { ...asset, ...updatedFields };
        // Recalculate value if shares or price changed
        if (updatedFields.shares !== undefined || updatedFields.price !== undefined) {
          updated.value = updated.shares * updated.price;
        }
        return updated;
      }
      return asset;
    }));
  };

  // Remove an asset
  const removeAsset = (id: string) => {
    setAssets(assets.filter(asset => asset.id !== id));
  };

  // Generate aggregate performance data
  const generatePerformanceData = () => {
    // Start with first asset's dates as template
    if (assets.length === 0 || !assets[0].history.length) return [];
    
    const dates = assets[0].history.map(point => point.date);
    const result: { date: string; value: number }[] = [];

    dates.forEach((date, index) => {
      const totalForDay = assets.reduce((sum, asset) => {
        const historyPoint = asset.history[index];
        return sum + (historyPoint ? historyPoint.value * asset.shares : 0);
      }, 0);
      
      result.push({
        date,
        value: parseFloat(totalForDay.toFixed(2))
      });
    });

    return result;
  };

  return (
    <PortfolioContext.Provider value={{
      assets,
      totalValue,
      addAsset,
      updateAsset,
      removeAsset,
      generatePerformanceData,
      loading
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

// Custom hook to use the portfolio context
export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
