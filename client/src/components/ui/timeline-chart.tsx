import React from "react";
import { format, addMonths, isSameMonth, isAfter, isBefore, isEqual } from "date-fns";

interface TimelineChartProps {
  availableSince: Date;
}

export function TimelineChart({ availableSince }: TimelineChartProps) {
  const today = new Date();
  const months = [0, 1, 2, 3].map(i => addMonths(today, i));
  
  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        {months.map((month, i) => (
          <div key={i} className="text-xs text-gray-500">
            {format(month, "MMM d")}
          </div>
        ))}
      </div>
      
      <div className="relative h-8 bg-gray-100 rounded-lg">
        {/* Available marker */}
        {(isAfter(availableSince, months[0]) || isEqual(availableSince, months[0])) && 
         (isBefore(availableSince, months[3]) || isEqual(availableSince, months[3])) && (
          <div 
            className="absolute h-full bg-green-100 rounded-lg"
            style={{
              left: calculatePosition(availableSince, months[0], months[3]),
              right: "0"
            }}
          >
            <div className="absolute top-0 left-0 h-full w-1 bg-green-500 rounded-l-lg"></div>
          </div>
        )}
        
        {/* Today marker */}
        <div 
          className="absolute top-0 h-full w-1 bg-primary"
          style={{
            left: calculatePosition(today, months[0], months[3]),
          }}
        ></div>
      </div>
      
      <div className="mt-2 text-sm text-gray-600">
        Available since: {format(availableSince, "MMMM d, yyyy")}
      </div>
    </div>
  );
}

// Helper function to calculate percentage position in the timeline
function calculatePosition(date: Date, startDate: Date, endDate: Date): string {
  if (isBefore(date, startDate)) return "0%";
  if (isAfter(date, endDate)) return "100%";
  
  const totalDuration = endDate.getTime() - startDate.getTime();
  const dateDuration = date.getTime() - startDate.getTime();
  
  const percentage = (dateDuration / totalDuration) * 100;
  return `${percentage}%`;
}
