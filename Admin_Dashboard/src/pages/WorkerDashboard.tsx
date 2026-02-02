import React from "react";
import {
  ClipboardList,
  CalendarCheck,
  Activity
} from "lucide-react";
import StatsCard from "@/components/dashboard/StatsCard";

const WorkerDashboard: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
          Worker Dashboard
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Your daily task overview
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatsCard title="Tasks Assigned" value={6} icon={<ClipboardList />} />
        <StatsCard title="Tasks Completed" value={4} icon={<Activity />} />
        <StatsCard title="Attendance" value="Present" icon={<CalendarCheck />} />
      </div>

      <div className="p-4 sm:p-6 bg-white border rounded-xl">
        <h3 className="font-semibold mb-4">Today’s Tasks</h3>
        <ul className="space-y-2 text-sm sm:text-base">
          <li>✔ Clean storage area</li>
          <li>✔ Assist loading supplies</li>
          <li>⏳ Inventory count</li>
        </ul>
      </div>
    </div>
  );
};

export default WorkerDashboard;
