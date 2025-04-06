import React, { useState, useRef } from "react";
import { Upload, Plus, X } from "lucide-react";
import { Button } from "./button";
import { Progress } from "./progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface UploadBoxProps {
  onUploadComplete: () => void;
}

export function UploadBox({ onUploadComplete }: UploadBoxProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFileName, setUploadFileName] = useState<string | null>(null);
  const [uploadSize, setUploadSize] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const processFile = async (file: File) => {
    if (!file) return;
    
    // Check file type
    const validTypes = ['.csv', '.xls', '.xlsx'];
    const fileExt = file.name.substring(file.name.lastIndexOf('.')).toLowerCase();
    if (!validTypes.includes(fileExt)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV or Excel file",
        variant: "destructive"
      });
      return;
    }

    setUploadFileName(file.name);
    setUploadSize(formatFileSize(file.size));
    setIsUploading(true);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    // For now, we'll just simulate the upload
    // In a real app, you would use FormData and fetch to upload the file
    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);
      
      try {
        // Create an import record
        await apiRequest('POST', '/api/imports', {
          filename: file.name,
          recordCount: Math.floor(Math.random() * 300) + 50, // Simulated record count
          fileSize: formatFileSize(file.size)
        });
        
        // Refresh imports data
        queryClient.invalidateQueries({ queryKey: ['/api/imports'] });
        
        toast({
          title: "Upload complete",
          description: `Successfully uploaded ${file.name}`,
        });
        
        setTimeout(() => {
          setIsUploading(false);
          setUploadFileName(null);
          setUploadSize(null);
          setUploadProgress(0);
          onUploadComplete();
        }, 1000);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to process the file. Please try again.",
          variant: "destructive"
        });
        setIsUploading(false);
        setUploadFileName(null);
        setUploadSize(null);
        setUploadProgress(0);
      }
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleCancelUpload = () => {
    setIsUploading(false);
    setUploadFileName(null);
    setUploadSize(null);
    setUploadProgress(0);
  };

  return (
    <div className="w-full">
      {isUploading ? (
        <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex items-center justify-center mb-4">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-center text-gray-700 mb-2">
            Uploading {uploadFileName}
          </p>
          <Progress value={uploadProgress} className="h-2 mb-1" />
          <div className="flex justify-between text-xs text-gray-500 mb-3">
            <span>{uploadProgress}% Complete</span>
            {uploadSize && <span>{uploadSize}</span>}
          </div>
          <Button
            variant="outline"
            className="w-full"
            onClick={handleCancelUpload}
          >
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
        </div>
      ) : (
        <div
          className={`p-6 bg-gray-50 rounded-lg border-2 border-dashed ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300"
          } transition-all cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".csv,.xls,.xlsx"
            onChange={handleFileSelect}
          />
          <div className="flex items-center justify-center mb-4">
            <Upload className="h-10 w-10 text-gray-400" />
          </div>
          <p className="text-center text-gray-700 mb-2">
            Drag and drop files here
          </p>
          <p className="text-center text-gray-500 text-sm mb-4">
            Supported formats: XLS, XLSX, CSV
          </p>
          <Button className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Browse Files
          </Button>
        </div>
      )}
    </div>
  );
}
