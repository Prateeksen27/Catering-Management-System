import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const StatisticsSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState('Monthly');

  const tabs = ['Monthly', 'Quarterly', 'Annually'];

  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Statistics</h3>
          <p className="text-sm text-muted-foreground">Target you've set for each month</p>
        </div>
        
        <div className="flex bg-muted rounded-lg p-1">
          {tabs.map((tab) => (
            <Button
              key={tab}
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-all duration-200",
                activeTab === tab
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="text-center py-8 text-muted-foreground">
          <p>Statistics data for {activeTab} view</p>
          <p className="text-sm mt-2">Implementation depends on your specific requirements</p>
        </div>
      </div>
    </div>
  );
};

export default StatisticsSection;