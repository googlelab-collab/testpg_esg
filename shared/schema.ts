import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  decimal,
  boolean,
  date,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { length: 20 }).notNull().default("operations"), // executive, admin, manager, operations
  permissions: text("permissions").array(),
  isActive: boolean("is_active").default(true).notNull(),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Organizations table
export const organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  industry: text("industry"),
  size: integer("size"), // number of employees
  headquarters: text("headquarters"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ESG Parameters for interactive score calculation
export const esgParameters = pgTable("esg_parameters", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  category: text("category").notNull(), // environmental, social, governance
  parameterName: text("parameter_name").notNull(),
  currentValue: text("current_value").notNull(),
  targetValue: text("target_value"),
  unit: text("unit"),
  impactWeight: text("impact_weight").notNull().default("1.0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
  updatedBy: varchar("updated_by"),
});

// ESG Metrics for real-world data tracking
export const esgMetrics = pgTable("esg_metrics", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  category: text("category").notNull(), // environmental, social, governance
  metricType: text("metric_type").notNull(), // ghg_emissions, energy, water, waste, diversity, safety, etc.
  metricName: text("metric_name").notNull(),
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  unit: text("unit").notNull(),
  scope: text("scope"), // for emissions: scope1, scope2, scope3
  source: text("source").notNull(),
  verificationStatus: text("verification_status").default("pending"), // pending, verified, audited
  reportingPeriod: date("reporting_period").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedBy: varchar("updated_by"),
});

// Regulatory Compliance tracking
export const complianceFrameworks = pgTable("compliance_frameworks", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  frameworkName: text("framework_name").notNull(), // EU_CSRD, SEC_CLIMATE, TCFD, GRI, SASB, etc.
  status: text("status").notNull().default("in_progress"), // compliant, in_progress, non_compliant, pending
  lastAssessment: date("last_assessment"),
  nextDeadline: date("next_deadline"),
  requirements: jsonb("requirements"), // array of requirement objects
  evidence: jsonb("evidence"), // array of evidence documents
  assuranceLevel: text("assurance_level"), // limited, reasonable, none
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// ESG Score Calculations
export const esgScores = pgTable("esg_scores", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  overallScore: decimal("overall_score", { precision: 5, scale: 2 }).notNull(),
  environmentalScore: decimal("environmental_score", { precision: 5, scale: 2 }).notNull(),
  socialScore: decimal("social_score", { precision: 5, scale: 2 }).notNull(),
  governanceScore: decimal("governance_score", { precision: 5, scale: 2 }).notNull(),
  methodology: text("methodology").notNull().default("MSCI"), // MSCI, Sustainalytics, Bloomberg
  calculationDate: timestamp("calculation_date").defaultNow(),
  benchmarkData: jsonb("benchmark_data"), // industry averages, peer comparisons
});

