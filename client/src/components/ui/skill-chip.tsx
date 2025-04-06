import React from "react";

interface SkillChipProps {
  label: string;
}

export function SkillChip({ label }: SkillChipProps) {
  return (
    <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm inline-block mr-2 mb-2">
      {label}
    </div>
  );
}
