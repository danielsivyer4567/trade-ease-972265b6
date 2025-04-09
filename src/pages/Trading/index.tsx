
import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { WatchList } from './components/WatchList';
import { MarketOverview } from './components/MarketOverview';
import { RecentTrades } from './components/RecentTrades';

export default function TradingPage() {
  return (
    <BaseLayout>
      <div className="container px-4 py-6 mx-auto">
        <h1 className="text-2xl font-bold mb-6">Trading Platform</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <MarketOverview />
            <div className="mt-6">
              <RecentTrades />
            </div>
          </div>
          <div>
            <WatchList />
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
