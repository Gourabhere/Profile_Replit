import React, { useState } from "react";
import { MobileHeader } from "@/components/ui/mobile-header";
import { Input } from "@/components/ui/input";
import { FilterChip } from "@/components/ui/filter-chip";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import { useLocation } from "wouter";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdvancedSearch() {
  const [skillSearch, setSkillSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const [availabilityOptions, setAvailabilityOptions] = useState({
    available: true,
    availableEsu: true,
    freshTrainee: true
  });
  
  const [unallocatedDays, setUnallocatedDays] = useState(15);
  
  const [experienceRange, setExperienceRange] = useState([2, 10]);
  
  const [grades, setGrades] = useState({
    C1: true,
    C2: true,
    C3A: true,
    C3B: true,
    C4: true
  });
  
  const [locationSearch, setLocationSearch] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
  const [, navigate] = useLocation();
  
  // Common skills for autosuggest
  const skillSuggestions = ["SAP", "Java", "Salesforce", "Oracle", "Python", "ABAP", "Cloud", "AWS", "Azure", "TIBCO", "MuleSoft", "PL/SQL"];
  
  // Locations for autosuggest
  const locationSuggestions = ["Hyderabad", "Bangalore", "Mumbai", "Chennai", "Pune", "Delhi", "Ahmedabad", "Kolkata", "Nagpur"];
  
  // Filter skill suggestions based on search
  const filteredSkillSuggestions = skillSuggestions.filter(
    skill => skill.toLowerCase().includes(skillSearch.toLowerCase()) && 
    !selectedSkills.includes(skill)
  );
  
  // Filter location suggestions based on search
  const filteredLocationSuggestions = locationSuggestions.filter(
    location => location.toLowerCase().includes(locationSearch.toLowerCase()) && 
    !selectedLocations.includes(location)
  );
  
  // Add a skill
  const addSkill = (skill: string) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setSkillSearch("");
    }
  };
  
  // Remove a skill
  const removeSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };
  
  // Add a location
  const addLocation = (location: string) => {
    if (!selectedLocations.includes(location)) {
      setSelectedLocations([...selectedLocations, location]);
      setLocationSearch("");
    }
  };
  
  // Remove a location
  const removeLocation = (location: string) => {
    setSelectedLocations(selectedLocations.filter(l => l !== location));
  };
  
  // Handle reset
  const handleReset = () => {
    setSelectedSkills([]);
    setSelectedLocations([]);
    setAvailabilityOptions({
      available: true,
      availableEsu: true,
      freshTrainee: true
    });
    setUnallocatedDays(15);
    setExperienceRange([2, 10]);
    setGrades({
      C1: true,
      C2: true,
      C3A: true,
      C3B: true,
      C4: true
    });
  };
  
  // Handle apply filters
  const applyFilters = () => {
    // Collect availability options that are checked
    const availabilityFilters = [];
    if (availabilityOptions.available) availabilityFilters.push("Available");
    if (availabilityOptions.availableEsu) availabilityFilters.push("Available-ESU Skill");
    if (availabilityOptions.freshTrainee) availabilityFilters.push("Fresh Trainee-Available");
    
    // Collect grade options that are checked
    const gradeFilters = [];
    if (grades.C1) gradeFilters.push("C1");
    if (grades.C2) gradeFilters.push("C2");
    if (grades.C3A) gradeFilters.push("C3A");
    if (grades.C3B) gradeFilters.push("C3B");
    if (grades.C4) gradeFilters.push("C4");
    
    // Prepare filters to pass to search page
    const filters = {
      skills: selectedSkills,
      availability: availabilityFilters,
      minUnallocatedDays: unallocatedDays,
      minExperience: experienceRange[0],
      maxExperience: experienceRange[1],
      grades: gradeFilters,
      locations: selectedLocations
    };
    
    // Store filters in sessionStorage to be used by search page
    sessionStorage.setItem('advancedFilters', JSON.stringify(filters));
    
    // Navigate to search page
    navigate('/search');
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <MobileHeader
        title="Advanced Search"
        backLink="/search"
      />
      
      <ScrollArea className="flex-1 p-4 pb-20">
        {/* Skills */}
        <section className="mb-6">
          <h2 className="text-base font-medium mb-2">Skills</h2>
          
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for skills..."
              value={skillSearch}
              onChange={e => setSkillSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {skillSearch && filteredSkillSuggestions.length > 0 && (
            <div className="bg-white shadow-md rounded-md p-2 mb-2">
              {filteredSkillSuggestions.slice(0, 5).map(skill => (
                <div 
                  key={skill}
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => addSkill(skill)}
                >
                  {skill}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2 mb-2">
            {selectedSkills.map(skill => (
              <FilterChip
                key={skill}
                label={skill}
                onRemove={() => removeSkill(skill)}
              />
            ))}
          </div>
        </section>
        
        {/* Availability */}
        <section className="mb-6">
          <h2 className="text-base font-medium mb-2">Availability</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Unallocated Days</Label>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>≥ {unallocatedDays} days</span>
              </div>
              <Slider
                value={[unallocatedDays]}
                min={0}
                max={100}
                step={1}
                onValueChange={(values) => setUnallocatedDays(values[0])}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>50</span>
                <span>100+</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={availabilityOptions.available}
                  onCheckedChange={(checked) => 
                    setAvailabilityOptions({...availabilityOptions, available: !!checked})
                  }
                />
                <Label htmlFor="available" className="text-sm">Available</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="availableEsu"
                  checked={availabilityOptions.availableEsu}
                  onCheckedChange={(checked) => 
                    setAvailabilityOptions({...availabilityOptions, availableEsu: !!checked})
                  }
                />
                <Label htmlFor="availableEsu" className="text-sm">Available-ESU Skill</Label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="freshTrainee"
                  checked={availabilityOptions.freshTrainee}
                  onCheckedChange={(checked) => 
                    setAvailabilityOptions({...availabilityOptions, freshTrainee: !!checked})
                  }
                />
                <Label htmlFor="freshTrainee" className="text-sm">Fresh Trainee-Available</Label>
              </div>
            </div>
          </div>
        </section>
        
        {/* Experience & Grade */}
        <section className="mb-6">
          <h2 className="text-base font-medium mb-2">Experience & Grade</h2>
          
          <div className="space-y-4">
            <div>
              <Label className="text-sm">Experience Range</Label>
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>{experienceRange[0]} - {experienceRange[1]} years</span>
              </div>
              <Slider
                value={experienceRange}
                min={0}
                max={30}
                step={1}
                onValueChange={setExperienceRange}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>15</span>
                <span>30+</span>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {Object.entries(grades).map(([grade, checked]) => (
                <div key={grade} className="flex items-center">
                  <Checkbox
                    id={`grade-${grade}`}
                    checked={checked}
                    onCheckedChange={(checked) => 
                      setGrades({...grades, [grade]: !!checked})
                    }
                    className="mr-1"
                  />
                  <Label htmlFor={`grade-${grade}`} className="text-sm">{grade}</Label>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Location */}
        <section className="mb-6">
          <h2 className="text-base font-medium mb-2">Location</h2>
          
          <div className="relative mb-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search for location..."
              value={locationSearch}
              onChange={e => setLocationSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {locationSearch && filteredLocationSuggestions.length > 0 && (
            <div className="bg-white shadow-md rounded-md p-2 mb-2">
              {filteredLocationSuggestions.slice(0, 5).map(location => (
                <div 
                  key={location}
                  className="py-1 px-2 hover:bg-gray-100 cursor-pointer rounded"
                  onClick={() => addLocation(location)}
                >
                  {location}
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-2">
            {selectedLocations.map(location => (
              <FilterChip
                key={location}
                label={location}
                onRemove={() => removeLocation(location)}
              />
            ))}
          </div>
        </section>
        
        {/* Action buttons */}
        <div className="flex space-x-4 pt-4 mb-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleReset}
          >
            Reset
          </Button>
          
          <Button
            className="flex-1"
            onClick={applyFilters}
          >
            Apply Filters
          </Button>
        </div>
      </ScrollArea>
    </div>
  );
}
