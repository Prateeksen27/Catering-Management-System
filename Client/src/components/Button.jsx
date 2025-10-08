import React from "react";
import { cn } from "../lib/utils.js" // optional helper for class merging

export const Button = ({ children, variant = "primary", size = "md", className, ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-medium transition-colors duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500",
    burgundy: "bg-[#7B2D26] text-white hover:bg-[#5e211d] focus:ring-[#7B2D26]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};
