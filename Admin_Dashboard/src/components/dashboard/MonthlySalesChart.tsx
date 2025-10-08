import React from 'react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';

const data = [
  { name: 'Jan', value: 150 },
  { name: 'Feb', value: 380 },
  { name: 'Mar', value: 200 },
  { name: 'Apr', value: 280 },
  { name: 'May', value: 180 },
  { name: 'Jun', value: 200 },
  { name: 'Jul', value: 300 },
  { name: 'Aug', value: 120 },
  { name: 'Sep', value: 200 },
  { name: 'Oct', value: 380 },
  { name: 'Nov', value: 250 },
  { name: 'Dec', value: 150 },
];

const MonthlySalesChart: React.FC = () => {
  return (
    <div className="chart-container">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">Monthly Sales</h3>
        <Button variant="ghost" size="sm">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
              dataKey="name" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
              domain={[0, 400]}
              ticks={[0, 100, 200, 300, 400]}
            />
            <Bar 
              dataKey="value" 
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MonthlySalesChart;