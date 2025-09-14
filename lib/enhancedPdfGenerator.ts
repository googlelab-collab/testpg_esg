import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface EnhancedReportConfig {
  title: string;
  organizationName: string;
  reportingPeriod: string;
  framework: string;
  moduleType: 'environmental' | 'social' | 'governance' | 'datacenter';
  includeCharts: boolean;
  includeMetrics: boolean;
  includeCompliance: boolean;
  includeAIInsights: boolean;
  includeBenchmarks: boolean;
  includeActionPlan: boolean;
}

export interface DetailedESGData {
  executiveSummary: {
    overallScore: number;
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    keyAchievements: string[];
    keyRisks: string[];
    performanceTrend: 'improving' | 'stable' | 'declining';
    industryRanking?: string;
  };
  
  // Detailed metrics with trends and benchmarks
  detailedMetrics: {
    category: string;
    subCategory: string;
    metricName: string;
    currentValue: string;
    previousValue?: string;
    targetValue?: string;
    unit: string;
    trend: 'up' | 'down' | 'stable';
    trendPercentage?: number;
    benchmarkData?: {
      industryAverage: number;
      topQuartile: number;
      ranking: string;
    };
    source: string;
    lastUpdated: string;
  }[];
  
  // AI-generated insights
  aiInsights?: {
    keyInsights: string[];
    recommendations: string[];
    risks: string[];
    opportunities: string[];
    confidence: number;
  };
  
  // Data center specific metrics
  dataCenterMetrics?: {
    pue: number;
    wue: number;
    cue: number;
    renewableEnergyPercentage: number;
    carbonIntensity: number;
    coolingEfficiency: number;
    aiWorkloadPercentage: number;
    uptime: number;
    facilityCount: number;
    totalCapacity: number;
  };
  
  complianceStatus: {
    framework: string;
    status: 'compliant' | 'in_progress' | 'non_compliant';
    score?: number;
    lastAssessment: string;
    nextDeadline?: string;
    requirements: {
      requirement: string;
      status: 'met' | 'partial' | 'not_met';
      details: string;
    }[];
  }[];
  
  // Strategic action plan
  actionPlan?: {
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
    description: string;
    expectedImpact: string;
    resources: string;
    owner: string;
    kpis: string[];
  }[];
  
  // Industry benchmarks
  benchmarks?: {
    metric: string;
    value: number;
    industryAverage: number;
    topPerformers: number;
    ranking: string;
    source: string;
  }[];
  
  recommendations: string[];
}

