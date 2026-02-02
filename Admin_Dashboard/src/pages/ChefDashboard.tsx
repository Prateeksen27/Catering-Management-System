import React from "react";
import { Flame, Clock, CheckCircle } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

const ChefDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Chef Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Kitchen workload & preparation status
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard title="Pending Orders" value={18} icon={<Clock />} />
        <StatsCard title="Cooking Now" value={7} icon={<Flame />} />
        <StatsCard title="Completed Today" value={42} icon={<CheckCircle />} />
      </div>

      <div className="p-4 sm:p-6 bg-white border rounded-xl">
        <h3 className="font-semibold mb-4">Orders In Progress</h3>
        <ul className="space-y-3 text-sm sm:text-base">
          <li>🍲 #1021 – Chicken Biryani (High Priority)</li>
          <li>🍝 #1024 – Alfredo Pasta</li>
          <li>🍛 #1027 – Veg Thali</li>
        </ul>
      </div>
    </div>
  );
};

export default ChefDashboard;
