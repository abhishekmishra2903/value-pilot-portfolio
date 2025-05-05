
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface AssetCardProps {
  name: string;
  symbol: string;
  value: number;
  change: number;
  shares?: number;
  price?: number;
  assetType: 'stock' | 'crypto' | 'fund';
}

const AssetCard: React.FC<AssetCardProps> = ({ 
  name, 
  symbol, 
  value, 
  change, 
  shares, 
  price,
  assetType
}) => {
  const isPositive = change >= 0;
  
  const getAssetTypeColor = () => {
    switch(assetType) {
      case 'stock':
        return 'bg-blue-100 text-blue-800';
      case 'crypto':
        return 'bg-purple-100 text-purple-800';
      case 'fund':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base font-medium">{name}</CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">{symbol}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${getAssetTypeColor()}`}>
              {assetType === 'stock' ? 'Stock' : assetType === 'crypto' ? 'Crypto' : 'Fund'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="mt-2">
          <div className="font-medium">${value.toLocaleString()}</div>
          <div className="flex items-center mt-1">
            {isPositive ? (
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
            )}
            <span 
              className={`text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}
            >
              {isPositive && '+'}{change.toFixed(2)}%
            </span>
          </div>
        </div>
        {shares !== undefined && price !== undefined && (
          <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>Shares</span>
              <span>{shares}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Price</span>
              <span>${price}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AssetCard;
