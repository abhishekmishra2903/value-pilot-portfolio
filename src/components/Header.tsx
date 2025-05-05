
import React from 'react';
import { useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Bell, Settings, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Header = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  const getPageTitle = (pathname: string) => {
    switch(pathname) {
      case '/':
        return 'Portfolio Dashboard';
      case '/holdings':
        return 'Manage Holdings';
      case '/performance':
        return 'Performance Analysis';
      case '/reports':
        return 'Portfolio Reports';
      default:
        return 'Portfolio Manager';
    }
  };

  const refreshData = () => {
    toast({
      title: "Portfolio Refreshed",
      description: "Latest market data has been fetched.",
      duration: 3000,
    });
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-6 h-16">
        <h1 className="text-xl font-semibold">{getPageTitle(location.pathname)}</h1>
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={refreshData}
            className="text-muted-foreground hover:text-foreground"
          >
            <RefreshCw size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Bell size={18} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Settings size={18} />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
