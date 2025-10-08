import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

const RevenueMetrics: React.FC = () => {
  const metrics = [
    { label: 'Target', value: '$20K', trend: 'down' },
    { label: 'Revenue', value: '$20K', trend: 'up' },
    { label: 'Today', value: '$20K', trend: 'up' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mt-6">
      {metrics.map((metric, index) => (
        <div key={index} className="text-center">
          <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-semibold text-foreground">{metric.value}</span>
            {metric.trend === 'up' ? (
              <TrendingUp className="h-4 w-4 text-success" />
            ) : (
              <TrendingDown className="h-4 w-4 text-destructive" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RevenueMetrics;