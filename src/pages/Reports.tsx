
import React, { useState } from 'react';
import { usePortfolio, Asset } from '@/context/PortfolioContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { FileDown, FileCog } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Reports = () => {
  const { assets, totalValue } = usePortfolio();
  const { toast } = useToast();
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  
  const handleAssetToggle = (id: string) => {
    if (selectedAssets.includes(id)) {
      setSelectedAssets(selectedAssets.filter(assetId => assetId !== id));
    } else {
      setSelectedAssets([...selectedAssets, id]);
    }
  };
  
  const selectAllAssets = () => {
    setSelectedAssets(assets.map(asset => asset.id));
  };
  
  const clearAssetSelection = () => {
    setSelectedAssets([]);
  };
  
  const getFilteredAssets = () => {
    return selectedAssets.length === 0
      ? assets // If no selection, include all
      : assets.filter(asset => selectedAssets.includes(asset.id));
  };

  // Function to generate and download CSV
  const downloadCSV = () => {
    setIsGeneratingReport(true);
    
    // Simulate report generation (would be immediate in real app)
    setTimeout(() => {
      const filteredAssets = getFilteredAssets();
      
      // Generate CSV headers
      let csvContent = "Asset Name,Symbol,Type,Shares,Price,Total Value,Change %\n";
      
      // Generate CSV content
      filteredAssets.forEach(asset => {
        csvContent += `${asset.name},${asset.symbol},${asset.assetType},${asset.shares},${asset.price},${asset.value},${asset.change}\n`;
      });
      
      // Generate summary row
      const totalAssetValue = filteredAssets.reduce((sum, asset) => sum + asset.value, 0);
      csvContent += `\nTotal Portfolio Value,,,,,${totalAssetValue},`;
      
      // Create a download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `portfolio-report-${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setIsGeneratingReport(false);
      toast({
        title: "Report Downloaded",
        description: "Your portfolio report has been generated and downloaded.",
        duration: 3000
      });
    }, 1000);
  };
  
  // Asset performance statistics
  const calculatePerformanceStats = (assets: Asset[]) => {
    if (assets.length === 0) return { avgChange: 0, bestPerformer: null, worstPerformer: null };
    
    const totalChange = assets.reduce((sum, asset) => sum + asset.change, 0);
    const avgChange = totalChange / assets.length;
    
    const bestPerformer = [...assets].sort((a, b) => b.change - a.change)[0];
    const worstPerformer = [...assets].sort((a, b) => a.change - b.change)[0];
    
    return {
      avgChange,
      bestPerformer,
      worstPerformer
    };
  };
  
  const performanceStats = calculatePerformanceStats(getFilteredAssets());
  
  // Asset allocation
  const calculateAllocation = (assets: Asset[]) => {
    if (assets.length === 0) return { stocks: 0, crypto: 0, funds: 0 };
    
    const totalValue = assets.reduce((sum, asset) => sum + asset.value, 0);
    
    const stocksValue = assets
      .filter(asset => asset.assetType === 'stock')
      .reduce((sum, asset) => sum + asset.value, 0);
      
    const cryptoValue = assets
      .filter(asset => asset.assetType === 'crypto')
      .reduce((sum, asset) => sum + asset.value, 0);
      
    const fundsValue = assets
      .filter(asset => asset.assetType === 'fund')
      .reduce((sum, asset) => sum + asset.value, 0);
    
    return {
      stocks: (stocksValue / totalValue) * 100,
      crypto: (cryptoValue / totalValue) * 100,
      funds: (fundsValue / totalValue) * 100
    };
  };
  
  const allocation = calculateAllocation(getFilteredAssets());
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Portfolio Reports</h2>
        <p className="text-muted-foreground">
          Generate and download detailed reports of your investment portfolio.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>
            Select which assets to include in your report.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2 mb-4">
            <Button
              variant="outline"
              onClick={selectAllAssets}
            >
              Select All
            </Button>
            <Button
              variant="outline"
              onClick={clearAssetSelection}
            >
              Clear Selection
            </Button>
            <div className="grow"></div>
            <Button
              className="bg-green-600 hover:bg-green-700"
              onClick={downloadCSV}
              disabled={isGeneratingReport || assets.length === 0}
            >
              {isGeneratingReport ? (
                <>Generating...</>
              ) : (
                <>
                  <FileDown className="mr-2 h-4 w-4" />
                  Download CSV Report
                </>
              )}
            </Button>
          </div>
          
          <div className="border rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className="flex items-center space-x-2 border p-3 rounded-md"
                >
                  <Checkbox
                    id={`asset-${asset.id}`}
                    checked={selectedAssets.includes(asset.id)}
                    onCheckedChange={() => handleAssetToggle(asset.id)}
                  />
                  <label
                    htmlFor={`asset-${asset.id}`}
                    className="flex flex-1 justify-between cursor-pointer"
                  >
                    <div>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-sm text-muted-foreground">{asset.symbol}</div>
                    </div>
                    <div className="text-right">
                      <div>${asset.value.toLocaleString()}</div>
                      <div className={`text-sm ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {asset.change >= 0 ? '+' : ''}{asset.change}%
                      </div>
                    </div>
                  </label>
                </div>
              ))}
              
              {assets.length === 0 && (
                <div className="col-span-3 text-center py-8 text-muted-foreground">
                  No assets in your portfolio. Add assets to generate reports.
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="summary">
        <TabsList>
          <TabsTrigger value="summary">Report Summary</TabsTrigger>
          <TabsTrigger value="holdings">Holdings</TabsTrigger>
          <TabsTrigger value="allocation">Allocation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="summary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
              <CardDescription>
                Overview of your selected investments.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="border rounded-md p-4">
                    <div className="text-sm font-medium text-muted-foreground">Total Value</div>
                    <div className="text-2xl font-bold mt-1">
                      ${getFilteredAssets().reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {getFilteredAssets().length} assets selected
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="text-sm font-medium text-muted-foreground">Average Change</div>
                    <div className={`text-2xl font-bold mt-1 ${performanceStats.avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      {performanceStats.avgChange >= 0 ? '+' : ''}{performanceStats.avgChange.toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Recent performance
                    </div>
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="text-sm font-medium text-muted-foreground">Portfolio Percentage</div>
                    <div className="text-2xl font-bold mt-1">
                      {((getFilteredAssets().reduce((sum, asset) => sum + asset.value, 0) / totalValue) * 100).toFixed(2)}%
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      Of total portfolio value
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="border rounded-md p-4">
                    <div className="text-sm font-medium text-muted-foreground">Best Performer</div>
                    {performanceStats.bestPerformer ? (
                      <>
                        <div className="flex justify-between mt-2">
                          <div>
                            <div className="font-medium">{performanceStats.bestPerformer.name}</div>
                            <div className="text-sm text-muted-foreground">{performanceStats.bestPerformer.symbol}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-green-500 font-medium">
                              +{performanceStats.bestPerformer.change}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${performanceStats.bestPerformer.value.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-2">No assets selected</div>
                    )}
                  </div>
                  
                  <div className="border rounded-md p-4">
                    <div className="text-sm font-medium text-muted-foreground">Worst Performer</div>
                    {performanceStats.worstPerformer ? (
                      <>
                        <div className="flex justify-between mt-2">
                          <div>
                            <div className="font-medium">{performanceStats.worstPerformer.name}</div>
                            <div className="text-sm text-muted-foreground">{performanceStats.worstPerformer.symbol}</div>
                          </div>
                          <div className="text-right">
                            <div className={`${performanceStats.worstPerformer.change >= 0 ? 'text-green-500' : 'text-red-500'} font-medium`}>
                              {performanceStats.worstPerformer.change >= 0 ? '+' : ''}{performanceStats.worstPerformer.change}%
                            </div>
                            <div className="text-sm text-muted-foreground">
                              ${performanceStats.worstPerformer.value.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-sm text-muted-foreground mt-2">No assets selected</div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="holdings" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Holdings Report</CardTitle>
              <CardDescription>
                Detailed breakdown of your selected holdings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Asset</th>
                      <th scope="col" className="px-6 py-3">Type</th>
                      <th scope="col" className="px-6 py-3">Shares/Units</th>
                      <th scope="col" className="px-6 py-3 text-right">Price</th>
                      <th scope="col" className="px-6 py-3 text-right">Value</th>
                      <th scope="col" className="px-6 py-3 text-right">Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredAssets().length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-muted-foreground">
                          No assets selected for the report.
                        </td>
                      </tr>
                    ) : (
                      getFilteredAssets().map(asset => (
                        <tr key={asset.id} className="bg-white border-b">
                          <td className="px-6 py-4 font-medium">
                            <div>
                              <div>{asset.name}</div>
                              <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs 
                              ${asset.assetType === 'stock' 
                                ? 'bg-blue-100 text-blue-800' 
                                : asset.assetType === 'crypto' 
                                  ? 'bg-purple-100 text-purple-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                              {asset.assetType === 'stock' 
                                ? 'Stock' 
                                : asset.assetType === 'crypto' 
                                  ? 'Crypto' 
                                  : 'Fund'}
                            </span>
                          </td>
                          <td className="px-6 py-4">{asset.shares}</td>
                          <td className="px-6 py-4 text-right">${asset.price}</td>
                          <td className="px-6 py-4 text-right">${asset.value.toLocaleString()}</td>
                          <td className={`px-6 py-4 text-right ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {asset.change >= 0 ? '+' : ''}{asset.change}%
                          </td>
                        </tr>
                      ))
                    )}
                    
                    {getFilteredAssets().length > 0 && (
                      <tr className="bg-gray-50 font-medium">
                        <td colSpan={4} className="px-6 py-4 text-right">
                          Total:
                        </td>
                        <td className="px-6 py-4 text-right">
                          ${getFilteredAssets().reduce((sum, asset) => sum + asset.value, 0).toLocaleString()}
                        </td>
                        <td></td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="allocation" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Asset Allocation</CardTitle>
              <CardDescription>
                How your investments are distributed across asset classes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredAssets().length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No assets selected for allocation analysis.
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="border rounded-md p-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                          <div className="font-medium">Stocks</div>
                        </div>
                        <div className="text-2xl font-bold mt-2">{allocation.stocks.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${getFilteredAssets()
                            .filter(asset => asset.assetType === 'stock')
                            .reduce((sum, asset) => sum + asset.value, 0)
                            .toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                          <div className="font-medium">Cryptocurrency</div>
                        </div>
                        <div className="text-2xl font-bold mt-2">{allocation.crypto.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${getFilteredAssets()
                            .filter(asset => asset.assetType === 'crypto')
                            .reduce((sum, asset) => sum + asset.value, 0)
                            .toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="border rounded-md p-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
                          <div className="font-medium">Funds</div>
                        </div>
                        <div className="text-2xl font-bold mt-2">{allocation.funds.toFixed(1)}%</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          ${getFilteredAssets()
                            .filter(asset => asset.assetType === 'fund')
                            .reduce((sum, asset) => sum + asset.value, 0)
                            .toLocaleString()}
                        </div>
                      </div>
                    </div>
                    
                    {/* Allocation bar */}
                    <div className="mt-6">
                      <div className="text-sm font-medium mb-2">Asset Allocation</div>
                      <div className="w-full h-8 flex rounded-md overflow-hidden">
                        <div
                          className="bg-blue-500 h-full"
                          style={{ width: `${allocation.stocks}%` }}
                          title={`Stocks: ${allocation.stocks.toFixed(1)}%`}
                        ></div>
                        <div
                          className="bg-purple-500 h-full"
                          style={{ width: `${allocation.crypto}%` }}
                          title={`Crypto: ${allocation.crypto.toFixed(1)}%`}
                        ></div>
                        <div
                          className="bg-amber-500 h-full"
                          style={{ width: `${allocation.funds}%` }}
                          title={`Funds: ${allocation.funds.toFixed(1)}%`}
                        ></div>
                      </div>
                      
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                          <span>Stocks</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                          <span>Cryptocurrency</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-amber-500 rounded-full mr-1"></div>
                          <span>Funds</span>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
