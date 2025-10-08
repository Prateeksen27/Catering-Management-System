import React from 'react';
import { Users, Package } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import MonthlySalesChart from '@/components/dashboard/MonthlySalesChart';
import MonthlyTarget from '@/components/dashboard/MonthlyTarget';
import RevenueMetrics from '@/components/dashboard/RevenueMetrics';
import StatisticsSection from '@/components/dashboard/StatisticsSection';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <StatsCard
          title="Customers"
          value="3,782"
          change={11.01}
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Orders"
          value="5,359"
          change={-9.05}
          icon={<Package className="h-6 w-6 text-primary" />}
        />
        <div className="hidden xl:block">
          <MonthlyTarget percentage={75} />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MonthlySalesChart />
          <div className="xl:hidden">
            <MonthlyTarget percentage={75} />
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="stat-card">
            <RevenueMetrics />
          </div>
          <StatisticsSection />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;