import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ESGScore, ESGParameter } from "@shared/schema";

export function useESGScores(organizationId: number) {
  return useQuery({
    queryKey: ["/api/esg-scores", organizationId],
    retry: false,
  });
}

export function useESGScoreHistory(organizationId: number) {
  return useQuery({
    queryKey: ["/api/esg-scores", organizationId, "history"],
    retry: false,
  });
}

export function useESGParameters(organizationId: number, category?: string) {
  return useQuery({
    queryKey: ["/api/esg-parameters", organizationId, category].filter(Boolean),
    retry: false,
  });
}

export function useUpdateESGParameter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, value }: { id: number; value: number }) => {
      await apiRequest(`/api/esg-parameters/${id}`, {
        method: "PUT",
        body: JSON.stringify({ value }),
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/esg-parameters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/esg-scores"] });
    },
  });
}

export function useParameterImpactAnalysis() {
  return useMutation({
    mutationFn: async ({ organizationId, parameterChanges }: { 
      organizationId: number; 
      parameterChanges: { [key: string]: number } 
    }) => {
      return await apiRequest("/api/esg-parameters/impact-analysis", {
        method: "POST",
        body: JSON.stringify({ organizationId, parameterChanges }),
        headers: { "Content-Type": "application/json" },
      });
    },
  });
}
