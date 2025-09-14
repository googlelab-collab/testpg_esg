export const ESG_FRAMEWORKS = {
  EU_CSRD: "EU Corporate Sustainability Reporting Directive",
  SEC_CLIMATE: "SEC Climate Disclosure Rules",
  TCFD: "Task Force on Climate-related Financial Disclosures",
  GRI: "Global Reporting Initiative Standards",
  SASB: "Sustainability Accounting Standards Board",
  ISSB: "International Sustainability Standards Board",
  CDP: "Carbon Disclosure Project",
  UNGC: "UN Global Compact",
} as const;

export const ESG_CATEGORIES = {
  ENVIRONMENTAL: "environmental",
  SOCIAL: "social",
  GOVERNANCE: "governance",
} as const;

export const COMPLIANCE_STATUSES = {
  COMPLIANT: "compliant",
  IN_PROGRESS: "in_progress",
  NON_COMPLIANT: "non_compliant",
  PENDING: "pending",
} as const;

export const USER_ROLES = {
  EXECUTIVE: "executive",
  MANAGER: "manager",
  TECHNICIAN: "technician",
  HR: "hr",
  ADMINISTRATOR: "administrator",
  SECURITY: "security",
} as const;

export const EMISSION_SCOPES = {
  SCOPE_1: "scope1",
  SCOPE_2: "scope2",
  SCOPE_3: "scope3",
} as const;

export const INDUSTRY_BENCHMARKS = {
  SP500_AVERAGE: 68,
  TECHNOLOGY_AVERAGE: 72,
  MANUFACTURING_AVERAGE: 65,
  FINANCIAL_AVERAGE: 71,
} as const;

export const ESG_SCORE_RANGES = {
  EXCELLENT: { min: 80, max: 100, grade: "A" },
  GOOD: { min: 70, max: 79, grade: "B" },
  AVERAGE: { min: 60, max: 69, grade: "C" },
  BELOW_AVERAGE: { min: 50, max: 59, grade: "D" },
  POOR: { min: 0, max: 49, grade: "F" },
} as const;

export const PARAMETER_WEIGHTS = {
  ENVIRONMENTAL: {
    RENEWABLE_ENERGY: 0.25,
    EMISSIONS_REDUCTION: 0.30,
    ENERGY_EFFICIENCY: 0.20,
    WASTE_REDUCTION: 0.15,
    WATER_CONSERVATION: 0.10,
  },
  SOCIAL: {
    DIVERSITY_INCLUSION: 0.25,
    EMPLOYEE_SAFETY: 0.20,
    COMMUNITY_INVESTMENT: 0.15,
    HUMAN_RIGHTS: 0.20,
    EMPLOYEE_WELLBEING: 0.20,
  },
  GOVERNANCE: {
    BOARD_INDEPENDENCE: 0.25,
    EXECUTIVE_COMPENSATION: 0.20,
    RISK_MANAGEMENT: 0.20,
    COMPLIANCE: 0.20,
    TRANSPARENCY: 0.15,
  },
} as const;

export const REGULATORY_DEADLINES = {
  EU_CSRD: {
    LARGE_COMPANIES: "2025-01-01",
    LISTED_SMES: "2026-01-01",
    NON_EU_COMPANIES: "2028-01-01",
  },
  SEC_CLIMATE: {
    LARGE_ACCELERATED: "2025-03-15",
    ACCELERATED: "2026-03-15",
    NON_ACCELERATED: "2027-03-15",
  },
} as const;
