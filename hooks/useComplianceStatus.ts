import { useQuery } from "@tanstack/react-query";
import { ComplianceStatus } from "@shared/schema";

export function useComplianceStatus(organizationId: number) {
  return useQuery<ComplianceStatus[]>({
    queryKey: ["/api/compliance-status", organizationId],
    retry: false,
  });
}
