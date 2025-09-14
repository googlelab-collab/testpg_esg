// Client-side ESG calculation utilities
export interface ESGScoreData {
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  benchmarkData?: {
    sp500Average: number;
    industryAverage: number;
    ftse4goodIncluded: boolean;
    djsiWorldMember: boolean;
  };
}

export interface ParameterChangeImpact {
  environmentalImpact: number;
  socialImpact: number;
  governanceImpact: number;
  overallImpact: number;
}

// Real-world ESG benchmarks based on industry data
export const esgBenchmarks = {
  industryAverages: {
    technology: { overall: 72, environmental: 75, social: 68, governance: 73 },
    manufacturing: { overall: 65, environmental: 62, social: 67, governance: 66 },
    financialServices: { overall: 70, environmental: 68, social: 72, governance: 71 },
    healthcare: { overall: 69, environmental: 67, social: 73, governance: 67 },
    energy: { overall: 58, environmental: 52, social: 62, governance: 60 },
    utilities: { overall: 71, environmental: 78, social: 65, governance: 69 }
  },
  
  globalBenchmarks: {
    sp500Average: 68,
    msciWorldESG: 71,
    ftse4goodThreshold: 75,
    djsiWorldThreshold: 78
  },
  
  regulatoryThresholds: {
    euTaxonomyAlignment: 80,
    csrdReadiness: 75,
    tcfdCompliance: 70,
    secClimateReadiness: 72
  }
};

// ESG score calculation based on MSCI methodology
export function calculateESGScore(
  environmentalScore: number,
  socialScore: number,
  governanceScore: number
): ESGScoreData {
  // MSCI ESG weighting: Environmental 40%, Social 30%, Governance 30%
  const overallScore = (environmentalScore * 0.4) + (socialScore * 0.3) + (governanceScore * 0.3);
  
  return {
    overallScore: Math.round(overallScore * 100) / 100,
    environmentalScore: Math.round(environmentalScore * 100) / 100,
    socialScore: Math.round(socialScore * 100) / 100,
    governanceScore: Math.round(governanceScore * 100) / 100,
    benchmarkData: {
      sp500Average: esgBenchmarks.globalBenchmarks.sp500Average,
      industryAverage: 65, // This would be dynamic based on industry
      ftse4goodIncluded: overallScore >= esgBenchmarks.globalBenchmarks.ftse4goodThreshold,
      djsiWorldMember: overallScore >= esgBenchmarks.globalBenchmarks.djsiWorldThreshold
    }
  };
}

// Calculate parameter impact on ESG scores
export function calculateParameterImpact(
  currentScores: ESGScoreData,
  parameterChanges: { [key: string]: { category: string; impact: number } }
): ParameterChangeImpact {
  let environmentalImpact = 0;
  let socialImpact = 0;
  let governanceImpact = 0;
  
  Object.values(parameterChanges).forEach(change => {
    switch (change.category) {
      case 'environmental':
        environmentalImpact += change.impact;
        break;
      case 'social':
        socialImpact += change.impact;
        break;
      case 'governance':
        governanceImpact += change.impact;
        break;
    }
  });
  
  // Calculate overall impact using MSCI weighting
  const overallImpact = (environmentalImpact * 0.4) + (socialImpact * 0.3) + (governanceImpact * 0.3);
  
  return {
    environmentalImpact: Math.round(environmentalImpact * 100) / 100,
    socialImpact: Math.round(socialImpact * 100) / 100,
    governanceImpact: Math.round(governanceImpact * 100) / 100,
    overallImpact: Math.round(overallImpact * 100) / 100
  };
}

// ESG score rating based on industry standards
export function getESGRating(score: number): string {
  if (score >= 85) return 'AAA';
  if (score >= 80) return 'AA';
  if (score >= 75) return 'A';
  if (score >= 70) return 'BBB';
  if (score >= 65) return 'BB';
  if (score >= 60) return 'B';
  return 'CCC';
}

// Get ESG score color based on performance
export function getESGScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 70) return 'text-blue-600';
  if (score >= 60) return 'text-yellow-600';
  return 'text-red-600';
}

// Real-world emission factors (kg CO2e)
export const emissionFactors = {
  electricity: {
    us: 0.386, // per kWh - EPA eGRID 2022
    eu: 0.275, // per kWh - EU average
    uk: 0.193  // per kWh - DEFRA 2024
  },
  naturalGas: {
    us: 0.181, // per kWh - EPA
    eu: 0.185, // per kWh - EU
    uk: 0.184  // per kWh - DEFRA
  },
  transport: {
    diesel: 2.67, // per liter - EPA/DEFRA
    gasoline: 2.31, // per liter - EPA/DEFRA
    aviation: 3.15 // per liter - DEFRA
  }
};

// Convert emissions to CO2 equivalent
export function calculateCO2Equivalent(
  activityData: number,
  emissionFactor: number,
  unit: string = 'kg'
): number {
  const emissions = activityData * emissionFactor;
  
  // Convert to tonnes if needed
  if (unit === 'kg') {
    return emissions / 1000;
  }
  
  return emissions;
}

// Format ESG score for display
export function formatESGScore(score: number): string {
  return score.toFixed(1);
}

// Format emissions for display
export function formatEmissions(emissions: number): string {
  if (emissions >= 1000000) {
    return `${(emissions / 1000000).toFixed(1)}M tCO₂e`;
  } else if (emissions >= 1000) {
    return `${(emissions / 1000).toFixed(1)}K tCO₂e`;
  } else {
    return `${emissions.toFixed(1)} tCO₂e`;
  }
}

// Get compliance status color
export function getComplianceStatusColor(status: string): string {
  switch (status) {
    case 'compliant':
      return 'text-green-600 bg-green-50';
    case 'in_progress':
      return 'text-yellow-600 bg-yellow-50';
    case 'non_compliant':
      return 'text-red-600 bg-red-50';
    default:
      return 'text-gray-600 bg-gray-50';
  }
}
