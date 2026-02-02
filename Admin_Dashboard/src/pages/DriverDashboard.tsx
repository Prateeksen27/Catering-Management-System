import React from "react";
import { Truck, MapPin, CheckSquare } from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

const DriverDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Driver Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Your delivery assignments for today
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard title="Assigned Deliveries" value={12} icon={<Truck />} />
        <StatsCard title="Completed" value={9} icon={<CheckSquare />} />
        <StatsCard title="Distance Covered" value="46 km" icon={<MapPin />} />
      </div>

      <div className="p-4 sm:p-6 bg-white border rounded-xl">
        <h3 className="font-semibold mb-4">Next Stops</h3>
        <ul className="space-y-3 text-sm sm:text-base">
          <li>📍 Sector 21 – Order #1042</li>
          <li>📍 MG Road – Order #1045</li>
          <li>📍 Airport Road – Order #1048</li>
        </ul>
      </div>
    </div>
  );
};

export default DriverDashboard;
