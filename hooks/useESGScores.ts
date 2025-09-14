import { useQuery } from "@tanstack/react-query";
import { ESGScore } from "@shared/schema";

export function useESGScores(organizationId: number) {
  return useQuery<ESGScore>({
    queryKey: ["/api/esg-scores", organizationId, "latest"],
    retry: false,
  });
}
