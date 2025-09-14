import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface ParameterUpdateData {
  id: number;
  currentValue: string;
  targetValue?: string;
  impactWeight?: string;
}

export function useESGParameterUpdate() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: ParameterUpdateData) => {
      return await apiRequest(`/api/esg-parameters/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify({
          currentValue: data.currentValue,
          targetValue: data.targetValue,
          impactWeight: data.impactWeight,
        }),
      });
    },
    onSuccess: () => {
      // Invalidate and refetch ESG parameters
      queryClient.invalidateQueries({ queryKey: ["/api/esg-parameters"] });
      
      // Invalidate ESG scores to trigger recalculation
      queryClient.invalidateQueries({ queryKey: ["/api/esg-scores"] });
      
      // Invalidate dashboard data
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard"] });
    },
  });

  return mutation;
}

export function useParameterImpactCalculation() {
  const queryClient = useQueryClient();
  
  const mutation = useMutation({
    mutationFn: async (data: { 
      organizationId: number; 
      parameterId: number; 
      newValue: string 
    }) => {
      return await apiRequest("/api/parameter-impact-analysis", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      // Invalidate impact analysis queries
      queryClient.invalidateQueries({ queryKey: ["/api/parameter-impact-analysis"] });
    },
  });

  return mutation;
}