
import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { registerAIRoutes } from "./routes/aiRoutes";
import { calculateESGScore, calculateParameterImpact } from "./utils/esgCalculations";
import { insertESGParameterSchema, insertESGScoreSchema } from "@shared/schema";
import { scheduledJobs } from "./integrations/scheduledJobs";
import dataRoutes from "./routes/dataRoutes";
import reportRoutes from "./routes/reportRoutes";
import backupRoutes from "./routes/backupRoutes";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Register AI routes
  registerAIRoutes(app);

  // Start scheduled jobs
  scheduledJobs.startAllJobs();

  // Mount route modules
  app.use('/api/data', dataRoutes);
  app.use('/api/reports', reportRoutes);
  app.use('/api/backups', backupRoutes);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check for admin session first
      if (req.session?.user?.isAdmin) {
        const adminUser = await storage.getUser("admin");
        if (adminUser) {
          return res.json(adminUser);
        }
      }
      
      // Check for OAuth authentication
      if (req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims?.sub;
        if (userId) {
          const user = await storage.getUser(userId);
          if (user) {
            return res.json(user);
          }
        }
      }
      
      res.status(401).json({ message: "Unauthorized" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Admin login endpoint
  app.post('/api/auth/admin-login', async (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (username === "admin" && password === "admin123") {
        // Create or get admin user
        const adminUser = await storage.upsertUser({
          id: "admin",
          email: "admin@esgsuite.com",
          firstName: "System",
          lastName: "Administrator",
          profileImageUrl: null,
        });

        // Create session for admin user
        (req.session as any).user = {
          id: "admin",
          claims: { sub: "admin" },
          isAdmin: true
        };

        res.json({ 
          success: true, 
          user: adminUser,
          message: "Admin login successful" 
        });
      } else {
        res.status(401).json({ message: "Invalid admin credentials" });
      }
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Admin login failed" });
    }
  });

  // Admin logout endpoint
  app.post('/api/auth/admin-logout', (req, res) => {
    try {
      req.session.destroy((err) => {
        if (err) {
          console.error("Session destruction error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ success: true, message: "Admin logout successful" });
      });
    } catch (error) {
      console.error("Admin logout error:", error);
      res.status(500).json({ message: "Admin logout failed" });
    }
  });

  // User Management endpoints
  app.get('/api/users', async (req, res) => {
    try {
      // Check for admin access
      let isAdmin = false;
      
      // Check admin session
      if (req.session?.user?.isAdmin) {
        isAdmin = true;
      }
      
      // Check OAuth admin
      if (req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims?.sub;
        if (userId === "admin") {
          isAdmin = true;
        }
      }
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post('/api/users', async (req, res) => {
    try {
      // Check for admin access
      let isAdmin = false;
      
      if (req.session?.user?.isAdmin) {
        isAdmin = true;
      }
      
      if (req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims?.sub;
        if (userId === "admin") {
          isAdmin = true;
        }
      }
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userData = req.body;
      const newUser = await storage.createUser({
        id: Math.random().toString(36).substr(2, 9),
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        role: userData.role || 'operations',
        isActive: userData.isActive !== false,
        profileImageUrl: null
      });
      
      res.json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put('/api/users/:id', async (req, res) => {
    try {
      // Check for admin access
      let isAdmin = false;
      
      if (req.session?.user?.isAdmin) {
        isAdmin = true;
      }
      
      if (req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims?.sub;
        if (userId === "admin") {
          isAdmin = true;
        }
      }
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      const userData = req.body;
      const updatedUser = await storage.updateUser(userId, userData);
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete('/api/users/:id', async (req, res) => {
    try {
      // Check for admin access
      let isAdmin = false;
      
      if (req.session?.user?.isAdmin) {
        isAdmin = true;
      }
      
      if (req.isAuthenticated && req.isAuthenticated()) {
        const userId = req.user.claims?.sub;
        if (userId === "admin") {
          isAdmin = true;
        }
      }
      
      if (!isAdmin) {
        return res.status(403).json({ message: "Access denied" });
      }
      
      const userId = req.params.id;
      await storage.deleteUser(userId);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });
  
  // ESG Score endpoints
  app.get("/api/esg-scores/:organizationId", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const latestScore = await storage.getLatestESGScore(organizationId);
      
      if (!latestScore) {
        // Calculate initial score if none exists
        const parameters = await storage.getESGParameters(organizationId);
        const calculatedScore = await calculateESGScore(parameters);
        
        const newScore = await storage.createESGScore({
          organizationId,
          overallScore: calculatedScore.overallScore,
          environmentalScore: calculatedScore.environmentalScore,
          socialScore: calculatedScore.socialScore,
          governanceScore: calculatedScore.governanceScore,
          methodology: "MSCI",
          calculationDate: new Date(),
          benchmarkData: null,
        });
        
        res.json(newScore);
      } else {
        res.json(latestScore);
      }
    } catch (error) {
      console.error("Error fetching ESG scores:", error);
      res.status(500).json({ message: "Failed to fetch ESG scores" });
    }
  });

  app.get("/api/esg-scores/:organizationId/history", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const limit = parseInt(req.query.limit as string) || 10;
      const scoreHistory = await storage.getESGScoreHistory(organizationId, limit);
      res.json(scoreHistory);
    } catch (error) {
      console.error("Error fetching ESG score history:", error);
      res.status(500).json({ message: "Failed to fetch ESG score history" });
    }
  });

  // ESG Parameters endpoints
  app.get("/api/esg-parameters/:organizationId", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const category = req.query.category as string;
      
      let parameters;
      if (category) {
        parameters = await storage.getESGParametersByCategory(organizationId, category);
      } else {
        parameters = await storage.getESGParameters(organizationId);
      }
      
      res.json(parameters);
    } catch (error) {
      console.error("Error fetching ESG parameters:", error);
      res.status(500).json({ message: "Failed to fetch ESG parameters" });
    }
  });

  app.post("/api/esg-parameters", async (req, res) => {
    try {
      const validatedData = insertESGParameterSchema.parse(req.body);
      const parameter = await storage.createESGParameter(validatedData);
      res.json(parameter);
    } catch (error) {
      console.error("Error creating ESG parameter:", error);
      res.status(500).json({ message: "Failed to create ESG parameter" });
    }
  });

  app.put("/api/esg-parameters/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertESGParameterSchema.partial().parse(req.body);
      const parameter = await storage.updateESGParameter(id, validatedData);
      res.json(parameter);
    } catch (error) {
      console.error("Error updating ESG parameter:", error);
      res.status(500).json({ message: "Failed to update ESG parameter" });
    }
  });

  // Calculate parameter impact
  app.post("/api/esg-parameters/:organizationId/calculate-impact", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const parameterChanges = req.body;
      
      const currentParameters = await storage.getESGParameters(organizationId);
      const impact = await calculateParameterImpact(currentParameters, parameterChanges);
      
      res.json(impact);
    } catch (error) {
      console.error("Error calculating parameter impact:", error);
      res.status(500).json({ message: "Failed to calculate parameter impact" });
    }
  });

  // Report Generation Routes
  app.post('/api/reports/generate', isAuthenticated, async (req, res) => {
    try {
      const { organizationId = 1, reportType, module, period, framework = 'GRI' } = req.body;
      
      // Fetch organization data
      const organization = await storage.getOrganization(organizationId);
      if (!organization) {
        return res.status(404).json({ message: 'Organization not found' });
      }

      // Fetch relevant data based on report type
      let metrics = [];
      let scores = null;
      let compliance = [];

      if (reportType === 'environmental' || reportType === 'comprehensive') {
        metrics.push(...await storage.getEnvironmentalMetrics(organizationId));
      }
      
      if (reportType === 'social' || reportType === 'comprehensive') {
        metrics.push(...await storage.getSocialMetrics(organizationId));
      }
      
      if (reportType === 'governance' || reportType === 'comprehensive') {
        metrics.push(...await storage.getGovernanceMetrics(organizationId));
      }

      // Get ESG scores
      scores = await storage.getLatestESGScore(organizationId);
      
      // Get compliance frameworks
      compliance = await storage.getComplianceFrameworks(organizationId);
      
      // Get ESG parameters for additional context
      const parameters = await storage.getESGParameters(organizationId);

      const reportData = {
        organizationId,
        organizationName: organization.name,
        reportType,
        module: module || 'Comprehensive',
        period: period || 'Annual 2024',
        data: { parameters },
        metrics,
        scores,
        compliance
      };

      res.json({ 
        success: true, 
        reportData,
        message: 'Report data generated successfully' 
      });
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ message: 'Failed to generate report' });
    }
  });

  app.get('/api/reports/frameworks', isAuthenticated, async (req, res) => {
    try {
      const frameworks = [
        {
          id: 'GRI',
          name: 'Global Reporting Initiative (GRI)',
          description: 'Most widely adopted global standards for sustainability reporting',
          categories: ['Environmental', 'Social', 'Economic']
        },
        {
          id: 'SASB',
          name: 'Sustainability Accounting Standards Board (SASB)',
          description: 'Industry-specific sustainability accounting standards',
          categories: ['Financially Material Topics']
        },
        {
          id: 'TCFD',
          name: 'Task Force on Climate-related Financial Disclosures',
          description: 'Climate-related financial disclosure recommendations',
          categories: ['Governance', 'Strategy', 'Risk Management', 'Metrics & Targets']
        },
        {
          id: 'EU-CSRD',
          name: 'EU Corporate Sustainability Reporting Directive',
          description: 'European Union mandatory sustainability reporting directive',
          categories: ['Environmental', 'Social', 'Governance']
        },
        {
          id: 'SEC',
          name: 'SEC Climate Disclosure Rules',
          description: 'U.S. Securities and Exchange Commission climate disclosure requirements',
          categories: ['Climate Risk', 'GHG Emissions', 'Climate Targets']
        },
        {
          id: 'ISSB',
          name: 'International Sustainability Standards Board',
          description: 'Global baseline for sustainability-related financial disclosures',
          categories: ['Climate', 'General Sustainability']
        }
      ];

      res.json(frameworks);
    } catch (error) {
      console.error('Error fetching frameworks:', error);
      res.status(500).json({ message: 'Failed to fetch frameworks' });
    }
  });

  // Environmental Metrics endpoints
  app.get("/api/environmental-metrics/:organizationId", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const metricType = req.query.metricType as string;
      
      let metrics;
      if (metricType) {
        metrics = await storage.getEnvironmentalMetricsByType(organizationId, metricType);
      } else {
        metrics = await storage.getEnvironmentalMetrics(organizationId);
      }
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching environmental metrics:", error);
      res.status(500).json({ message: "Failed to fetch environmental metrics" });
    }
  });

  // Social Metrics endpoints
  app.get("/api/social-metrics/:organizationId", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const metricType = req.query.metricType as string;
      
      let metrics;
      if (metricType) {
        metrics = await storage.getSocialMetricsByType(organizationId, metricType);
      } else {
        metrics = await storage.getSocialMetrics(organizationId);
      }
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching social metrics:", error);
      res.status(500).json({ message: "Failed to fetch social metrics" });
    }
  });

  // Governance Metrics endpoints
  app.get("/api/governance-metrics/:organizationId", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const metricType = req.query.metricType as string;
      
      let metrics;
      if (metricType) {
        metrics = await storage.getGovernanceMetricsByType(organizationId, metricType);
      } else {
        metrics = await storage.getGovernanceMetrics(organizationId);
      }
      
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching governance metrics:", error);
      res.status(500).json({ message: "Failed to fetch governance metrics" });
    }
  });

  // Compliance Framework endpoints
  app.get("/api/compliance-frameworks/:organizationId", async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const frameworks = await storage.getComplianceFrameworks(organizationId);
      res.json(frameworks);
    } catch (error) {
      console.error("Error fetching compliance frameworks:", error);
      res.status(500).json({ message: "Failed to fetch compliance frameworks" });
    }
  });

  // Industry Benchmarks endpoints
  app.get("/api/industry-benchmarks/:industry", async (req, res) => {
    try {
      const industry = req.params.industry;
      const metric = req.query.metric as string;
      const benchmarks = await storage.getIndustryBenchmarks(industry, metric);
      res.json(benchmarks);
    } catch (error) {
      console.error("Error fetching industry benchmarks:", error);
      res.status(500).json({ message: "Failed to fetch industry benchmarks" });
    }
  });

  // Emission Factors endpoints
  app.get("/api/emission-factors", async (req, res) => {
    try {
      const scope = req.query.scope ? parseInt(req.query.scope as string) : undefined;
      const region = req.query.region as string;
      const factors = await storage.getEmissionFactors(scope, region);
      res.json(factors);
    } catch (error) {
      console.error("Error fetching emission factors:", error);
      res.status(500).json({ message: "Failed to fetch emission factors" });
    }
  });

  // Organization endpoints
  app.get("/api/organizations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const organization = await storage.getOrganization(id);
      if (!organization) {
        return res.status(404).json({ message: "Organization not found" });
      }
      res.json(organization);
    } catch (error) {
      console.error("Error fetching organization:", error);
      res.status(500).json({ message: "Failed to fetch organization" });
    }
  });

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = req.params.id; // Keep as string since getUser expects string
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });



  // ESG Parameter Update
  app.patch('/api/esg-parameters/:id', isAuthenticated, async (req, res) => {
    try {
      const { id } = req.params;
      const { currentValue, targetValue, impactWeight } = req.body;
      const parameter = await storage.updateESGParameter(parseInt(id), {
        currentValue,
        targetValue,
        impactWeight
      });
      res.json(parameter);
    } catch (error) {
      console.error("Error updating ESG parameter:", error);
      res.status(500).json({ message: "Failed to update ESG parameter" });
    }
  });

  // Parameter Impact Analysis
  app.post('/api/parameter-impact-analysis', isAuthenticated, async (req, res) => {
    try {
      const { organizationId, parameterId, newValue } = req.body;
      
      // Get current parameter
      const parameters = await storage.getESGParameters(organizationId);
      const parameter = parameters.find(p => p.id === parameterId);
      
      if (!parameter) {
        return res.status(404).json({ message: "Parameter not found" });
      }
      
      // Calculate impact based on parameter change
      const currentValue = parseFloat(parameter.currentValue);
      const newVal = parseFloat(newValue);
      const change = newVal - currentValue;
      const impactWeight = parseFloat(parameter.impactWeight || "1.0");
      
      // Calculate category-specific impacts
      let environmentalImpact = 0;
      let socialImpact = 0;
      let governanceImpact = 0;
      
      // Apply category-specific calculations
      if (parameter.category === "environmental") {
        environmentalImpact = change * impactWeight * 0.1;
        // Cross-impact on other categories
        socialImpact = change * impactWeight * 0.05;
        governanceImpact = change * impactWeight * 0.02;
      } else if (parameter.category === "social") {
        socialImpact = change * impactWeight * 0.1;
        // Cross-impact on other categories
        environmentalImpact = change * impactWeight * 0.03;
        governanceImpact = change * impactWeight * 0.05;
      } else if (parameter.category === "governance") {
        governanceImpact = change * impactWeight * 0.1;
        // Cross-impact on other categories
        environmentalImpact = change * impactWeight * 0.02;
        socialImpact = change * impactWeight * 0.03;
      }
      
      const overallImpact = environmentalImpact + socialImpact + governanceImpact;
      
      res.json({
        environmentalImpact,
        socialImpact,
        governanceImpact,
        overallImpact,
        parameterChange: change
      });
    } catch (error) {
      console.error("Error calculating parameter impact:", error);
      res.status(500).json({ message: "Failed to calculate parameter impact" });
    }
  });

  // Report Generation endpoints
  app.get('/api/reports/frameworks', async (req, res) => {
    try {
      const frameworks = [
        { value: 'GRI', label: 'Global Reporting Initiative (GRI)', description: 'Comprehensive sustainability reporting standards' },
        { value: 'SASB', label: 'Sustainability Accounting Standards Board (SASB)', description: 'Industry-specific sustainability metrics' },
        { value: 'TCFD', label: 'Task Force on Climate-related Financial Disclosures', description: 'Climate risk disclosure framework' },
        { value: 'EU-CSRD', label: 'EU Corporate Sustainability Reporting Directive', description: 'European sustainability reporting requirements' },
        { value: 'SEC', label: 'SEC Climate Disclosure Rules', description: 'US climate-related disclosure requirements' },
        { value: 'ISSB', label: 'International Sustainability Standards Board', description: 'Global baseline for sustainability disclosures' }
      ];
      res.json(frameworks);
    } catch (error) {
      console.error("Error fetching frameworks:", error);
      res.status(500).json({ message: "Failed to fetch frameworks" });
    }
  });

  app.post('/api/reports/generate', async (req, res) => {
    try {
      console.log('Report generation request:', req.body);
      
      const options = req.body;
      const organizationId = options.organizationId || 1;
      
      // Gather all necessary data for the report
      const [
        esgScore,
        esgParameters,
        environmentalMetrics,
        socialMetrics,
        complianceFrameworks,
        organization
      ] = await Promise.all([
        storage.getLatestESGScore(organizationId),
        storage.getESGParameters(organizationId),
        storage.getEnvironmentalMetrics(organizationId),
        storage.getSocialMetrics(organizationId),
        storage.getComplianceFrameworks(organizationId),
        storage.getOrganization(organizationId)
      ]);

      // Create comprehensive report data
      const reportData = {
        organizationName: organization?.name || 'Sample Organization',
        organizationId,
        reportType: options.reportType,
        module: options.module,
        period: options.period || 'Annual 2024',
        framework: options.framework || 'GRI',
        generatedAt: new Date().toISOString(),
        
        // ESG Scores
        esgScore: esgScore || {
          overallScore: '74',
          environmentalScore: '78',
          socialScore: '71',
          governanceScore: '73'
        },
        
        // Metrics data
        environmentalMetrics: environmentalMetrics?.map(metric => ({
          name: metric.metricName,
          value: metric.value,
          unit: metric.unit,
          target: metric.targetValue,
          trend: 'stable',
          category: metric.metricType
        })) || [],
        
        socialMetrics: socialMetrics?.map(metric => ({
          name: metric.metricName,
          value: metric.value,
          unit: metric.unit,
          target: metric.targetValue,
          trend: 'stable',
          category: metric.metricType
        })) || [],
        
        // Parameters
        parameters: esgParameters?.map(param => ({
          name: param.parameterName,
          currentValue: param.currentValue,
          targetValue: param.targetValue,
          category: param.category,
          impact: param.impactWeight
        })) || [],
        
        // Compliance
        complianceFrameworks: complianceFrameworks?.map(framework => ({
          name: framework.frameworkName,
          status: framework.complianceStatus,
          lastAssessment: framework.lastAssessmentDate,
          nextDeadline: framework.nextReportingDeadline
        })) || [],
        
        // Summary metrics for the report
        summaryMetrics: {
          totalEmissions: '45,230 tCO2e',
          renewableEnergy: '45%',
          waterUsage: '125,000 m³',
          employeeSafety: '0.12 LTIFR',
          boardDiversity: '40%',
          dataPrivacyCompliance: '98%'
        }
      };

      console.log('Report data compiled successfully');
      
      res.json({
        success: true,
        reportData,
        message: 'Report data generated successfully'
      });
      
    } catch (error) {
      console.error("Error generating report:", error);
      res.status(500).json({ 
        success: false,
        message: "Failed to generate report data",
        error: error.message 
      });
    }
  });

  // Data Center metrics endpoints
  app.get('/api/datacenter-metrics/:organizationId', isAuthenticated, async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const { facilityId } = req.query;
      
      const metrics = await storage.getDataCenterMetrics(organizationId, facilityId as string);
      res.json(metrics);
    } catch (error) {
      console.error("Error fetching data center metrics:", error);
      res.status(500).json({ message: "Failed to fetch data center metrics" });
    }
  });

  app.post('/api/datacenter-metrics', isAuthenticated, async (req, res) => {
    try {
      const metric = await storage.createDataCenterMetric(req.body);
      res.json(metric);
    } catch (error) {
      console.error("Error creating data center metric:", error);
      res.status(500).json({ message: "Failed to create data center metric" });
    }
  });

  // Enhanced report data endpoint
  app.get('/api/enhanced-report-data/:organizationId/:moduleType', isAuthenticated, async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const moduleType = req.params.moduleType;
      
      // Fetch comprehensive data for enhanced reporting
      const [metrics, parameters, complianceFrameworks, scores, benchmarks] = await Promise.all([
        storage.getESGMetrics(organizationId, moduleType),
        storage.getESGParameters(organizationId),
        storage.getComplianceFrameworks(organizationId),
        storage.getESGScoreHistory(organizationId, 12),
        storage.getIndustryBenchmarks()
      ]);

      // Fetch data center specific metrics if applicable
      let dataCenterMetrics = null;
      if (moduleType === 'datacenter') {
        dataCenterMetrics = await storage.getDataCenterMetrics(organizationId);
      }

      res.json({
        metrics,
        parameters,
        complianceFrameworks,
        scores,
        benchmarks,
        dataCenterMetrics,
        moduleType,
        organizationId
      });
    } catch (error) {
      console.error("Error fetching enhanced report data:", error);
      res.status(500).json({ message: "Failed to fetch enhanced report data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
