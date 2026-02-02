import React from "react";
import {
  Users,
  Package,
  IndianRupee,
  TrendingUp
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

const ManagerDashboard: React.FC = () => {
  const stats = {
    revenue: "₹4,20,000",
    totalBookings: 124,
    pendingBookings: 26,
    employees: 26
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Manager Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Business performance overview
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard title="Monthly Revenue" value={stats.revenue} icon={<IndianRupee />} />
        <StatsCard title="Total Bookings" value={stats.totalBookings} icon={<Package />} />
        <StatsCard title="Pending Bookings" value={stats.pendingBookings} icon={<TrendingUp />} />
        <StatsCard title="Employees" value={stats.employees} icon={<Users />} />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="p-4 sm:p-6 bg-white border rounded-xl">
          <h3 className="font-semibold mb-3">Today’s Highlights</h3>
          <ul className="text-sm sm:text-base space-y-2 text-muted-foreground">
            <li>• Peak hours: 1PM – 3PM</li>
            <li>• Delivery success rate: 92%</li>
            <li>• 3 new enterprise clients</li>
          </ul>
        </div>

        <div className="p-4 sm:p-6 bg-white border rounded-xl">
          <h3 className="font-semibold mb-3">Staff Status</h3>
          <p className="text-sm sm:text-base">
            24 Active • 2 On Leave
          </p>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
