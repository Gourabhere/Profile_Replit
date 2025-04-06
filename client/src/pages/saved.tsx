import React from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CandidateCard } from "@/components/ui/candidate-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useSavedCandidates, useCandidates, useRemoveSavedCandidate } from "@/hooks/use-candidate-data";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { BookmarkX } from "lucide-react";

export default function SavedCandidates() {
  const { data: savedCandidates, isLoading: loadingSaved } = useSavedCandidates();
  const { data: allCandidates, isLoading: loadingCandidates } = useCandidates();
  const removeSavedCandidate = useRemoveSavedCandidate();
  const { toast } = useToast();
  
  const isLoading = loadingSaved || loadingCandidates;
  
  // Get full candidate data for each saved candidate
  const savedCandidatesList = savedCandidates && allCandidates
    ? savedCandidates.map(saved => {
        const candidateData = allCandidates.find(c => c.id === saved.candidateId);
        return {
          savedId: saved.id,
          ...candidateData
        };
      }).filter(item => item !== undefined)
    : [];
  
  const handleRemove = async (savedId: number) => {
    try {
      await removeSavedCandidate.mutateAsync(savedId);
      toast({
        title: "Candidate removed",
        description: "Candidate has been removed from your saved list",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove candidate",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader title="Saved Candidates" />
      
      <main className="flex-1 p-4 pb-20">
        <ScrollArea className="h-[calc(100vh-160px)]">
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-start space-x-3 p-4 bg-white rounded-lg shadow-sm">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                  </div>
                </div>
              </div>
            ))
          ) : savedCandidatesList.length === 0 ? (
            <div className="text-center py-12">
              <BookmarkX className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">No saved candidates</h3>
              <p className="text-gray-500">
                When you save candidates, they will appear here for quick access.
              </p>
            </div>
          ) : (
            savedCandidatesList.map(candidate => (
              <div key={candidate.savedId} className="relative">
                <CandidateCard
                  id={candidate.id}
                  name={candidate.name}
                  prefix={candidate.prefix}
                  skills={candidate.skills}
                  grade={candidate.grade}
                  experienceYears={candidate.experienceYears}
                  availability={candidate.availability}
                  unallocatedDays={candidate.unallocatedDays}
                  location={candidate.location}
                  availableSince={candidate.availableSince}
                />
              </div>
            ))
          )}
        </ScrollArea>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
