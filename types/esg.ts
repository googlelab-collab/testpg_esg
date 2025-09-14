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

export interface ESGModule {
  id: string;
  name: string;
  category: "environmental" | "social" | "governance";
  icon: string;
  description: string;
  status: "active" | "inactive" | "pending";
  lastUpdated: Date;
  metrics: ESGMetric[];
}

export interface ESGMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  target?: number;
  benchmark?: number;
  trend: "up" | "down" | "stable";
  source: string;
  lastUpdated: Date;
}

export interface ComplianceFramework {
  id: string;
  name: string;
  status: "compliant" | "in_progress" | "non_compliant" | "pending";
  lastAssessment?: Date;
  nextDeadline?: Date;
  requirements: string[];
  evidence: string[];
}

export interface RegulatoryUpdate {
  id: string;
  framework: string;
  title: string;
  description: string;
  effectiveDate: Date;
  impact: "high" | "medium" | "low";
  actionRequired: boolean;
}

export interface EmissionsFactor {
  source: string;
  factor: number;
  unit: string;
  scope: 1 | 2 | 3;
  region: string;
  lastUpdated: Date;
}

export interface IndustryBenchmark {
  metric: string;
  industry: string;
  value: number;
  unit: string;
  percentile: number;
  source: string;
}

export interface GHGData {
  scope1: number;
  scope2: number;
  scope3: number;
  total: number;
  unit: string;
  reductionTarget: number;
  progress: number;
}

export interface EnergyData {
  totalConsumption: number;
  renewablePercentage: number;
  carbonIntensity: number;
  efficiencyImprovement: number;
  unit: string;
}

export interface WaterData {
  totalWithdrawal: number;
  waterStress: boolean;
  recyclingRate: number;
  efficiencyTarget: number;
  unit: string;
}

export interface WasteData {
  totalGeneration: number;
  diversionRate: number;
  circularityIndex: number;
  reductionTarget: number;
  unit: string;
}

export interface DiversityData {
  genderDiversity: number;
  ethnicDiversity: number;
  leadershipDiversity: number;
  payEquityScore: number;
  targets: {
    gender: number;
    ethnicity: number;
    leadership: number;
  };
}

export interface SafetyData {
  trir: number; // Total Recordable Incident Rate
  dart: number; // Days Away, Restricted, or Transfer
  fatalityRate: number;
  safetyTrainingHours: number;
  targetTRIR: number;
}

export interface GovernanceData {
  boardIndependence: number;
  boardDiversity: number;
  executiveCompensationESGLink: number;
  cybersecurityMaturity: number;
  ethicsTrainingCoverage: number;
}
