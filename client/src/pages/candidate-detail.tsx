import React, { useState, useEffect } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { useCandidate, useCandidateProjects, useSavedCandidates, useSaveCandidate } from "@/hooks/use-candidate-data";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, BookmarkPlus, Bookmark } from "lucide-react";
import { SkillChip } from "@/components/ui/skill-chip";
import { TimelineChart } from "@/components/ui/timeline-chart";
import { ProjectHistoryItem } from "@/components/ui/project-history-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "wouter";

export default function CandidateDetail() {
  const { id } = useParams();
  const candidateId = parseInt(id);
  
  const { data: candidate, isLoading: isLoadingCandidate } = useCandidate(candidateId);
  const { data: projects, isLoading: isLoadingProjects } = useCandidateProjects(candidateId);
  const { data: savedCandidates, isLoading: isLoadingSaved } = useSavedCandidates();
  const saveCandidate = useSaveCandidate();
  const { toast } = useToast();
  
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (savedCandidates && !isLoadingSaved) {
      const saved = savedCandidates.some(saved => saved.candidateId === candidateId);
      setIsSaved(saved);
    }
  }, [savedCandidates, candidateId, isLoadingSaved]);
  
  const handleSaveCandidate = async () => {
    try {
      await saveCandidate.mutateAsync(candidateId);
      toast({
        title: "Candidate saved",
        description: "Candidate has been added to your saved list",
      });
      setIsSaved(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save candidate",
        variant: "destructive"
      });
    }
  };
  
  const handleCall = () => {
    if (candidate?.phoneNumber) {
      window.location.href = `tel:${candidate.phoneNumber}`;
    }
  };
  
  const handleEmail = () => {
    if (candidate?.email) {
      window.location.href = `mailto:${candidate.email}`;
    }
  };
  
  const handleRequestAllocation = () => {
    toast({
      title: "Request submitted",
      description: "Allocation request has been submitted successfully",
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader
        title="Candidate Profile"
        backLink="/search"
        rightActions={
          <Button
            variant="ghost"
            size="icon"
            className="text-primary-foreground"
            onClick={isSaved ? undefined : handleSaveCandidate}
          >
            {isSaved ? (
              <Bookmark className="h-5 w-5 fill-current" />
            ) : (
              <BookmarkPlus className="h-5 w-5" />
            )}
          </Button>
        }
      />
      
      <ScrollArea className="flex-1 p-4 pb-20">
        {isLoadingCandidate ? (
          // Loading skeleton
          <div className="space-y-4">
            <div className="flex items-center">
              <Skeleton className="h-16 w-16 rounded-full mr-4" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            
            <div className="flex space-x-4">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          </div>
        ) : candidate ? (
          <>
            {/* Candidate header */}
            <div className="flex items-center mb-4">
              <div className="bg-primary/10 rounded-full p-4 mr-4">
                <User className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {candidate.prefix} {candidate.name}
                </h2>
                <p className="text-gray-500">Employee ID: {candidate.employeeId}</p>
                <div className="text-sm mt-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 inline-block">
                  {candidate.availability}
                </div>
              </div>
            </div>
            
            {/* Contact buttons */}
            <div className="flex space-x-4 mb-6">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCall}
              >
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleEmail}
              >
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
            </div>
            
            {/* Basic info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <h3 className="text-sm text-gray-500">Grade</h3>
                <p className="font-medium">{candidate.grade}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Experience</h3>
                <p className="font-medium">{candidate.experienceYears} Years</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Location</h3>
                <p className="font-medium">TCS - {candidate.location}</p>
              </div>
              <div>
                <h3 className="text-sm text-gray-500">Unallocated</h3>
                <p className="font-medium">{candidate.unallocatedDays} Days</p>
              </div>
            </div>
            
            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Primary Skills</h3>
              <div>
                {candidate.skills.map((skill, index) => (
                  <SkillChip key={index} label={skill} />
                ))}
              </div>
            </div>
            
            {/* Contact info */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Contact Information</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-gray-500" />
                  <p>{candidate.phoneNumber}</p>
                </div>
                <div className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-gray-500" />
                  <p>{candidate.email}</p>
                </div>
              </div>
            </div>
            
            {/* Availability timeline */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Availability Timeline</h3>
              {candidate.availableSince && (
                <TimelineChart availableSince={new Date(candidate.availableSince)} />
              )}
            </div>
            
            {/* Project history */}
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-3">Project History</h3>
              {isLoadingProjects ? (
                <div className="space-y-4">
                  <Skeleton className="h-16" />
                  <Skeleton className="h-16" />
                </div>
              ) : projects && projects.length > 0 ? (
                <div>
                  {projects.map(project => (
                    <ProjectHistoryItem
                      key={project.id}
                      name={project.name}
                      role={project.role}
                      startDate={new Date(project.startDate)}
                      endDate={project.endDate ? new Date(project.endDate) : undefined}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No project history available.</p>
              )}
            </div>
            
            {/* Request allocation button */}
            <Button 
              className="w-full mb-4" 
              onClick={handleRequestAllocation}
            >
              Request Allocation
            </Button>
          </>
        ) : (
          <div className="text-center py-8">
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              Candidate not found
            </h3>
            <p className="text-gray-500">
              The candidate you're looking for doesn't exist or has been removed.
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