// Emission Factors for GHG calculations
export const emissionFactors = pgTable("emission_factors", {
  id: serial("id").primaryKey(),
  source: text("source").notNull(), // EPA, DEFRA, IEA
  fuelType: text("fuel_type").notNull(),
  factor: decimal("factor", { precision: 15, scale: 8 }).notNull(),
  unit: text("unit").notNull(),
  scope: integer("scope").notNull(), // 1, 2, 3
  region: text("region").notNull(),
  year: integer("year").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Regulatory Updates tracking
export const regulatoryUpdates = pgTable("regulatory_updates", {
  id: serial("id").primaryKey(),
  framework: text("framework").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  effectiveDate: date("effective_date").notNull(),
  impact: text("impact").notNull(), // high, medium, low
  actionRequired: boolean("action_required").default(false),
  sourceUrl: text("source_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Industry Benchmarks
export const industryBenchmarks = pgTable("industry_benchmarks", {
  id: serial("id").primaryKey(),
  industry: text("industry").notNull(),
  metric: text("metric").notNull(),
  value: decimal("value", { precision: 15, scale: 4 }).notNull(),
  unit: text("unit").notNull(),
  percentile: integer("percentile"), // 25th, 50th, 75th, 90th percentile
  source: text("source").notNull(),
  year: integer("year").notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Social Metrics for diversity, safety, etc.
export const socialMetrics = pgTable("social_metrics", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").notNull(),
  metricType: text("metric_type").notNull(), // diversity, safety, community, human_rights, etc.
  category: text("category"), // gender, ethnicity, age, leadership for diversity
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  percentage: decimal("percentage", { precision: 5, scale: 2 }),
  target: decimal("target", { precision: 10, scale: 2 }),
  unit: text("unit"),
  reportingPeriod: date("reporting_period").notNull(),
  breakdown: jsonb("breakdown"), // detailed breakdown data
  createdAt: timestamp("created_at").defaultNow(),
  updatedBy: varchar("updated_by"),
});

// Create insert schemas
// Data Center specific metrics table
export const dataCenterMetrics = pgTable("datacenter_metrics", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  facilityId: varchar("facility_id", { length: 100 }),
  facilityName: varchar("facility_name", { length: 200 }),
  location: varchar("location", { length: 200 }),
  
  // Core efficiency metrics
  pue: decimal("pue", { precision: 10, scale: 4 }), // Power Usage Effectiveness
  wue: decimal("wue", { precision: 10, scale: 4 }), // Water Usage Effectiveness  
  cue: decimal("cue", { precision: 10, scale: 4 }), // Carbon Usage Effectiveness
  cer: decimal("cer", { precision: 10, scale: 4 }), // Cooling Efficiency Ratio
  erf: decimal("erf", { precision: 10, scale: 4 }), // Energy Reuse Factor
  ref: decimal("ref", { precision: 10, scale: 4 }), // Renewable Energy Factor
  
  // Energy metrics
  totalEnergyConsumption: decimal("total_energy_consumption", { precision: 15, scale: 2 }), // kWh
  itEnergyConsumption: decimal("it_energy_consumption", { precision: 15, scale: 2 }), // kWh
  coolingEnergyConsumption: decimal("cooling_energy_consumption", { precision: 15, scale: 2 }), // kWh
  renewableEnergyPercentage: decimal("renewable_energy_percentage", { precision: 5, scale: 2 }), // %
  
  // Carbon metrics
  scope1Emissions: decimal("scope1_emissions", { precision: 15, scale: 2 }), // tCO2e
  scope2Emissions: decimal("scope2_emissions", { precision: 15, scale: 2 }), // tCO2e
  scope3Emissions: decimal("scope3_emissions", { precision: 15, scale: 2 }), // tCO2e
  carbonIntensity: decimal("carbon_intensity", { precision: 10, scale: 4 }), // gCO2e/kWh
  
  // Water metrics
  waterConsumption: decimal("water_consumption", { precision: 15, scale: 2 }), // liters
  waterRecyclingRate: decimal("water_recycling_rate", { precision: 5, scale: 2 }), // %
  
  // Operational metrics
  uptime: decimal("uptime", { precision: 5, scale: 4 }), // % (99.99%)
  capacity: decimal("capacity", { precision: 10, scale: 2 }), // MW
  utilization: decimal("utilization", { precision: 5, scale: 2 }), // %
  
  // AI workload metrics
  aiWorkloadPercentage: decimal("ai_workload_percentage", { precision: 5, scale: 2 }), // %
  gpuUtilization: decimal("gpu_utilization", { precision: 5, scale: 2 }), // %
  
  // Cooling technology
  coolingType: varchar("cooling_type", { length: 100 }), // Air, Liquid, Immersion
  outsideTemperature: decimal("outside_temperature", { precision: 5, scale: 2 }), // Celsius
  
  reportingPeriod: date("reporting_period"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedBy: varchar("updated_by"),
});

// AI Analysis results storage
export const aiAnalyses = pgTable("ai_analyses", {
  id: serial("id").primaryKey(),
  organizationId: integer("organization_id").references(() => organizations.id),
  analysisType: varchar("analysis_type", { length: 100 }).notNull(),
  moduleType: varchar("module_type", { length: 100 }),
  requestData: jsonb("request_data"),
  insights: jsonb("insights"),
  recommendations: jsonb("recommendations"),
  risks: jsonb("risks"),
  opportunities: jsonb("opportunities"),
  actionPlan: jsonb("action_plan"),
  benchmarks: jsonb("benchmarks"),
  confidence: decimal("confidence", { precision: 5, scale: 2 }), // AI confidence score
  generatedAt: timestamp("generated_at").defaultNow(),
  expiresAt: timestamp("expires_at"), // Cache expiration
});

export const insertUserSchema = createInsertSchema(users).pick({
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  profileImageUrl: true,
  role: true,
});

export const insertOrganizationSchema = createInsertSchema(organizations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertESGParameterSchema = createInsertSchema(esgParameters).omit({
  id: true,
  lastUpdated: true,
});

export const insertESGMetricSchema = createInsertSchema(esgMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceFrameworkSchema = createInsertSchema(complianceFrameworks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSocialMetricSchema = createInsertSchema(socialMetrics).omit({
  id: true,
  createdAt: true,
});

export const insertESGScoreSchema = createInsertSchema(esgScores).omit({
  id: true,
});

// Export types
export type UpsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Organization = typeof organizations.$inferSelect;
export type InsertOrganization = z.infer<typeof insertOrganizationSchema>;
export type ESGParameter = typeof esgParameters.$inferSelect;
export type InsertESGParameter = z.infer<typeof insertESGParameterSchema>;
export type ESGMetric = typeof esgMetrics.$inferSelect;
export type InsertESGMetric = z.infer<typeof insertESGMetricSchema>;
export type ComplianceFramework = typeof complianceFrameworks.$inferSelect;
export type InsertComplianceFramework = z.infer<typeof insertComplianceFrameworkSchema>;
export type ESGScore = typeof esgScores.$inferSelect;
export type EmissionFactor = typeof emissionFactors.$inferSelect;
export type RegulatoryUpdate = typeof regulatoryUpdates.$inferSelect;
export type IndustryBenchmark = typeof industryBenchmarks.$inferSelect;
export type SocialMetric = typeof socialMetrics.$inferSelect;
export type InsertSocialMetric = z.infer<typeof insertSocialMetricSchema>;
export type DataCenterMetric = typeof dataCenterMetrics.$inferSelect;
export type InsertDataCenterMetric = typeof dataCenterMetrics.$inferInsert;
export type AIAnalysis = typeof aiAnalyses.$inferSelect;
export type InsertAIAnalysis = typeof aiAnalyses.$inferInsert;
