
import React, { useState } from 'react';
import { usePortfolio } from '@/context/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import PerformanceChart from '@/components/PerformanceChart';

const Performance = () => {
  const { assets, generatePerformanceData } = usePortfolio();
  const [selectedAsset, setSelectedAsset] = useState<string | 'all'>('all');
  
  const overallPerformance = generatePerformanceData();
  
  // Get data for selected asset or overall portfolio
  const getChartData = () => {
    if (selectedAsset === 'all') {
      return overallPerformance;
    } else {
      const asset = assets.find(a => a.id === selectedAsset);
      return asset ? asset.history.map(h => ({
        date: h.date,
        value: h.value * asset.shares
      })) : [];
    }
  };
  
  // Get asset color based on type
  const getAssetColor = (assetType: string) => {
    switch (assetType) {
      case 'stock':
        return '#3b82f6';  // blue
      case 'crypto':
        return '#8b5cf6';  // purple
      case 'fund':
        return '#f59e0b';  // amber
      default:
        return '#3ecf60';  // green
    }
  };

  // Get title for the performance chart
  const getChartTitle = () => {
    if (selectedAsset === 'all') {
      return 'Portfolio Performance';
    } else {
      const asset = assets.find(a => a.id === selectedAsset);
      return asset ? `${asset.name} (${asset.symbol})` : 'Asset Performance';
    }
  };
  
  // Sort assets alphabetically by name
  const sortedAssets = [...assets].sort((a, b) => a.name.localeCompare(b.name));
  
  // Calculate performance metrics
  const calculateMetrics = () => {
    const data = getChartData();
    if (!data.length) return { average: 0, highest: 0, lowest: 0, volatility: 0 };
    
    const values = data.map(d => d.value);
    const sum = values.reduce((a, b) => a + b, 0);
    const average = sum / values.length;
    const highest = Math.max(...values);
    const lowestValue = Math.min(...values);
    
    // Calculate volatility (standard deviation)
    const squareDiffs = values.map(value => {
      const diff = value - average;
      return diff * diff;
    });
    const avgSquareDiff = squareDiffs.reduce((a, b) => a + b, 0) / squareDiffs.length;
    const volatility = Math.sqrt(avgSquareDiff) / average * 100; // as percentage
    
    return {
      average: parseFloat(average.toFixed(2)),
      highest,
      lowest: lowestValue,
      volatility: parseFloat(volatility.toFixed(2))
    };
  };
  
  const metrics = calculateMetrics();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Performance Analysis</h2>
          <p className="text-muted-foreground">
            Track and analyze the performance of your investments over time.
          </p>
        </div>
        
        <div className="w-full md:w-64">
          <Select value={selectedAsset} onValueChange={setSelectedAsset}>
            <SelectTrigger>
              <SelectValue placeholder="Select asset" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Entire Portfolio</SelectItem>
              <SelectItem value="stocks-group" disabled className="font-semibold">
                Stocks
              </SelectItem>
              {sortedAssets
                .filter(asset => asset.assetType === 'stock')
                .map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.symbol})
                  </SelectItem>
                ))}
              <SelectItem value="crypto-group" disabled className="font-semibold">
                Cryptocurrency
              </SelectItem>
              {sortedAssets
                .filter(asset => asset.assetType === 'crypto')
                .map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.symbol})
                  </SelectItem>
                ))}
              <SelectItem value="funds-group" disabled className="font-semibold">
                Funds
              </SelectItem>
              {sortedAssets
                .filter(asset => asset.assetType === 'fund')
                .map(asset => (
                  <SelectItem key={asset.id} value={asset.id}>
                    {asset.name} ({asset.symbol})
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Performance Chart */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>{getChartTitle()}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <PerformanceChart 
              data={getChartData()}
              title="30 Day Performance"
              color={selectedAsset !== 'all' 
                ? getAssetColor(assets.find(a => a.id === selectedAsset)?.assetType || '')
                : undefined
              }
            />
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Average Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${metrics.average.toLocaleString()}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Highest Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${metrics.highest.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Lowest Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${metrics.lowest.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Volatility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.volatility}%
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              Standard deviation as % of mean
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Historical Performance */}
      {selectedAsset !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Value History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3">Date</th>
                    <th scope="col" className="px-6 py-3 text-right">Value</th>
                    <th scope="col" className="px-6 py-3 text-right">Change</th>
                  </tr>
                </thead>
                <tbody>
                  {getChartData().map((dataPoint, index, arr) => {
                    // Calculate day-over-day change
                    const previousValue = index > 0 ? arr[index - 1].value : dataPoint.value;
                    const change = ((dataPoint.value - previousValue) / previousValue) * 100;
                    
                    return (
                      <tr key={dataPoint.date} className="bg-white border-b">
                        <td className="px-6 py-4">{dataPoint.date}</td>
                        <td className="px-6 py-4 text-right">${dataPoint.value.toLocaleString()}</td>
                        <td className={`px-6 py-4 text-right ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {index === 0 ? '-' : (
                            <>
                              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Performance;
