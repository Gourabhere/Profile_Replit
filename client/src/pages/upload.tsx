import React, { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { UploadBox } from "@/components/ui/upload-box";
import { ImportItem } from "@/components/ui/import-item";
import { useImports } from "@/hooks/use-candidate-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function Upload() {
  const { data: imports, isLoading } = useImports();
  const { toast } = useToast();
  
  const handleUploadComplete = () => {
    // Refresh imports list when upload completes
    queryClient.invalidateQueries({ queryKey: ['/api/imports'] });
  };
  
  const handleDeleteImport = async (id: number) => {
    try {
      // In a real app, you would implement this endpoint
      // await apiRequest('DELETE', `/api/imports/${id}`);
      
      toast({
        title: "Import deleted",
        description: "The import has been removed from your history",
      });
      
      // Refresh imports list
      queryClient.invalidateQueries({ queryKey: ['/api/imports'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the import",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Import Profiles" />
      
      <main className="flex-1 p-4 pb-20">
        <UploadBox onUploadComplete={handleUploadComplete} />
        
        <div className="mt-8">
          <h2 className="text-lg font-medium mb-4">Recent Imports</h2>
          
          <ScrollArea className="h-[calc(100vh-380px)]">
            {isLoading ? (
              // Loading skeletons
              Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="py-3 border-b border-gray-200">
                  <div className="flex items-center">
                    <Skeleton className="h-10 w-10 mr-3" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                  </div>
                </div>
              ))
            ) : imports?.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No import history yet. Upload your first file above.
              </div>
            ) : (
              imports?.map(importItem => (
                <ImportItem
                  key={importItem.id}
                  filename={importItem.filename}
                  recordCount={importItem.recordCount}
                  fileSize={importItem.fileSize}
                  importedAt={new Date(importItem.importedAt)}
                  onDelete={() => handleDeleteImport(importItem.id)}
                />
              ))
            )}
          </ScrollArea>
        </div>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
