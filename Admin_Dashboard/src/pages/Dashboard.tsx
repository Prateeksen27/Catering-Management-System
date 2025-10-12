import React, { useEffect } from 'react';
import { Users, Package } from 'lucide-react';
import StatsCard from '@/components/dashboard/StatsCard';
import MonthlySalesChart from '@/components/dashboard/MonthlySalesChart';
import MonthlyTarget from '@/components/dashboard/MonthlyTarget';
import RevenueMetrics from '@/components/dashboard/RevenueMetrics';
import StatisticsSection from '@/components/dashboard/StatisticsSection';
import { useBookingStore } from '../store/useBookingStore';
import { useEmployeeStore } from '../store/useEmployeeStore';

const Dashboard: React.FC = () => {
  const { pendingBookings, fetchAllPendingBookings, isLoading: bookingLoading } = useBookingStore();
  const { employees, fetchAllEmployees, isLoading: employeeLoading } = useEmployeeStore();

  useEffect(() => {
    fetchAllPendingBookings();
    fetchAllEmployees();
  }, [fetchAllPendingBookings, fetchAllEmployees]);
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatsCard
          title="Pending Bookings"
          value={bookingLoading ? 'Loading...' : pendingBookings.length}
          icon={<Users className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Completed"
          value="5,359"
          icon={<Package className="h-6 w-6 text-primary" />}
        />
        <StatsCard
          title="Employees"
          value={employeeLoading ? 'Loading...' : employees.length}
          icon={<Users className="h-6 w-6 text-primary" />}
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