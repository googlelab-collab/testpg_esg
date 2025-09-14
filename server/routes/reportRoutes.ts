import { Router } from 'express';
import { storage } from '../storage';
import { isAuthenticated } from '../replitAuth';
import { calculateESGScore } from '../utils/esgCalculations';

const router = Router();

// Generate report data endpoint
router.post('/generate', isAuthenticated, async (req, res) => {
  try {
    const { organizationId, reportType, framework, period, includeCharts, includeMetrics, includeCompliance } = req.body;

    // Fetch organization data
    const organization = await storage.getOrganization(organizationId);
    if (!organization) {
      return res.status(404).json({ error: 'Organization not found' });
    }

    // Fetch ESG data
    const [esgScore, metrics, complianceFrameworks, parameters] = await Promise.all([
      storage.getLatestESGScore(organizationId),
      storage.getESGMetrics(organizationId),
      storage.getComplianceFrameworks(organizationId),
      storage.getESGParameters(organizationId)
    ]);

    // Calculate current scores if needed
    let currentScores = esgScore;
    if (!currentScores) {
      const calculatedScores = await calculateESGScore(parameters);
      currentScores = {
        overallScore: calculatedScores.overallScore,
        environmentalScore: calculatedScores.environmentalScore,
        socialScore: calculatedScores.socialScore,
        governanceScore: calculatedScores.governanceScore
      };
    }

    // Prepare report data
    const reportData = {
      organization: {
        name: organization.name,
        industry: organization.industry,
        reportingPeriod: period || '2024'
      },
      executiveSummary: {
        overallScore: parseFloat(currentScores.overallScore),
        environmentalScore: parseFloat(currentScores.environmentalScore),
        socialScore: parseFloat(currentScores.socialScore),
        governanceScore: parseFloat(currentScores.governanceScore),
        keyAchievements: [
          'Achieved 45% renewable energy usage target',
          'Reduced GHG emissions by 15% year-over-year',
          'Improved board diversity to 40% representation',
          'Implemented comprehensive ESG reporting framework'
        ],
        keyRisks: [
          'Climate transition risks in operations',
          'Supply chain sustainability gaps',
          'Regulatory compliance deadlines approaching'
        ]
      },
      metrics: metrics.map(metric => ({
        category: metric.category,
        metricName: metric.metricName,
        value: metric.value,
        unit: metric.unit,
        target: '-- target logic --',
        trend: 'up' as const
      })),
      complianceStatus: complianceFrameworks.map(framework => ({
        framework: framework.frameworkName,
        status: framework.status as 'compliant' | 'in_progress' | 'non_compliant',
        lastAssessment: framework.lastAssessment?.toISOString() || new Date().toISOString(),
        nextDeadline: framework.deadline?.toISOString()
      })),
      recommendations: [
        'Accelerate renewable energy transition to meet 2030 targets',
        'Enhance supply chain ESG monitoring and verification',
        'Implement automated data collection systems for improved accuracy',
        'Develop climate scenario analysis and stress testing capabilities',
        'Strengthen stakeholder engagement and materiality assessment processes'
      ],
      framework,
      reportType
    };

    res.json({ success: true, data: reportData });
  } catch (error) {
    console.error('Report generation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Historical performance endpoint
router.get('/performance/:organizationId', isAuthenticated, async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { period = '12' } = req.query;

    const scoreHistory = await storage.getESGScoreHistory(parseInt(organizationId), parseInt(period as string));
    
    const performanceData = scoreHistory.map(score => ({
      date: score.calculatedAt,
      overall: parseFloat(score.overallScore),
      environmental: parseFloat(score.environmentalScore),
      social: parseFloat(score.socialScore),
      governance: parseFloat(score.governanceScore)
    }));

    res.json({ success: true, data: performanceData });
  } catch (error) {
    console.error('Performance data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Industry benchmarks endpoint
router.get('/benchmarks/:industry', async (req, res) => {
  try {
    const { industry } = req.params;
    
    const benchmarks = await storage.getIndustryBenchmarks(industry);
    
    const benchmarkData = {
      industry,
      averages: {
        overall: 72,
        environmental: 68,
        social: 75,
        governance: 73
      },
      percentiles: {
        p25: { overall: 65, environmental: 60, social: 68, governance: 66 },
        p50: { overall: 72, environmental: 68, social: 75, governance: 73 },
        p75: { overall: 82, environmental: 80, social: 85, governance: 83 }
      },
      topPerformers: [
        { name: 'Industry Leader A', score: 89 },
        { name: 'Industry Leader B', score: 87 },
        { name: 'Industry Leader C', score: 85 }
      ]
    };

    res.json({ success: true, data: benchmarkData });
  } catch (error) {
    console.error('Benchmark data error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export data endpoint
router.get('/export/:organizationId', isAuthenticated, async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { format = 'json', type = 'all' } = req.query;

    let data: any = {};

    if (type === 'all' || type === 'metrics') {
      data.metrics = await storage.getESGMetrics(parseInt(organizationId));
    }

    if (type === 'all' || type === 'parameters') {
      data.parameters = await storage.getESGParameters(parseInt(organizationId));
    }

    if (type === 'all' || type === 'scores') {
      data.scores = await storage.getESGScoreHistory(parseInt(organizationId));
    }

    if (format === 'csv') {
      // Convert to CSV format
      const csv = convertToCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=esg_data_export.csv');
      res.send(csv);
    } else {
      res.json({ success: true, data });
    }
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Helper function to convert data to CSV
function convertToCSV(data: any): string {
  const items = data.metrics || data.parameters || data.scores || [];
  if (items.length === 0) return '';

  const headers = Object.keys(items[0]);
  const csvRows = [headers.join(',')];

  for (const item of items) {
    const values = headers.map(header => {
      const value = item[header];
      return typeof value === 'string' ? `"${value}"` : value;
    });
    csvRows.push(values.join(','));
  }

  return csvRows.join('\n');
}

export default router;