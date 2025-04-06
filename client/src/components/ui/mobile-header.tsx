import React from "react";
import { ArrowLeft, BatteryFull, Wifi, SignalHigh, MoreVertical, SearchIcon, PlusCircle } from "lucide-react";
import { Link, useLocation } from "wouter";
import { Button } from "./button";

interface MobileHeaderProps {
  title: string;
  backLink?: string;
  showSearch?: boolean;
  showAdd?: boolean;
  onSearchClick?: () => void;
  onAddClick?: () => void;
  rightActions?: React.ReactNode;
}

export function MobileHeader({
  title,
  backLink,
  showSearch = false,
  showAdd = false,
  onSearchClick,
  onAddClick,
  rightActions
}: MobileHeaderProps) {
  const [location, navigate] = useLocation();
  
  return (
    <div className="sticky top-0 z-10 bg-primary text-primary-foreground">
      {/* Status bar */}
      <div className="flex justify-between items-center px-4 py-2 text-xs">
        <div>9:41 AM</div>
        <div className="flex items-center space-x-1">
          <SignalHigh className="h-4 w-4" />
          <Wifi className="h-4 w-4" />
          <BatteryFull className="h-4 w-4" />
        </div>
      </div>
      
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center">
          {backLink && (
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 text-primary-foreground"
              onClick={() => navigate(backLink)}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Button>
          )}
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
        
        <div className="flex items-center space-x-2">
          {showSearch && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
              onClick={onSearchClick}
            >
              <SearchIcon className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          
          {showAdd && (
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground"
              onClick={onAddClick}
            >
              <PlusCircle className="h-5 w-5" />
              <span className="sr-only">Add</span>
            </Button>
          )}
          
          {rightActions}
        </div>
      </div>
    </div>
  );
}
