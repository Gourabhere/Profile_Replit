import React from "react";
import { X } from "lucide-react";
import { Button } from "./button";

interface FilterChipProps {
  label: string;
  onRemove?: () => void;
  active?: boolean;
  onClick?: () => void;
}

export function FilterChip({
  label,
  onRemove,
  active = false,
  onClick
}: FilterChipProps) {
  const activeClass = active
    ? "bg-primary text-primary-foreground"
    : "bg-gray-100 text-gray-800 hover:bg-gray-200";
  
  return (
    <Button
      variant="ghost"
      className={`rounded-full px-3 py-1 text-sm ${activeClass}`}
      onClick={onClick}
    >
      {label}
      {onRemove && (
        <X
          className="h-3 w-3 ml-1 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        />
      )}
    </Button>
  );
}
