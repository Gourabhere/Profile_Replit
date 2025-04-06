import React, { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { CandidateCard } from "@/components/ui/candidate-card";
import { FilterChip } from "@/components/ui/filter-chip";
import { Input } from "@/components/ui/input";
import { useCandidates } from "@/hooks/use-candidate-data";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { data: candidates, isLoading } = useCandidates();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  // Quick filter skills
  const quickFilterSkills = ["SAP", "Java", "Salesforce", "Oracle", "Python"];
  
  // Filter candidates based on search query and selected skills
  const filteredCandidates = candidates?.filter(candidate => {
    // Search query filtering
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      if (!candidate.name.toLowerCase().includes(query) && 
          !candidate.skills.some(skill => skill.toLowerCase().includes(query)) &&
          !candidate.location.toLowerCase().includes(query)) {
        return false;
      }
    }
    
    // Skill filtering
    if (selectedSkills.length > 0) {
      if (!candidate.skills.some(skill => 
        selectedSkills.some(selected => 
          skill.toLowerCase().includes(selected.toLowerCase())
        )
      )) {
        return false;
      }
    }
    
    return true;
  });
  
  // Handle skill toggle
  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader 
        title="TCS Talent Finder" 
        showSearch
        onSearchClick={() => document.getElementById('searchInput')?.focus()}
      />
      
      <main className="flex-1 p-4 pb-20">
        <div className="mb-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            id="searchInput"
            placeholder="Search by skills, location, or name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-sm font-medium text-gray-600">Quick Filters</h2>
            <Link href="/advanced-search" className="text-xs text-primary">
              See All
            </Link>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {quickFilterSkills.map(skill => (
              <FilterChip
                key={skill}
                label={skill}
                active={selectedSkills.includes(skill)}
                onClick={() => toggleSkill(skill)}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-600">Available Candidates</h2>
            {filteredCandidates && (
              <span className="text-xs text-gray-500">{filteredCandidates.length}</span>
            )}
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-270px)]">
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
          ) : filteredCandidates?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No candidates found matching your filters.
            </div>
          ) : (
            filteredCandidates?.map(candidate => (
              <CandidateCard
                key={candidate.id}
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
            ))
          )}
        </ScrollArea>
      </main>
      
      <BottomNavigation />
    </div>
  );
}