class EnhancedESGPDFGenerator {
  private pdf: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number;
  private currentY: number;
  private pageNumber: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.margin = 20;
    this.currentY = this.margin;
    this.pageNumber = 1;
  }

  async generateEnhancedReport(config: EnhancedReportConfig, data: DetailedESGData): Promise<Blob> {
    this.currentY = this.margin;
    this.pageNumber = 1;
    
    // Cover page with enhanced design
    this.addEnhancedCoverPage(config, data);
    
    // Executive summary with charts
    this.addNewPage();
    this.addEnhancedExecutiveSummary(data.executiveSummary, config.moduleType);
    
    // AI insights section (if available)
    if (config.includeAIInsights && data.aiInsights) {
      this.addNewPage();
      this.addAIInsightsSection(data.aiInsights);
    }
    
    // Data center specific section
    if (config.moduleType === 'datacenter' && data.dataCenterMetrics) {
      this.addNewPage();
      this.addDataCenterSection(data.dataCenterMetrics);
    }
    
    // Detailed metrics with benchmarks
    if (config.includeMetrics) {
      this.addNewPage();
      this.addDetailedMetricsSection(data.detailedMetrics, config.includeBenchmarks ? data.benchmarks : undefined);
    }
    
    // Compliance deep dive
    if (config.includeCompliance) {
      this.addNewPage();
      this.addDetailedComplianceSection(data.complianceStatus);
    }
    
    // Industry benchmarks
    if (config.includeBenchmarks && data.benchmarks) {
      this.addNewPage();
      this.addBenchmarkSection(data.benchmarks);
    }
    
    // Strategic action plan
    if (config.includeActionPlan && data.actionPlan) {
      this.addNewPage();
      this.addActionPlanSection(data.actionPlan);
    }
    
    // Methodology and appendices
    this.addNewPage();
    this.addMethodologySection(config.framework, config.moduleType);
    
    // Footer and page numbers
    this.addPageNumbersAndFooters(config.organizationName);
    
    return this.pdf.output('blob');
  }

  private addEnhancedCoverPage(config: EnhancedReportConfig, data: DetailedESGData) {
    // Enhanced header with gradient effect simulation
    this.pdf.setFillColor(46, 125, 50);
    this.pdf.rect(0, 0, this.pageWidth, 80, 'F');
    
    // Company logo placeholder
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(this.margin, 15, 40, 40, 'F');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text('ESGuite', this.margin + 8, 38);
    
    // Enhanced title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(32);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(config.title, this.margin + 50, 35);
    
    // Subtitle with module type
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${this.capitalizeFirst(config.moduleType)} ESG Analytics`, this.margin + 50, 50);
    this.pdf.text(`${config.framework} Framework Compliance`, this.margin + 50, 65);
    
    // Organization details with enhanced styling
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(24);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(config.organizationName, this.margin, 105);
    
    // Performance summary box
    this.pdf.setFillColor(240, 248, 255);
    this.pdf.rect(this.margin, 125, this.pageWidth - 2 * this.margin, 45, 'F');
    this.pdf.setDrawColor(70, 130, 180);
    this.pdf.rect(this.margin, 125, this.pageWidth - 2 * this.margin, 45, 'S');
    
    // ESG scores in summary box
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(70, 130, 180);
    this.pdf.text('ESG Performance Summary', this.margin + 5, 135);
    
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.text(`Overall Score: ${data.executiveSummary.overallScore}/100`, this.margin + 5, 145);
    this.pdf.text(`Environmental: ${data.executiveSummary.environmentalScore}/100`, this.margin + 5, 155);
    this.pdf.text(`Social: ${data.executiveSummary.socialScore}/100`, this.margin + 80, 145);
    this.pdf.text(`Governance: ${data.executiveSummary.governanceScore}/100`, this.margin + 80, 155);
    
    // Performance trend indicator
    const trendText = data.executiveSummary.performanceTrend === 'improving' ? '↗ Improving' : 
                     data.executiveSummary.performanceTrend === 'stable' ? '→ Stable' : '↘ Declining';
    const trendColor = data.executiveSummary.performanceTrend === 'improving' ? [34, 139, 34] : 
                      data.executiveSummary.performanceTrend === 'stable' ? [255, 165, 0] : [220, 20, 60];
    
    this.pdf.setTextColor(...trendColor);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`Trend: ${trendText}`, this.margin + 5, 165);
    
    // Report metadata
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Reporting Period: ${config.reportingPeriod}`, this.margin, 190);
    this.pdf.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    })}`, this.margin, 200);
    this.pdf.text(`Framework: ${config.framework}`, this.margin, 210);
    
    if (data.executiveSummary.industryRanking) {
      this.pdf.text(`Industry Ranking: ${data.executiveSummary.industryRanking}`, this.margin, 220);
    }
    
    // Confidentiality notice
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'italic');
    this.pdf.setTextColor(128, 128, 128);
    this.pdf.text('CONFIDENTIAL - This report contains proprietary ESG performance data', this.margin, this.pageHeight - 25);
    this.pdf.text('Distribution restricted to authorized personnel only', this.margin, this.pageHeight - 15);
  }

  private addEnhancedExecutiveSummary(summary: DetailedESGData['executiveSummary'], moduleType: string) {
    this.addSectionHeader('Executive Summary', true);
    
    // Performance overview
    this.addSubsectionHeader('Performance Overview');
    this.addParagraph(`This ${moduleType} ESG report presents a comprehensive analysis of sustainability performance with an overall ESG score of ${summary.overallScore}/100. The organization demonstrates ${summary.performanceTrend} performance trends across key sustainability metrics.`);
    
    // Score breakdown with visual indicators
    this.addSubsectionHeader('ESG Score Breakdown');
    this.currentY += 5;
    
    const scores = [
      { label: 'Environmental', score: summary.environmentalScore, color: [34, 139, 34] },
      { label: 'Social', score: summary.socialScore, color: [70, 130, 180] },
      { label: 'Governance', score: summary.governanceScore, color: [255, 140, 0] }
    ];
    
    scores.forEach((item, index) => {
      const x = this.margin + (index * 60);
      
      // Score circle
      this.pdf.setFillColor(...item.color);
      this.pdf.circle(x + 20, this.currentY + 10, 8, 'F');
      
      // Score text
      this.pdf.setTextColor(255, 255, 255);
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(item.score.toString(), x + 16, this.currentY + 12);
      
      // Label
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.setFontSize(10);
      this.pdf.text(item.label, x + 5, this.currentY + 25);
    });
    
    this.currentY += 35;
    
    // Key achievements
    this.addSubsectionHeader('Key Achievements');
    summary.keyAchievements.forEach((achievement, index) => {
      this.addBulletPoint(`${achievement}`, '✓');
    });
    
    // Key risks
    this.addSubsectionHeader('Key Risks & Challenges');
    summary.keyRisks.forEach((risk, index) => {
      this.addBulletPoint(`${risk}`, '⚠');
    });
    
    // Industry ranking if available
    if (summary.industryRanking) {
      this.addSubsectionHeader('Industry Position');
      this.addParagraph(`Current industry ranking: ${summary.industryRanking}. This positioning reflects the organization's relative performance compared to industry peers across key ESG metrics.`);
    }
  }

  private addAIInsightsSection(insights: DetailedESGData['aiInsights']) {
    if (!insights) return;
    
    this.addSectionHeader('AI-Powered ESG Analysis', true);
    
    // Confidence indicator
    this.pdf.setFontSize(10);
    this.pdf.setTextColor(128, 128, 128);
    this.pdf.text(`Analysis Confidence: ${insights.confidence}%`, this.pageWidth - this.margin - 40, this.currentY - 15);
    
    // Key insights
    this.addSubsectionHeader('Strategic Insights');
    insights.keyInsights.forEach(insight => {
      this.addBulletPoint(insight, '💡');
    });
    
    // AI recommendations
    this.addSubsectionHeader('AI Recommendations');
    insights.recommendations.forEach(recommendation => {
      this.addBulletPoint(recommendation, '🎯');
    });
    
    // Risk assessment
    this.addSubsectionHeader('Risk Analysis');
    insights.risks.forEach(risk => {
      this.addBulletPoint(risk, '⚠️');
    });
    
    // Opportunities
    this.addSubsectionHeader('Growth Opportunities');
    insights.opportunities.forEach(opportunity => {
      this.addBulletPoint(opportunity, '🚀');
    });
  }

  private addDataCenterSection(metrics: DetailedESGData['dataCenterMetrics']) {
    if (!metrics) return;
    
    this.addSectionHeader('Data Center Sustainability Metrics', true);
    
    // Core efficiency metrics
    this.addSubsectionHeader('Core Efficiency Metrics');
    
    const efficiencyMetrics = [
      { label: 'Power Usage Effectiveness (PUE)', value: metrics.pue, target: 1.2, unit: '', benchmark: 'Industry avg: 1.4' },
      { label: 'Water Usage Effectiveness (WUE)', value: metrics.wue, target: 0.5, unit: 'L/kWh', benchmark: 'Meta: 0.20' },
      { label: 'Carbon Usage Effectiveness (CUE)', value: metrics.cue, target: 0.3, unit: 'tCO2e/MWh', benchmark: 'Target: <0.5' },
      { label: 'Renewable Energy Share', value: metrics.renewableEnergyPercentage, target: 100, unit: '%', benchmark: 'Google: 100%' }
    ];
    
    // Create metrics table
    const tableData = efficiencyMetrics.map(metric => [
      metric.label,
      `${metric.value}${metric.unit}`,
      `${metric.target}${metric.unit}`,
      metric.benchmark
    ]);
    
    (this.pdf as any).autoTable({
      head: [['Metric', 'Current', 'Target', 'Benchmark']],
      body: tableData,
      startY: this.currentY,
      margin: { left: this.margin },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [70, 130, 180] }
    });
    
    this.currentY = (this.pdf as any).lastAutoTable.finalY + 10;
    
    // Operational metrics
    this.addSubsectionHeader('Operational Performance');
    this.addParagraph(`The data center infrastructure demonstrates ${metrics.uptime}% uptime across ${metrics.facilityCount} facilities with total capacity of ${metrics.totalCapacity}MW. AI workloads represent ${metrics.aiWorkloadPercentage}% of total compute, requiring enhanced cooling efficiency.`);
    
    // Carbon intensity analysis
    this.addSubsectionHeader('Carbon Performance');
    this.addParagraph(`Current carbon intensity: ${metrics.carbonIntensity} gCO2e/kWh. This represents significant progress toward industry leading performance (target: <300 gCO2e/kWh for renewable-powered facilities).`);
  }

  private addDetailedMetricsSection(metrics: DetailedESGData['detailedMetrics'], benchmarks?: DetailedESGData['benchmarks']) {
    this.addSectionHeader('Detailed Performance Metrics', true);
    
    // Group metrics by category
    const groupedMetrics = metrics.reduce((acc, metric) => {
      if (!acc[metric.category]) acc[metric.category] = [];
      acc[metric.category].push(metric);
      return acc;
    }, {} as Record<string, typeof metrics>);
    
    Object.entries(groupedMetrics).forEach(([category, categoryMetrics]) => {
      this.addSubsectionHeader(`${this.capitalizeFirst(category)} Metrics`);
      
      // Create detailed metrics table
      const tableData = categoryMetrics.map(metric => {
        const trend = metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→';
        const trendText = metric.trendPercentage ? 
          `${trend} ${metric.trendPercentage}%` : trend;
        
        return [
          metric.metricName,
          `${metric.currentValue} ${metric.unit}`,
          metric.targetValue ? `${metric.targetValue} ${metric.unit}` : 'N/A',
          trendText,
          metric.benchmarkData?.ranking || 'N/A',
          new Date(metric.lastUpdated).toLocaleDateString()
        ];
      });
      
      (this.pdf as any).autoTable({
        head: [['Metric', 'Current', 'Target', 'Trend', 'Ranking', 'Updated']],
        body: tableData,
        startY: this.currentY,
        margin: { left: this.margin },
        styles: { fontSize: 9 },
        headStyles: { fillColor: [46, 125, 50] },
        columnStyles: {
          0: { cellWidth: 45 },
          1: { cellWidth: 25 },
          2: { cellWidth: 25 },
          3: { cellWidth: 20 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 }
        }
      });
      
      this.currentY = (this.pdf as any).lastAutoTable.finalY + 10;
      
      if (this.currentY > this.pageHeight - 40) {
        this.addNewPage();
      }
    });
  }

  private addDetailedComplianceSection(complianceData: DetailedESGData['complianceStatus']) {
    this.addSectionHeader('Regulatory Compliance Analysis', true);
    
    complianceData.forEach(framework => {
      this.addSubsectionHeader(`${framework.framework} Compliance`);
      
      // Status indicator
      const statusColor = framework.status === 'compliant' ? [34, 139, 34] : 
                         framework.status === 'in_progress' ? [255, 165, 0] : [220, 20, 60];
      
      this.pdf.setTextColor(...statusColor);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.text(`Status: ${framework.status.toUpperCase()}`, this.margin, this.currentY);
      
      if (framework.score) {
        this.pdf.text(`Score: ${framework.score}/100`, this.margin + 80, this.currentY);
      }
      
      this.pdf.setTextColor(0, 0, 0);
      this.pdf.setFont('helvetica', 'normal');
      this.currentY += 10;
      
      // Requirements table
      if (framework.requirements && framework.requirements.length > 0) {
        const reqData = framework.requirements.map(req => [
          req.requirement,
          req.status === 'met' ? '✓' : req.status === 'partial' ? '◐' : '✗',
          req.details
        ]);
        
        (this.pdf as any).autoTable({
          head: [['Requirement', 'Status', 'Details']],
          body: reqData,
          startY: this.currentY,
          margin: { left: this.margin },
          styles: { fontSize: 9 },
          headStyles: { fillColor: [70, 130, 180] },
          columnStyles: {
            0: { cellWidth: 60 },
            1: { cellWidth: 20 },
            2: { cellWidth: 85 }
          }
        });
        
        this.currentY = (this.pdf as any).lastAutoTable.finalY + 15;
      }
      
      if (this.currentY > this.pageHeight - 60) {
        this.addNewPage();
      }
    });
  }

  private addActionPlanSection(actionPlan: DetailedESGData['actionPlan']) {
    if (!actionPlan) return;
    
    this.addSectionHeader('Strategic Action Plan', true);
    
    // Group by priority
    const priorities = ['high', 'medium', 'low'] as const;
    
    priorities.forEach(priority => {
      const priorityActions = actionPlan.filter(action => action.priority === priority);
      if (priorityActions.length === 0) return;
      
      this.addSubsectionHeader(`${this.capitalizeFirst(priority)} Priority Actions`);
      
      priorityActions.forEach((action, index) => {
        // Action header
        this.pdf.setFont('helvetica', 'bold');
        this.pdf.text(`${index + 1}. ${action.description}`, this.margin, this.currentY);
        this.currentY += 8;
        
        // Action details
        this.pdf.setFont('helvetica', 'normal');
        this.pdf.setFontSize(10);
        this.addParagraph(`Timeframe: ${action.timeframe}`);
        this.addParagraph(`Expected Impact: ${action.expectedImpact}`);
        this.addParagraph(`Resources Required: ${action.resources}`);
        this.addParagraph(`Owner: ${action.owner}`);
        
        if (action.kpis && action.kpis.length > 0) {
          this.addParagraph(`KPIs: ${action.kpis.join(', ')}`);
        }
        
        this.currentY += 5;
        this.pdf.setFontSize(12);
        
        if (this.currentY > this.pageHeight - 50) {
          this.addNewPage();
        }
      });
    });
  }

  private addMethodologySection(framework: string, moduleType: string) {
    this.addSectionHeader('Methodology & Framework', true);
    
    this.addSubsectionHeader(`${framework} Framework Application`);
    
    const methodologyText = this.getFrameworkMethodology(framework, moduleType);
    this.addParagraph(methodologyText);
    
    this.addSubsectionHeader('Data Sources & Verification');
    this.addParagraph('All metrics are sourced from verified organizational data systems with third-party validation where applicable. Data quality assurance follows ISO 14064 standards for greenhouse gas reporting and GRI Standards for sustainability disclosure.');
    
    this.addSubsectionHeader('Calculation Methods');
    this.addParagraph('ESG scores utilize MSCI-style weighted methodology with Environmental (40%), Social (30%), and Governance (30%) components. Industry benchmarking leverages CDP, SASB, and regulatory databases for peer comparison analysis.');
  }

  private getFrameworkMethodology(framework: string, moduleType: string): string {
    const methodologies = {
      'GRI': `This report follows Global Reporting Initiative (GRI) Standards, providing comprehensive disclosure on environmental, social, and governance impacts. The ${moduleType} focus ensures sector-specific indicators align with stakeholder expectations and materiality assessments.`,
      'SASB': `Sustainability Accounting Standards Board (SASB) framework application emphasizes financially material ESG factors for industry-specific performance measurement. Metrics selection reflects sector-specific sustainability risks and opportunities.`,
      'TCFD': `Task Force on Climate-related Financial Disclosures (TCFD) framework guides climate risk assessment and scenario analysis. Governance, strategy, risk management, and metrics disclosure support investor decision-making.`,
      'EU-CSRD': `European Corporate Sustainability Reporting Directive (CSRD) compliance ensures comprehensive sustainability reporting meeting EU taxonomy requirements and double materiality assessment principles.`,
      'SEC': `Securities and Exchange Commission climate disclosure rules application provides investor-focused climate risk and GHG emissions reporting aligned with federal requirements.`,
      'ISSB': `International Sustainability Standards Board (ISSB) framework delivers global baseline for sustainability-related financial disclosures, ensuring consistency and comparability across markets.`
    };
    
    return methodologies[framework as keyof typeof methodologies] || 
           `This report applies ${framework} framework standards for comprehensive ESG performance assessment and disclosure.`;
  }

  // Utility methods
  private addSectionHeader(title: string, newPage: boolean = false) {
    if (newPage && this.currentY > this.margin) {
      this.addNewPage();
    }
    
    this.pdf.setFillColor(46, 125, 50);
    this.pdf.rect(this.margin, this.currentY - 2, this.pageWidth - 2 * this.margin, 12, 'F');
    
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin + 3, this.currentY + 6);
    
    this.currentY += 20;
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
  }

  private addSubsectionHeader(title: string) {
    this.currentY += 5;
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(70, 130, 180);
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 10;
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'normal');
  }

  private addParagraph(text: string) {
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    lines.forEach((line: string) => {
      if (this.currentY > this.pageHeight - 30) {
        this.addNewPage();
      }
      this.pdf.text(line, this.margin, this.currentY);
      this.currentY += 6;
    });
    this.currentY += 3;
  }

  private addBulletPoint(text: string, bullet: string = '•') {
    if (this.currentY > this.pageHeight - 30) {
      this.addNewPage();
    }
    
    this.pdf.text(bullet, this.margin, this.currentY);
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin - 10);
    lines.forEach((line: string, index: number) => {
      this.pdf.text(line, this.margin + 8, this.currentY + (index * 6));
    });
    this.currentY += (lines.length * 6) + 2;
  }

  private addNewPage() {
    this.pdf.addPage();
    this.currentY = this.margin;
    this.pageNumber++;
  }

  private addPageNumbersAndFooters(organizationName: string) {
    const totalPages = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      
      // Page number
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(128, 128, 128);
      this.pdf.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin - 20, this.pageHeight - 10);
      
      // Footer
      this.pdf.text(`${organizationName} ESG Report`, this.margin, this.pageHeight - 10);
      this.pdf.text(`Generated: ${new Date().toLocaleDateString()}`, this.pageWidth / 2 - 20, this.pageHeight - 10);
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

export async function generateEnhancedESGReport(config: EnhancedReportConfig, data: DetailedESGData): Promise<Blob> {
  const generator = new EnhancedESGPDFGenerator();
  return await generator.generateEnhancedReport(config, data);
}