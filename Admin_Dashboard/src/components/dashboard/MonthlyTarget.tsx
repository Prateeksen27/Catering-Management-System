import React from 'react';

interface MonthlyTargetProps {
  percentage: number;
}

const MonthlyTarget: React.FC<MonthlyTargetProps> = ({ percentage }) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="stat-card">
      <h3 className="text-lg font-semibold text-foreground mb-2">Monthly Target</h3>
      <p className="text-muted-foreground text-sm mb-6">Target you've set for each month</p>
      
      <div className="flex items-center justify-center">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              className="text-muted/30"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="6"
              fill="none"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="text-primary transition-all duration-500 ease-out"
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl font-bold text-foreground">{percentage}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">You earn <span className="font-semibold text-foreground">$3287</span> today, it's higher than last month.</p>
        <p className="text-sm text-muted-foreground">Keep up your good work!</p>
      </div>
    </div>
  );
};

export default MonthlyTarget;