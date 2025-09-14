import { ESGParameter } from "@shared/schema";

export interface ESGScoreResult {
  overallScore: number;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
}

export interface ParameterImpactResult {
  environmental: number;
  social: number;
  governance: number;
  overall: number;
}

export async function calculateESGScore(parameters: ESGParameter[]): Promise<ESGScoreResult> {
  // Initialize scores
  let environmentalScore = 0;
  let socialScore = 0;
  let governanceScore = 0;
  
  // Weight counts for averaging
  let environmentalCount = 0;
  let socialCount = 0;
  let governanceCount = 0;

  // Process each parameter
  for (const param of parameters) {
    const value = parseFloat(param.currentValue);
    const weight = parseFloat(param.impactWeight || '1.0');
    
    // Normalize value to 0-100 scale based on parameter type
    let normalizedValue = value;
    
    // Apply parameter-specific normalization
    switch (param.parameterName.toLowerCase()) {
      case 'renewable_energy_percentage':
      case 'ghg_emissions_reduction':
      case 'employee_safety_training':
      case 'board_diversity_ratio':
        normalizedValue = Math.min(value, 100); // Already percentage
        break;
      case 'water_efficiency':
        normalizedValue = Math.min(value * 10, 100); // Scale up efficiency metrics
        break;
      case 'waste_reduction':
        normalizedValue = Math.min(value * 2, 100); // Scale waste reduction
        break;
      default:
        normalizedValue = Math.min(value, 100);
    }
    
    // Apply weight and add to appropriate category
    const weightedScore = normalizedValue * weight;
    
    switch (param.category) {
      case 'environmental':
        environmentalScore += weightedScore;
        environmentalCount += weight;
        break;
      case 'social':
        socialScore += weightedScore;
        socialCount += weight;
        break;
      case 'governance':
        governanceScore += weightedScore;
        governanceCount += weight;
        break;
    }
  }

  // Calculate averages (avoid division by zero)
  const finalEnvironmentalScore = environmentalCount > 0 ? environmentalScore / environmentalCount : 0;
  const finalSocialScore = socialCount > 0 ? socialScore / socialCount : 0;
  const finalGovernanceScore = governanceCount > 0 ? governanceScore / governanceCount : 0;

  // Calculate overall score with standard ESG weightings
  // Environmental: 40%, Social: 30%, Governance: 30%
  const overallScore = (
    finalEnvironmentalScore * 0.4 +
    finalSocialScore * 0.3 +
    finalGovernanceScore * 0.3
  );

  return {
    overallScore: Math.round(overallScore * 100) / 100,
    environmentalScore: Math.round(finalEnvironmentalScore * 100) / 100,
    socialScore: Math.round(finalSocialScore * 100) / 100,
    governanceScore: Math.round(finalGovernanceScore * 100) / 100,
  };
}

export async function calculateParameterImpact(
  parameterName: string,
  currentValue: string,
  newValue: string,
  category: string,
  weight: string = '1.0'
): Promise<ParameterImpactResult> {
  const currentNum = parseFloat(currentValue);
  const newNum = parseFloat(newValue);
  const weightNum = parseFloat(weight);
  
  // Calculate the delta
  const delta = newNum - currentNum;
  
  // Apply parameter-specific impact calculations
  let impactMultiplier = 1.0;
  
  switch (parameterName.toLowerCase()) {
    case 'renewable_energy_percentage':
      impactMultiplier = 0.8; // High impact on environmental
      break;
    case 'ghg_emissions_reduction':
      impactMultiplier = 1.2; // Very high impact
      break;
    case 'employee_safety_training':
      impactMultiplier = 0.6; // Moderate impact on social
      break;
    case 'board_diversity_ratio':
      impactMultiplier = 0.7; // Good impact on governance
      break;
    case 'water_efficiency':
      impactMultiplier = 0.5; // Environmental focus
      break;
    default:
      impactMultiplier = 0.5;
  }
  
  // Calculate weighted impact
  const baseImpact = delta * weightNum * impactMultiplier;
  
  // Distribute impact based on category and cross-category effects
  let environmental = 0;
  let social = 0;
  let governance = 0;
  
  switch (category) {
    case 'environmental':
      environmental = baseImpact;
      social = baseImpact * 0.2; // Cross-category effect
      governance = baseImpact * 0.1;
      break;
    case 'social':
      social = baseImpact;
      environmental = baseImpact * 0.15;
      governance = baseImpact * 0.25; // Social often affects governance
      break;
    case 'governance':
      governance = baseImpact;
      environmental = baseImpact * 0.1;
      social = baseImpact * 0.2;
      break;
  }
  
  // Calculate overall impact with standard weightings
  const overall = environmental * 0.4 + social * 0.3 + governance * 0.3;
  
  return {
    environmental: Math.round(environmental * 100) / 100,
    social: Math.round(social * 100) / 100,
    governance: Math.round(governance * 100) / 100,
    overall: Math.round(overall * 100) / 100,
  };
}