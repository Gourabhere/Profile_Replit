import React from "react";
import { Card, CardContent } from "./card";
import { User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "./badge";
import { Link } from "wouter";

interface CandidateCardProps {
  id: number;
  name: string;
  prefix: string;
  skills: string[];
  grade: string;
  experienceYears: string;
  availability: string;
  unallocatedDays: number;
  location: string;
  availableSince?: Date;
}

export function CandidateCard({
  id,
  name,
  prefix,
  skills,
  grade,
  experienceYears,
  availability,
  unallocatedDays,
  location,
  availableSince
}: CandidateCardProps) {
  // Determine availability badge color
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "Available":
        return "bg-green-100 text-green-800";
      case "Available-ESU Skill":
        return "bg-blue-100 text-blue-800";
      case "Fresh Trainee-Available":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format unallocated days text
  const getUnallocatedText = () => {
    if (unallocatedDays >= 28) {
      const weeks = Math.floor(unallocatedDays / 7);
      return weeks >= 4 ? "4+ weeks free" : `${weeks} weeks free`;
    } else {
      return `${unallocatedDays} days unallocated`;
    }
  };

  return (
    <Link href={`/candidate/${id}`}>
      <Card className="mb-4 cursor-pointer hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 rounded-full p-3">
              <User className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{prefix} {name}</h3>
                <span className="text-sm text-green-600 whitespace-nowrap">
                  {getUnallocatedText()}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mt-1">
                {skills.join(", ")}
              </p>
              
              <div className="flex justify-between mt-2">
                <div className="text-xs text-gray-500">
                  {grade} • {experienceYears} Yrs • {location}
                </div>
                
                <Badge className={`text-xs ${getAvailabilityColor(availability)}`}>
                  {availability}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
