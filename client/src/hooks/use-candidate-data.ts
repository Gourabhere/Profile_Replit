import { useQuery, useMutation } from "@tanstack/react-query";
import { CandidateFilter } from "server/storage";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Candidate, SavedCandidate, Project } from "@shared/schema";

// Get all candidates
export function useCandidates() {
  return useQuery<Candidate[]>({
    queryKey: ["/api/candidates"],
  });
}

// Get a single candidate by ID
export function useCandidate(id: number) {
  return useQuery<Candidate>({
    queryKey: ["/api/candidates", id.toString()],
    enabled: !!id,
  });
}

// Get projects for a candidate
export function useCandidateProjects(candidateId: number) {
  return useQuery<Project[]>({
    queryKey: ["/api/candidates", candidateId.toString(), "projects"],
    enabled: !!candidateId,
  });
}

// Search candidates with filters
export function useSearchCandidates(filters: CandidateFilter) {
  return useQuery<Candidate[]>({
    queryKey: ["/api/candidates/search", JSON.stringify(filters)],
    queryFn: async () => {
      const res = await apiRequest("POST", "/api/candidates/search", filters);
      return res.json();
    },
  });
}

// Get saved candidates
export function useSavedCandidates() {
  return useQuery<SavedCandidate[]>({
    queryKey: ["/api/saved-candidates"],
  });
}

// Save a candidate
export function useSaveCandidate() {
  return useMutation({
    mutationFn: (candidateId: number) => 
      apiRequest("POST", "/api/saved-candidates", { candidateId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-candidates"] });
    },
  });
}

// Remove a saved candidate
export function useRemoveSavedCandidate() {
  return useMutation({
    mutationFn: (id: number) => 
      apiRequest("DELETE", `/api/saved-candidates/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/saved-candidates"] });
    },
  });
}

// Get all imports
export function useImports() {
  return useQuery({
    queryKey: ["/api/imports"],
  });
}
