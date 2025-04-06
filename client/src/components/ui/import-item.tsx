import React from "react";
import { FileSpreadsheet, FileText, MoreHorizontal } from "lucide-react";
import { format } from "date-fns";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "./dropdown-menu";
import { Button } from "./button";

interface ImportItemProps {
  filename: string;
  recordCount: number;
  fileSize: string;
  importedAt: Date;
  onDelete?: () => void;
}

export function ImportItem({
  filename,
  recordCount,
  fileSize,
  importedAt,
  onDelete
}: ImportItemProps) {
  // Determine icon based on file extension
  const getFileIcon = () => {
    const extension = filename.split('.').pop()?.toLowerCase();
    if (extension === 'csv') {
      return <FileText className="h-10 w-10 text-gray-400" />;
    }
    return <FileSpreadsheet className="h-10 w-10 text-gray-400" />;
  };

  // Format date for display
  const formatDate = (date: Date) => {
    return format(date, 'MMM d, yyyy');
  };

  return (
    <div className="flex items-center border-b border-gray-200 py-3">
      <div className="mr-3">
        {getFileIcon()}
      </div>
      
      <div className="flex-1">
        <h3 className="font-medium text-gray-800">{filename}</h3>
        <p className="text-sm text-gray-500">
          {recordCount} records • {fileSize} • {formatDate(importedAt)}
        </p>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onDelete}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
