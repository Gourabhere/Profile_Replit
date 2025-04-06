import React from "react";
import { format } from "date-fns";
import { formatDistanceStrict } from "date-fns";

interface ProjectHistoryItemProps {
  name: string;
  role: string;
  startDate: Date;
  endDate?: Date;
}

export function ProjectHistoryItem({
  name,
  role,
  startDate,
  endDate
}: ProjectHistoryItemProps) {
  // Format the date range for display
  const formatDateRange = () => {
    const start = format(startDate, "MMM yyyy");
    const end = endDate ? format(endDate, "MMM yyyy") : "Present";
    
    // Calculate duration
    const duration = endDate 
      ? formatDistanceStrict(endDate, startDate)
      : formatDistanceStrict(new Date(), startDate);
    
    return `${start} - ${end} (${duration})`;
  };
  
  return (
    <div className="py-4 border-b border-gray-100 last:border-0">
      <h3 className="font-medium text-gray-800">{name}</h3>
      <p className="text-sm text-gray-600 mt-1">{role}</p>
      <p className="text-xs text-gray-500 mt-1">{formatDateRange()}</p>
    </div>
  );
}
