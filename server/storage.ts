import { 
  users, 
  organizations,
  esgParameters,
  esgMetrics,
  complianceFrameworks,
  esgScores,
  socialMetrics,
  industryBenchmarks,
  emissionFactors,
  type User, 
  type UpsertUser,
  type Organization,
  type InsertOrganization,
  type ESGParameter,
  type InsertESGParameter,
  type ESGMetric,
  type InsertESGMetric,
  type ComplianceFramework,
  type InsertComplianceFramework,
  type ESGScore,
  type SocialMetric,
  type InsertSocialMetric,
  type IndustryBenchmark,
  type EmissionFactor,
  dataCenterMetrics,
  type DataCenterMetric,
  type InsertDataCenterMetric,
  aiAnalyses,
  type AIAnalysis,
  type InsertAIAnalysis,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, gt } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  createUser(user: any): Promise<User>;
  updateUser(id: string, userData: any): Promise<User>;
  deleteUser(id: string): Promise<void>;
  
  // Organization operations
  getOrganization(id: number): Promise<Organization | undefined>;
  createOrganization(org: InsertOrganization): Promise<Organization>;
  
  // ESG Parameters operations
  getESGParameters(organizationId: number): Promise<ESGParameter[]>;
  updateESGParameter(id: number, parameter: Partial<InsertESGParameter>): Promise<ESGParameter>;
  
  // ESG Metrics operations
  getESGMetrics(organizationId: number, metricType?: string): Promise<ESGMetric[]>;
  createESGMetric(metric: InsertESGMetric): Promise<ESGMetric>;
  
  // Compliance operations
  getComplianceFrameworks(organizationId: number): Promise<ComplianceFramework[]>;
  updateComplianceFramework(id: number, framework: Partial<InsertComplianceFramework>): Promise<ComplianceFramework>;
  
  // ESG Score operations
  getLatestESGScore(organizationId: number): Promise<ESGScore | undefined>;
  createESGScore(score: Omit<ESGScore, 'id'>): Promise<ESGScore>;
  getESGScoreHistory(organizationId: number, limit?: number): Promise<ESGScore[]>;
  
  // ESG Parameters operations (additional methods)
  getESGParametersByCategory(organizationId: number, category: string): Promise<ESGParameter[]>;
  createESGParameter(parameter: InsertESGParameter): Promise<ESGParameter>;
  
  // Organization operations (additional methods)
  getAllOrganizations(): Promise<Organization[]>;
  
  // Environmental Metrics operations
  getEnvironmentalMetrics(organizationId: number): Promise<ESGMetric[]>;
  getEnvironmentalMetricsByType(organizationId: number, metricType: string): Promise<ESGMetric[]>;
  
  // Social Metrics operations
  getSocialMetrics(organizationId: number, metricType?: string): Promise<SocialMetric[]>;
  createSocialMetric(metric: InsertSocialMetric): Promise<SocialMetric>;
  getSocialMetricsByType(organizationId: number, metricType: string): Promise<SocialMetric[]>;
  
  // Governance Metrics operations
  getGovernanceMetrics(organizationId: number): Promise<ESGMetric[]>;
  getGovernanceMetricsByType(organizationId: number, metricType: string): Promise<ESGMetric[]>;
  
  // Industry Benchmarks operations
  getIndustryBenchmarks(industry?: string, metric?: string): Promise<IndustryBenchmark[]>;
  
  // Emission Factors operations
  getEmissionFactors(scope?: number, region?: string): Promise<EmissionFactor[]>;
  
  // Data Center operations
  getDataCenterMetrics(organizationId: number, facilityId?: string): Promise<DataCenterMetric[]>;
  createDataCenterMetric(metric: InsertDataCenterMetric): Promise<DataCenterMetric>;
  
  // AI Analysis operations
  getCachedAIAnalysis(organizationId: number, analysisType: string, moduleType?: string): Promise<AIAnalysis | undefined>;
  storeAIAnalysis(analysis: InsertAIAnalysis): Promise<AIAnalysis>;
  getAIAnalyses(organizationId: number, analysisType?: string, moduleType?: string): Promise<AIAnalysis[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async createUser(userData: any): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
    return user;
  }

  async updateUser(id: string, userData: any): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async deleteUser(id: string): Promise<void> {
    await db.delete(users).where(eq(users.id, id));
  }

  // Organization operations
  async getOrganization(id: number): Promise<Organization | undefined> {
    const [org] = await db.select().from(organizations).where(eq(organizations.id, id));
    return org;
  }

  async createOrganization(orgData: InsertOrganization): Promise<Organization> {
    const [org] = await db
      .insert(organizations)
      .values(orgData)
      .returning();
    return org;
  }

  // ESG Parameters operations
  async getESGParameters(organizationId: number): Promise<ESGParameter[]> {
    return await db
      .select()
      .from(esgParameters)
      .where(eq(esgParameters.organizationId, organizationId))
      .orderBy(esgParameters.category, esgParameters.parameterName);
  }

  async updateESGParameter(id: number, parameterData: Partial<InsertESGParameter>): Promise<ESGParameter> {
    const [parameter] = await db
      .update(esgParameters)
      .set({ ...parameterData, lastUpdated: new Date() })
      .where(eq(esgParameters.id, id))
      .returning();
    return parameter;
  }

  // ESG Metrics operations
  async getESGMetrics(organizationId: number, metricType?: string): Promise<ESGMetric[]> {
    const conditions = [eq(esgMetrics.organizationId, organizationId)];
    if (metricType) {
      conditions.push(eq(esgMetrics.metricType, metricType));
    }
    
    return await db
      .select()
      .from(esgMetrics)
      .where(and(...conditions))
      .orderBy(desc(esgMetrics.reportingPeriod));
  }

  async createESGMetric(metricData: InsertESGMetric): Promise<ESGMetric> {
    const [metric] = await db
      .insert(esgMetrics)
      .values(metricData)
      .returning();
    return metric;
  }

  // Compliance operations
  async getComplianceFrameworks(organizationId: number): Promise<ComplianceFramework[]> {
    return await db
      .select()
      .from(complianceFrameworks)
      .where(eq(complianceFrameworks.organizationId, organizationId))
      .orderBy(complianceFrameworks.frameworkName);
  }

  async updateComplianceFramework(id: number, frameworkData: Partial<InsertComplianceFramework>): Promise<ComplianceFramework> {
    const [framework] = await db
      .update(complianceFrameworks)
      .set({ ...frameworkData, updatedAt: new Date() })
      .where(eq(complianceFrameworks.id, id))
      .returning();
    return framework;
  }

  // ESG Score operations
  async getLatestESGScore(organizationId: number): Promise<ESGScore | undefined> {
    const [score] = await db
      .select()
      .from(esgScores)
      .where(eq(esgScores.organizationId, organizationId))
      .orderBy(desc(esgScores.calculationDate))
      .limit(1);
    return score;
  }

  async createESGScore(scoreData: Omit<ESGScore, 'id'>): Promise<ESGScore> {
    const [score] = await db
      .insert(esgScores)
      .values(scoreData)
      .returning();
    return score;
  }

  // Social Metrics operations
  async getSocialMetrics(organizationId: number, metricType?: string): Promise<SocialMetric[]> {
    const conditions = [eq(socialMetrics.organizationId, organizationId)];
    if (metricType) {
      conditions.push(eq(socialMetrics.metricType, metricType));
    }
    
    return await db
      .select()
      .from(socialMetrics)
      .where(and(...conditions))
      .orderBy(desc(socialMetrics.reportingPeriod));
  }

  async createSocialMetric(metricData: InsertSocialMetric): Promise<SocialMetric> {
    const [metric] = await db
      .insert(socialMetrics)
      .values(metricData)
      .returning();
    return metric;
  }

  // Additional ESG Score operations
  async getESGScoreHistory(organizationId: number, limit = 10): Promise<ESGScore[]> {
    return await db
      .select()
      .from(esgScores)
      .where(eq(esgScores.organizationId, organizationId))
      .orderBy(desc(esgScores.calculationDate))
      .limit(limit);
  }

  // Additional ESG Parameters operations
  async getESGParametersByCategory(organizationId: number, category: string): Promise<ESGParameter[]> {
    return await db
      .select()
      .from(esgParameters)
      .where(and(
        eq(esgParameters.organizationId, organizationId),
        eq(esgParameters.category, category)
      ))
      .orderBy(esgParameters.parameterName);
  }

  async createESGParameter(parameterData: InsertESGParameter): Promise<ESGParameter> {
    const [parameter] = await db
      .insert(esgParameters)
      .values(parameterData)
      .returning();
    return parameter;
  }

  // Environmental Metrics operations
  async getEnvironmentalMetrics(organizationId: number): Promise<ESGMetric[]> {
    return await db
      .select()
      .from(esgMetrics)
      .where(and(
        eq(esgMetrics.organizationId, organizationId),
        eq(esgMetrics.category, 'environmental')
      ))
      .orderBy(desc(esgMetrics.reportingPeriod));
  }

  async getEnvironmentalMetricsByType(organizationId: number, metricType: string): Promise<ESGMetric[]> {
    return await db
      .select()
      .from(esgMetrics)
      .where(and(
        eq(esgMetrics.organizationId, organizationId),
        eq(esgMetrics.category, 'environmental'),
        eq(esgMetrics.metricType, metricType)
      ))
      .orderBy(desc(esgMetrics.reportingPeriod));
  }

  // Social Metrics operations (additional)
  async getSocialMetricsByType(organizationId: number, metricType: string): Promise<SocialMetric[]> {
    return await db
      .select()
      .from(socialMetrics)
      .where(and(
        eq(socialMetrics.organizationId, organizationId),
        eq(socialMetrics.metricType, metricType)
      ))
      .orderBy(desc(socialMetrics.reportingPeriod));
  }

  // Governance Metrics operations
  async getGovernanceMetrics(organizationId: number): Promise<ESGMetric[]> {
    return await db
      .select()
      .from(esgMetrics)
      .where(and(
        eq(esgMetrics.organizationId, organizationId),
        eq(esgMetrics.category, 'governance')
      ))
      .orderBy(desc(esgMetrics.reportingPeriod));
  }

  async getGovernanceMetricsByType(organizationId: number, metricType: string): Promise<ESGMetric[]> {
    return await db
      .select()
      .from(esgMetrics)
      .where(and(
        eq(esgMetrics.organizationId, organizationId),
        eq(esgMetrics.category, 'governance'),
        eq(esgMetrics.metricType, metricType)
      ))
      .orderBy(desc(esgMetrics.reportingPeriod));
  }

  // Industry Benchmarks operations
  async getIndustryBenchmarks(industry?: string, metric?: string): Promise<IndustryBenchmark[]> {
    const conditions = [];
    if (industry) {
      conditions.push(eq(industryBenchmarks.industry, industry));
    }
    if (metric) {
      conditions.push(eq(industryBenchmarks.metric, metric));
    }
    
    return await db
      .select()
      .from(industryBenchmarks)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(industryBenchmarks.industry, industryBenchmarks.metric);
  }

  // Emission Factors operations
  async getEmissionFactors(scope?: number, region?: string): Promise<EmissionFactor[]> {
    const conditions = [];
    if (scope) {
      conditions.push(eq(emissionFactors.scope, scope));
    }
    if (region) {
      conditions.push(eq(emissionFactors.region, region));
    }
    
    return await db
      .select()
      .from(emissionFactors)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(emissionFactors.source, emissionFactors.fuelType);
  }

  async getAllOrganizations(): Promise<Organization[]> {
    return await db.select().from(organizations);
  }

  // Data Center operations
  async getDataCenterMetrics(organizationId: number, facilityId?: string): Promise<DataCenterMetric[]> {
    let query = db.select().from(dataCenterMetrics).where(eq(dataCenterMetrics.organizationId, organizationId));
    
    if (facilityId) {
      query = query.where(eq(dataCenterMetrics.facilityId, facilityId));
    }
    
    return await query;
  }

  async createDataCenterMetric(metricData: InsertDataCenterMetric): Promise<DataCenterMetric> {
    const [metric] = await db
      .insert(dataCenterMetrics)
      .values(metricData)
      .returning();
    return metric;
  }

  // AI Analysis operations
  async getCachedAIAnalysis(organizationId: number, analysisType: string, moduleType?: string): Promise<AIAnalysis | undefined> {
    let query = db.select().from(aiAnalyses)
      .where(eq(aiAnalyses.organizationId, organizationId))
      .where(eq(aiAnalyses.analysisType, analysisType));
    
    if (moduleType) {
      query = query.where(eq(aiAnalyses.moduleType, moduleType));
    }
    
    const results = await query
      .where(gt(aiAnalyses.expiresAt, new Date()))
      .orderBy(desc(aiAnalyses.generatedAt))
      .limit(1);
      
    return results[0];
  }

  async storeAIAnalysis(analysisData: InsertAIAnalysis): Promise<AIAnalysis> {
    const [analysis] = await db
      .insert(aiAnalyses)
      .values(analysisData)
      .returning();
    return analysis;
  }

  async getAIAnalyses(organizationId: number, analysisType?: string, moduleType?: string): Promise<AIAnalysis[]> {
    let query = db.select().from(aiAnalyses)
      .where(eq(aiAnalyses.organizationId, organizationId));
    
    if (analysisType) {
      query = query.where(eq(aiAnalyses.analysisType, analysisType));
    }
    
    if (moduleType) {
      query = query.where(eq(aiAnalyses.moduleType, moduleType));
    }
    
    return await query.orderBy(desc(aiAnalyses.generatedAt));
  }
}

export const storage = new DatabaseStorage();
