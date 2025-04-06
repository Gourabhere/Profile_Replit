import React, { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { BottomNavigation } from "@/components/ui/bottom-navigation";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/ui/filter-chip";
import { CandidateCard } from "@/components/ui/candidate-card";
import { Link } from "wouter";
import { Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { useSearchCandidates } from "@/hooks/use-candidate-data";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export default function Search() {
  const [search, setSearch] = useState("");
  const [appliedFilters, setAppliedFilters] = useState<{
    skills: string[];
    experience?: string;
    grades: string[];
    availability: string[];
  }>({
    skills: [],
    grades: [],
    availability: [],
  });
  
  // Convert filters to the format expected by the API
  const apiFilters = {
    skills: appliedFilters.skills,
    availability: appliedFilters.availability,
    grades: appliedFilters.grades,
    minExperience: appliedFilters.experience ? 
      parseInt(appliedFilters.experience.split('-')[0]) : undefined,
    maxExperience: appliedFilters.experience ? 
      parseInt(appliedFilters.experience.split('-')[1]) : undefined,
  };
  
  const { data: searchResults, isLoading } = useSearchCandidates(apiFilters);
  
  // Create a displayed filter string for the header
  const filterDescription = Object.entries(appliedFilters)
    .filter(([key, value]) => 
      Array.isArray(value) ? value.length > 0 : !!value
    )
    .map(([key, value]) => 
      Array.isArray(value) ? value.join(', ') : value
    )
    .join(', ');
  
  // Remove a filter
  const removeFilter = (type: string, value?: string) => {
    setAppliedFilters(prev => {
      const newFilters = { ...prev };
      
      if (value && Array.isArray(newFilters[type as keyof typeof newFilters])) {
        const arrayProp = type as keyof typeof newFilters;
        newFilters[arrayProp] = (newFilters[arrayProp] as string[]).filter(v => v !== value);
      } else {
        // For non-array properties like experience
        delete newFilters[type as keyof typeof newFilters];
      }
      
      return newFilters;
    });
  };
  
  // Reset all filters
  const resetFilters = () => {
    setAppliedFilters({
      skills: [],
      grades: [],
      availability: [],
    });
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader
        title="Search Results"
        backLink="/"
        rightActions={
          <Link href="/advanced-search">
            <Button variant="ghost" size="icon" className="text-primary-foreground">
              <SlidersHorizontal className="h-5 w-5" />
            </Button>
          </Link>
        }
      />
      
      <main className="flex-1 p-4 pb-20">
        {appliedFilters && (
          <div className="mb-4">
            {filterDescription ? (
              <div className="bg-gray-100 rounded-lg p-2 flex items-center mb-2">
                <span className="text-xs text-gray-700 flex-1">
                  Filters: {filterDescription}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs h-6"
                  onClick={resetFilters}
                >
                  Reset
                </Button>
              </div>
            ) : null}
          </div>
        )}
        
        <div className="mb-4 relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search in results..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h2 className="text-sm font-medium text-gray-600">
              {searchResults ? `${searchResults.length} matching results` : "Search Results"}
            </h2>
          </div>
        </div>
        
        <ScrollArea className="h-[calc(100vh-240px)]">
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
          ) : searchResults?.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No candidates found matching your search criteria.
            </div>
          ) : (
            searchResults?.map(candidate => (
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
