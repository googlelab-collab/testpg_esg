import type { Express } from "express";
import { esgAgent } from "../ai/anthropicAgent";
import { isAuthenticated } from "../replitAuth";
import { storage } from "../storage";

export function registerAIRoutes(app: Express) {
  // Test AI endpoint (no auth required for testing)
  app.post('/api/ai/test', async (req, res) => {
    try {
      console.log('Testing AI endpoint...');
      
      const testRequest = {
        type: 'carbon_reduction' as const,
        organizationId: 1,
        data: {
          metrics: [],
          parameters: [],
          complianceFrameworks: []
        },
        context: 'Test analysis'
      };

      const analysis = await esgAgent.analyzeESGPerformance(testRequest);
      
      res.json({
        success: true,
        analysis,
        message: 'AI analysis working correctly'
      });
    } catch (error) {
      console.error("AI Test Error:", error);
      res.status(500).json({ 
        success: false,
        message: "AI test failed",
        error: error.message 
      });
    }
  });

  // ESG Analysis endpoint - temporarily remove auth for testing
  app.post('/api/ai/analyze', async (req, res) => {
    try {
      const { type, organizationId, data, context, moduleType } = req.body;
      
      const analysisRequest = {
        type,
        organizationId,
        data,
        context,
        moduleType
      };

      // Check for cached analysis first
      const cachedAnalysis = await storage.getCachedAIAnalysis(organizationId, type, moduleType);
      
      if (cachedAnalysis) {
        return res.json({
          cached: true,
          analysis: JSON.parse(cachedAnalysis.analysis),
          generatedAt: cachedAnalysis.generatedAt
        });
      }

      // Generate new analysis
      const analysis = await esgAgent.analyzeESGPerformance(analysisRequest);
      
      // Store in cache for future use
      await storage.storeAIAnalysis({
        organizationId,
        analysisType: type,
        moduleType,
        analysis: JSON.stringify(analysis),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        generatedAt: new Date()
      });

      res.json({
        cached: false,
        analysis,
        generatedAt: new Date()
      });
    } catch (error) {
      console.error("AI Analysis Error:", error);
      console.error("Error stack:", error.stack);
      console.error("Request data:", JSON.stringify(req.body, null, 2));
      res.status(500).json({ 
        message: "Failed to generate AI analysis",
        error: error.message,
        details: error.stack 
      });
    }
  });

  // Data Center Optimization endpoint
  app.post('/api/ai/datacenter-optimize', isAuthenticated, async (req, res) => {
    try {
      const { organizationId, metrics } = req.body;
      
      const optimization = await esgAgent.optimizeDataCenterOperations(metrics);
      
      // Store optimization results
      await storage.storeAIAnalysis({
        organizationId,
        analysisType: 'datacenter_optimization',
        moduleType: 'datacenter',
        analysis: JSON.stringify(optimization),
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000), // 12 hours
        generatedAt: new Date()
      });

      res.json(optimization);
    } catch (error) {
      console.error("Data Center Optimization Error:", error);
      res.status(500).json({ 
        message: "Failed to generate optimization recommendations",
        error: error.message 
      });
    }
  });

  // ESG Report Generation endpoint
  app.post('/api/ai/generate-report', isAuthenticated, async (req, res) => {
    try {
      const { organizationId, moduleType, options } = req.body;
      
      const reportContent = await esgAgent.generateESGReport(organizationId, moduleType, options);
      
      res.json({
        content: reportContent,
        generatedAt: new Date()
      });
    } catch (error) {
      console.error("ESG Report Generation Error:", error);
      res.status(500).json({ 
        message: "Failed to generate ESG report",
        error: error.message 
      });
    }
  });

  // Get AI Analysis History endpoint
  app.get('/api/ai/analyses/:organizationId', isAuthenticated, async (req, res) => {
    try {
      const organizationId = parseInt(req.params.organizationId);
      const { analysisType, moduleType } = req.query;
      
      const analyses = await storage.getAIAnalyses(
        organizationId, 
        analysisType as string, 
        moduleType as string
      );
      
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching AI analyses:", error);
      res.status(500).json({ 
        message: "Failed to fetch AI analyses" 
      });
    }
  });
}