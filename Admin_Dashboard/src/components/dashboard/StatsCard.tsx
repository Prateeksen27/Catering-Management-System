import React from "react";
import { 
  CheckCircle, 
  Clock, 
  CalendarCheck2, 
  DollarSign,
  User
} from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value }) => {
  // Choose icon based on common titles
  const getIcon = () => {
    const lower = title.toLowerCase();
    if (lower.includes("completed")) return <CheckCircle className="h-6 w-6 text-success" />;
    if (lower.includes("pending")) return <Clock className="h-6 w-6 text-destructive" />;
    if (lower.includes("total")) return <CalendarCheck2 className="h-6 w-6 text-primary" />;
    if (lower.includes("revenue")) return <DollarSign className="h-6 w-6 text-primary" />;
    return <User className="h-6 w-6 text-muted-foreground" />; // fallback icon
  };

  return (
    <div className="stat-card h-[180px] rounded-xl shadow-md p-5 bg-white dark:bg-gray-900 flex flex-col justify-between">
      {/* Top Icon */}
      <div className="flex items-center justify-between">
        <div className="p-3 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
      </div>

      {/* Title and Value */}
      <div>
        <p className="text-muted-foreground text-sm mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
      </div>
    </div>
  );
};

export default StatsCard;
