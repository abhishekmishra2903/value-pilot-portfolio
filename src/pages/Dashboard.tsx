import React from 'react';
import { usePortfolio, Asset } from '@/context/PortfolioContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AssetCard from '@/components/AssetCard';
import PerformanceChart from '@/components/PerformanceChart';
import AssetAllocationChart, { AssetAllocation } from '@/components/AssetAllocationChart';
import { Skeleton } from '@/components/ui/skeleton';
const Dashboard = () => {
  const {
    assets,
    totalValue,
    generatePerformanceData,
    loading
  } = usePortfolio();

  // Create allocation data for the pie chart
  const getAllocationData = (): AssetAllocation[] => {
    const stocksValue = assets.filter(asset => asset.assetType === 'stock').reduce((sum, asset) => sum + asset.value, 0);
    const cryptoValue = assets.filter(asset => asset.assetType === 'crypto').reduce((sum, asset) => sum + asset.value, 0);
    const fundsValue = assets.filter(asset => asset.assetType === 'fund').reduce((sum, asset) => sum + asset.value, 0);
    return [{
      name: 'Stocks',
      value: stocksValue,
      color: '#3b82f6'
    }, {
      name: 'Crypto',
      value: cryptoValue,
      color: '#8b5cf6'
    }, {
      name: 'Funds',
      value: fundsValue,
      color: '#f59e0b'
    }];
  };

  // Get top performers
  const getTopPerformers = (): Asset[] => {
    return [...assets].sort((a, b) => b.change - a.change).slice(0, 3);
  };

  // Get overall performance data
  const performanceData = generatePerformanceData();

  // Calculate overall change percentage
  const calculateOverallChange = () => {
    if (!performanceData.length) return 0;
    const firstValue = performanceData[0]?.value || 0;
    const lastValue = performanceData[performanceData.length - 1]?.value || 0;
    return (lastValue - firstValue) / firstValue * 100;
  };
  const overallChange = calculateOverallChange();
  if (loading) {
    return <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-[400px]" />
      </div>;
  }
  return <div className="This div is overlapping over the left pane in all the pages. Fix that\n">
      {/* Portfolio Value Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <div className={`mt-1 text-sm ${overallChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {overallChange >= 0 ? '+' : ''}{overallChange.toFixed(2)}% overall
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${assets.filter(asset => asset.assetType === 'stock').reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {assets.filter(asset => asset.assetType === 'stock').length} holdings
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cryptocurrency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              ${assets.filter(asset => asset.assetType === 'crypto').reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {assets.filter(asset => asset.assetType === 'crypto').length} holdings
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Funds
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              ${assets.filter(asset => asset.assetType === 'fund').reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">
              {assets.filter(asset => asset.assetType === 'fund').length} holdings
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Performance Chart and Asset Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <PerformanceChart data={performanceData} title="30 Day Performance" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
            </CardHeader>
            <CardContent>
              <AssetAllocationChart data={getAllocationData()} />
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getTopPerformers().map(asset => <AssetCard key={asset.id} name={asset.name} symbol={asset.symbol} value={asset.value} change={asset.change} shares={asset.shares} price={asset.price} assetType={asset.assetType} />)}
          </div>
        </CardContent>
      </Card>
      
      {/* Assets by Type */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Assets</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="funds">Funds</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.map(asset => <AssetCard key={asset.id} name={asset.name} symbol={asset.symbol} value={asset.value} change={asset.change} shares={asset.shares} price={asset.price} assetType={asset.assetType} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="stocks" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.filter(asset => asset.assetType === 'stock').map(asset => <AssetCard key={asset.id} name={asset.name} symbol={asset.symbol} value={asset.value} change={asset.change} shares={asset.shares} price={asset.price} assetType={asset.assetType} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="crypto" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.filter(asset => asset.assetType === 'crypto').map(asset => <AssetCard key={asset.id} name={asset.name} symbol={asset.symbol} value={asset.value} change={asset.change} shares={asset.shares} price={asset.price} assetType={asset.assetType} />)}
          </div>
        </TabsContent>
        
        <TabsContent value="funds" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {assets.filter(asset => asset.assetType === 'fund').map(asset => <AssetCard key={asset.id} name={asset.name} symbol={asset.symbol} value={asset.value} change={asset.change} shares={asset.shares} price={asset.price} assetType={asset.assetType} />)}
          </div>
        </TabsContent>
      </Tabs>
    </div>;
};
export default Dashboard;