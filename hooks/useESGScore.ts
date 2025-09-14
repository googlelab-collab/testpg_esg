import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

export function useESGScore(organizationId: number) {
  return useQuery({
    queryKey: [`/api/esg-scores/${organizationId}`],
    retry: false,
  });
}

export function useESGParameters(organizationId: number, category?: string) {
  return useQuery({
    queryKey: [`/api/esg-parameters/${organizationId}`],
    select: (data) => category ? data?.filter((p: any) => p.category === category) : data,
    retry: false,
  });
}

export function useESGMetrics(organizationId: number, category?: string) {
  return useQuery({
    queryKey: [`/api/esg-metrics/${organizationId}`],
    select: (data) => category ? data?.filter((m: any) => m.category === category) : data,
    retry: false,
  });
}

export function useUpdateESGParameter() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: any }) =>
      apiRequest(`/api/esg-parameters/${id}`, {
        method: 'PATCH',
        body: updates,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/esg-parameters"] });
      queryClient.invalidateQueries({ queryKey: ["/api/esg-scores"] });
    },
  });
}

export function useCalculateESGImpact() {
  return useMutation({
    mutationFn: ({ organizationId, parameterChanges }: { organizationId: number; parameterChanges: any }) =>
      apiRequest(`/api/esg-impact/${organizationId}`, {
        method: 'POST',
        body: parameterChanges,
      }),
  });
}

export function useDashboardData(organizationId: number) {
  return useQuery({
    queryKey: [`/api/dashboard/${organizationId}`],
    retry: false,
  });
}

export function useComplianceData(organizationId: number) {
  return useQuery({
    queryKey: [`/api/compliance-frameworks/${organizationId}`],
    retry: false,
  });
}

export function useRegulatoryUpdates(limit = 10) {
  return useQuery({
    queryKey: [`/api/regulatory-updates?limit=${limit}`],
    retry: false,
  });
}


