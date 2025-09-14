import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ReportConfig {
  title: string;
  organizationName: string;
  reportingPeriod: string;
  framework: 'GRI' | 'SASB' | 'TCFD' | 'EU-CSRD' | 'SEC' | 'ISSB' | 'ISO 50001' | 'ENERGY STAR' | 'Corporate Governance Principles' | 'NIST Cybersecurity Framework' | 'UN Global Compact' | 'Say-on-Pay Guidelines' | 'Multi-Framework Compliance' | 'COSO ERM Framework' | 'AA1000 Stakeholder Engagement' | string;
  includeCharts: boolean;
  includeMetrics: boolean;
  includeCompliance: boolean;
}

export interface ESGReportData {
  executiveSummary: {
    overallScore: number;
    environmentalScore: number;
    socialScore: number;
    governanceScore: number;
    keyAchievements: string[];
    keyRisks: string[];
  };
  metrics: {
    category: string;
    metricName: string;
    value: string;
    unit: string;
    target?: string;
    trend: 'up' | 'down' | 'stable';
  }[];
  complianceStatus: {
    framework: string;
    status: 'compliant' | 'in_progress' | 'non_compliant';
    lastAssessment: string;
    nextDeadline?: string;
  }[];
  recommendations: string[];
}

class ESGPDFGenerator {
  private pdf: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private margin: number;
  private currentY: number;

  constructor() {
    this.pdf = new jsPDF('p', 'mm', 'a4');
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.margin = 20;
    this.currentY = this.margin;
  }

  async generateReport(config: ReportConfig, data: ESGReportData): Promise<Blob> {
    // Reset for new report
    this.currentY = this.margin;
    
    // Cover page
    this.addCoverPage(config);
    
    // Table of contents
    this.addNewPage();
    this.addTableOfContents(config);
    
    // Executive summary
    this.addNewPage();
    this.addExecutiveSummary(data.executiveSummary);
    
    // Framework methodology
    this.addNewPage();
    this.addFrameworkMethodology(config.framework);
    
    // ESG Metrics
    if (config.includeMetrics) {
      this.addNewPage();
      this.addESGMetrics(data.metrics);
    }
    
    // Compliance Status
    if (config.includeCompliance) {
      this.addNewPage();
      this.addComplianceStatus(data.complianceStatus);
    }
    
    // Recommendations
    this.addNewPage();
    this.addRecommendations(data.recommendations);
    
    // Appendices
    this.addNewPage();
    this.addAppendices(config);
    
    // Add page numbers and footers
    this.addPageNumbers();
    
    return this.pdf.output('blob');
  }

  private addCoverPage(config: ReportConfig) {
    // Header background
    this.pdf.setFillColor(46, 125, 50);
    this.pdf.rect(0, 0, this.pageWidth, 60, 'F');
    
    // Company logo area (placeholder)
    this.pdf.setFillColor(255, 255, 255);
    this.pdf.rect(this.margin, 15, 30, 30, 'F');
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(10);
    this.pdf.text('LOGO', this.margin + 12, 32);
    
    // Title
    this.pdf.setTextColor(255, 255, 255);
    this.pdf.setFontSize(28);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(config.title, this.margin + 40, 35);
    
    // Subtitle
    this.pdf.setFontSize(16);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`${config.framework} Framework Report`, this.margin + 40, 50);
    
    // Organization details
    this.pdf.setTextColor(0, 0, 0);
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(config.organizationName, this.margin, 90);
    
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(`Reporting Period: ${config.reportingPeriod}`, this.margin, 105);
    this.pdf.text(`Generated: ${new Date().toLocaleDateString()}`, this.margin, 120);
    
    // Framework badge
    this.pdf.setFillColor(230, 230, 230);
    this.pdf.roundedRect(this.margin, 140, 60, 25, 3, 3, 'F');
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(`${config.framework} COMPLIANT`, this.margin + 8, 155);
    
    // Disclaimer
    this.pdf.setFontSize(10);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('This report contains confidential and proprietary information.', this.margin, this.pageHeight - 40);
    this.pdf.text('Distribution is restricted to authorized personnel only.', this.margin, this.pageHeight - 30);
  }

  private addTableOfContents(config: ReportConfig) {
    this.addSectionHeader('Table of Contents');
    
    const contents = [
      { title: 'Executive Summary', page: 3 },
      { title: `${config.framework} Methodology`, page: 4 },
    ];
    
    if (config.includeMetrics) {
      contents.push({ title: 'ESG Metrics & Performance', page: 5 });
    }
    
    if (config.includeCompliance) {
      contents.push({ title: 'Compliance Status', page: 6 });
    }
    
    contents.push(
      { title: 'Recommendations & Action Items', page: 7 },
      { title: 'Appendices', page: 8 }
    );
    
    this.currentY += 10;
    
    contents.forEach((item) => {
      this.pdf.setFontSize(12);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.text(item.title, this.margin, this.currentY);
      
      // Dotted line
      const dots = '.'.repeat(50);
      this.pdf.setFontSize(8);
      this.pdf.text(dots, this.margin + 80, this.currentY);
      
      // Page number
      this.pdf.setFontSize(12);
      this.pdf.text(item.page.toString(), this.pageWidth - this.margin - 10, this.currentY);
      
      this.currentY += 8;
    });
  }

  private addExecutiveSummary(summary: ESGReportData['executiveSummary']) {
    this.addSectionHeader('Executive Summary');
    
    // Overall performance
    this.addSubsectionHeader('Overall ESG Performance');
    this.addText(`Overall ESG Score: ${summary.overallScore}/100`, 12, 'bold');
    this.currentY += 5;
    
    // Score breakdown
    const scoreData = [
      ['Category', 'Score', 'Performance'],
      ['Environmental', summary.environmentalScore.toString(), this.getPerformanceLabel(summary.environmentalScore)],
      ['Social', summary.socialScore.toString(), this.getPerformanceLabel(summary.socialScore)],
      ['Governance', summary.governanceScore.toString(), this.getPerformanceLabel(summary.governanceScore)]
    ];
    
    (this.pdf as any).autoTable({
      startY: this.currentY,
      head: [scoreData[0]],
      body: scoreData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50] },
      margin: { left: this.margin, right: this.margin }
    });
    
    this.currentY = (this.pdf as any).lastAutoTable.finalY + 15;
    
    // Key achievements
    this.addSubsectionHeader('Key Achievements');
    summary.keyAchievements.forEach((achievement, index) => {
      this.addBulletPoint(`${achievement}`);
    });
    
    this.currentY += 10;
    
    // Key risks
    this.addSubsectionHeader('Key Risk Areas');
    summary.keyRisks.forEach((risk, index) => {
      this.addBulletPoint(`${risk}`);
    });
  }

  private addFrameworkMethodology(framework: string) {
    this.addSectionHeader(`${framework} Framework Methodology`);
    
    const methodologies = {
      'GRI': {
        description: 'Global Reporting Initiative (GRI) Standards provide a comprehensive framework for sustainability reporting.',
        principles: [
          'Stakeholder Inclusiveness: Engaging with stakeholders to understand their concerns',
          'Sustainability Context: Presenting performance in the context of sustainability',
          'Materiality: Covering topics that reflect significant economic, environmental, and social impacts',
          'Completeness: Including all material topics and their boundaries'
        ],
        standards: ['GRI 2: General Disclosures', 'GRI 3: Material Topics', 'GRI 11: Oil and Gas Sector']
      },
      'SASB': {
        description: 'Sustainability Accounting Standards Board (SASB) focuses on financially material sustainability information.',
        principles: [
          'Financial Materiality: Focus on sustainability factors likely to impact financial condition',
          'Industry-Specific: Standards tailored to industry-specific sustainability risks and opportunities',
          'Decision-Useful: Information that is useful for investment and credit decisions',
          'Cost-Effective: Balance between benefits of disclosure and costs of preparation'
        ],
        standards: ['Materiality Map', 'Industry Standards', 'Implementation Guidance']
      },
      'TCFD': {
        description: 'Task Force on Climate-related Financial Disclosures (TCFD) recommendations for climate risk disclosure.',
        principles: [
          'Governance: Climate-related governance structures and oversight',
          'Strategy: Climate-related risks and opportunities impact on strategy',
          'Risk Management: Climate risk identification, assessment, and management processes',
          'Metrics and Targets: Climate-related metrics and targets used to manage risks'
        ],
        standards: ['Governance Disclosures', 'Strategy Disclosures', 'Risk Management Disclosures', 'Metrics and Targets']
      },
      'EU-CSRD': {
        description: 'EU Corporate Sustainability Reporting Directive (CSRD) mandates comprehensive sustainability reporting.',
        principles: [
          'Double Materiality: Impact materiality and financial materiality perspectives',
          'Value Chain Coverage: Upstream and downstream value chain impacts',
          'Forward-Looking: Prospective information and scenario analysis',
          'Stakeholder Engagement: Systematic stakeholder consultation processes'
        ],
        standards: ['ESRS E1-E5: Environmental', 'ESRS S1-S4: Social', 'ESRS G1-G2: Governance']
      },
      'SEC': {
        description: 'U.S. Securities and Exchange Commission (SEC) climate disclosure rules for public companies.',
        principles: [
          'Material Information: Climate-related information material to investors',
          'Consistency: Consistent disclosure across reporting periods',
          'Comparability: Comparable information across companies',
          'Reliability: Reliable and verifiable climate-related data'
        ],
        standards: ['Climate Risk Governance', 'Climate Risk Strategy', 'Climate Risk Management', 'Climate Metrics']
      },
      'ISSB': {
        description: 'International Sustainability Standards Board (ISSB) global baseline for sustainability disclosures.',
        principles: [
          'Global Consistency: Globally consistent sustainability disclosure standards',
          'Interoperability: Designed to work with other frameworks and standards',
          'Investor Focus: Primary focus on information needs of investors',
          'Building Blocks: Foundation for more detailed reporting requirements'
        ],
        standards: ['IFRS S1: General Requirements', 'IFRS S2: Climate-related Disclosures']
      }
    };
    
    const methodology = methodologies[framework];
    
    this.addText(methodology.description);
    this.currentY += 10;
    
    this.addSubsectionHeader('Key Principles');
    methodology.principles.forEach(principle => {
      this.addBulletPoint(principle);
    });
    
    this.currentY += 10;
    
    this.addSubsectionHeader('Applied Standards');
    methodology.standards.forEach(standard => {
      this.addBulletPoint(standard);
    });
  }

  private addESGMetrics(metrics: ESGReportData['metrics']) {
    this.addSectionHeader('ESG Metrics & Performance');
    
    // Group metrics by category
    const categories = ['environmental', 'social', 'governance'];
    
    categories.forEach(category => {
      const categoryMetrics = metrics.filter(m => m.category === category);
      if (categoryMetrics.length === 0) return;
      
      this.addSubsectionHeader(this.capitalizeFirst(category) + ' Metrics');
      
      const tableData = [
        ['Metric', 'Current Value', 'Unit', 'Target', 'Trend']
      ];
      
      categoryMetrics.forEach(metric => {
        tableData.push([
          metric.metricName,
          metric.value,
          metric.unit,
          metric.target || 'N/A',
          this.getTrendSymbol(metric.trend)
        ]);
      });
      
      (this.pdf as any).autoTable({
        startY: this.currentY,
        head: [tableData[0]],
        body: tableData.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
        margin: { left: this.margin, right: this.margin }
      });
      
      this.currentY = (this.pdf as any).lastAutoTable.finalY + 15;
      
      if (this.currentY > this.pageHeight - 50) {
        this.addNewPage();
      }
    });
  }

  private addComplianceStatus(complianceStatus: ESGReportData['complianceStatus']) {
    this.addSectionHeader('Regulatory Compliance Status');
    
    const tableData = [
      ['Framework', 'Status', 'Last Assessment', 'Next Deadline']
    ];
    
    complianceStatus.forEach(item => {
      tableData.push([
        item.framework,
        this.capitalizeFirst(item.status.replace('_', ' ')),
        new Date(item.lastAssessment).toLocaleDateString(),
        item.nextDeadline ? new Date(item.nextDeadline).toLocaleDateString() : 'Ongoing'
      ]);
    });
    
    (this.pdf as any).autoTable({
      startY: this.currentY,
      head: [tableData[0]],
      body: tableData.slice(1),
      theme: 'grid',
      headStyles: { fillColor: [46, 125, 50] },
      margin: { left: this.margin, right: this.margin },
      columnStyles: {
        1: { cellWidth: 30 },
        2: { cellWidth: 35 },
        3: { cellWidth: 35 }
      }
    });
    
    this.currentY = (this.pdf as any).lastAutoTable.finalY + 15;
    
    // Compliance summary
    const compliantCount = complianceStatus.filter(item => item.status === 'compliant').length;
    const totalCount = complianceStatus.length;
    const complianceRate = Math.round((compliantCount / totalCount) * 100);
    
    this.addSubsectionHeader('Compliance Summary');
    this.addText(`Overall Compliance Rate: ${complianceRate}% (${compliantCount}/${totalCount} frameworks)`);
    
    if (complianceRate < 100) {
      const nonCompliant = complianceStatus.filter(item => item.status !== 'compliant');
      this.currentY += 5;
      this.addText('Areas requiring attention:', 12, 'bold');
      nonCompliant.forEach(item => {
        this.addBulletPoint(`${item.framework}: ${item.status.replace('_', ' ')}`);
      });
    }
  }

  private addRecommendations(recommendations: string[]) {
    this.addSectionHeader('Recommendations & Action Items');
    
    this.addText('Based on the ESG assessment, the following recommendations are prioritized for implementation:');
    this.currentY += 10;
    
    recommendations.forEach((recommendation, index) => {
      this.addText(`${index + 1}. ${recommendation}`, 12, 'normal');
      this.currentY += 8;
    });
    
    this.currentY += 10;
    
    this.addSubsectionHeader('Implementation Timeline');
    this.addText('• Short-term (0-6 months): Immediate compliance gaps and data quality improvements');
    this.addText('• Medium-term (6-18 months): Process optimization and stakeholder engagement');
    this.addText('• Long-term (18+ months): Strategic initiatives and performance targets');
  }

  private addAppendices(config: ReportConfig) {
    this.addSectionHeader('Appendices');
    
    this.addSubsectionHeader('Appendix A: Methodology Details');
    this.addText(`This report was generated using the ESGuite platform following ${config.framework} standards and guidelines.`);
    this.currentY += 8;
    
    this.addSubsectionHeader('Appendix B: Data Sources');
    this.addText('• Internal management systems and databases');
    this.addText('• Third-party verification services');
    this.addText('• Regulatory filing requirements');
    this.addText('• Industry benchmark databases');
    this.currentY += 8;
    
    this.addSubsectionHeader('Appendix C: Glossary');
    const glossaryTerms = [
      ['ESG', 'Environmental, Social, and Governance factors used to evaluate sustainability'],
      ['GHG', 'Greenhouse Gas emissions measured in CO2 equivalent'],
      ['KPI', 'Key Performance Indicator used to measure progress'],
      ['Materiality', 'The threshold at which ESG issues become important to stakeholders']
    ];
    
    glossaryTerms.forEach(([term, definition]) => {
      this.addText(`${term}: ${definition}`, 10);
      this.currentY += 6;
    });
  }

  // Helper methods
  private addNewPage() {
    this.pdf.addPage();
    this.currentY = this.margin;
  }

  private addSectionHeader(title: string) {
    if (this.currentY > this.pageHeight - 60) {
      this.addNewPage();
    }
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(46, 125, 50);
    this.pdf.text(title, this.margin, this.currentY);
    
    // Underline
    this.pdf.setDrawColor(46, 125, 50);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(this.margin, this.currentY + 2, this.margin + 100, this.currentY + 2);
    
    this.currentY += 15;
    this.pdf.setTextColor(0, 0, 0);
  }

  private addSubsectionHeader(title: string) {
    if (this.currentY > this.pageHeight - 40) {
      this.addNewPage();
    }
    
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.margin, this.currentY);
    this.currentY += 10;
  }

  private addText(text: string, fontSize: number = 11, fontStyle: 'normal' | 'bold' = 'normal') {
    if (this.currentY > this.pageHeight - 30) {
      this.addNewPage();
    }
    
    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontStyle);
    
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin);
    this.pdf.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * 6;
  }

  private addBulletPoint(text: string) {
    if (this.currentY > this.pageHeight - 30) {
      this.addNewPage();
    }
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text('•', this.margin, this.currentY);
    
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - 2 * this.margin - 10);
    this.pdf.text(lines, this.margin + 8, this.currentY);
    this.currentY += lines.length * 6 + 2;
  }

  private addPageNumbers() {
    const totalPages = this.pdf.getNumberOfPages();
    
    for (let i = 1; i <= totalPages; i++) {
      this.pdf.setPage(i);
      this.pdf.setFontSize(10);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(128, 128, 128);
      this.pdf.text(`Page ${i} of ${totalPages}`, this.pageWidth - this.margin - 20, this.pageHeight - 10);
      
      // Footer
      this.pdf.text('ESGuite Platform Report', this.margin, this.pageHeight - 10);
      this.pdf.text(new Date().toLocaleDateString(), this.pageWidth / 2 - 15, this.pageHeight - 10);
    }
  }

  private getPerformanceLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  }

  private getTrendSymbol(trend: 'up' | 'down' | 'stable'): string {
    switch (trend) {
      case 'up': return '↗ Improving';
      case 'down': return '↘ Declining';
      case 'stable': return '→ Stable';
      default: return '→ Stable';
    }
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Simple working PDF generator function
export async function generateESGReport(config: ReportConfig, data: ESGReportData): Promise<Blob> {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Cover Page
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text(config.title, 20, 40);
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'normal');
  pdf.text(config.organizationName, 20, 55);
  pdf.text(`Reporting Period: ${config.reportingPeriod}`, 20, 70);
  pdf.text(`Framework: ${config.framework}`, 20, 85);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, 20, 100);
  
  // Executive Summary on new page
  pdf.addPage();
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Executive Summary', 20, 30);
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  
  // ESG Scores
  let yPos = 50;
  pdf.text(`Overall ESG Score: ${data.executiveSummary.overallScore}/100`, 20, yPos);
  yPos += 10;
  pdf.text(`Environmental Score: ${data.executiveSummary.environmentalScore}/100`, 20, yPos);
  yPos += 10;
  pdf.text(`Social Score: ${data.executiveSummary.socialScore}/100`, 20, yPos);
  yPos += 10;
  pdf.text(`Governance Score: ${data.executiveSummary.governanceScore}/100`, 20, yPos);
  yPos += 20;
  
  // Key Achievements
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Achievements:', 20, yPos);
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  
  data.executiveSummary.keyAchievements.forEach((achievement) => {
    pdf.text(`• ${achievement}`, 25, yPos);
    yPos += 8;
  });
  
  yPos += 10;
  
  // Key Risks
  pdf.setFont('helvetica', 'bold');
  pdf.text('Key Risk Areas:', 20, yPos);
  yPos += 10;
  pdf.setFont('helvetica', 'normal');
  
  data.executiveSummary.keyRisks.forEach((risk) => {
    pdf.text(`• ${risk}`, 25, yPos);
    yPos += 8;
  });
  
  // Metrics section if included
  if (config.includeMetrics && data.metrics.length > 0) {
    pdf.addPage();
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ESG Metrics', 20, 30);
    
    yPos = 50;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    data.metrics.forEach((metric) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      pdf.text(`${metric.metricName}: ${metric.value} ${metric.unit}`, 20, yPos);
      yPos += 8;
    });
  }
  
  // Compliance section if included
  if (config.includeCompliance && data.complianceStatus.length > 0) {
    pdf.addPage();
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Compliance Status', 20, 30);
    
    yPos = 50;
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    
    data.complianceStatus.forEach((compliance) => {
      if (yPos > 250) {
        pdf.addPage();
        yPos = 30;
      }
      
      pdf.text(`${compliance.framework}: ${compliance.status.toUpperCase()}`, 20, yPos);
      yPos += 8;
    });
  }
  
  // Add page numbers
  const totalPages = pdf.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setFontSize(10);
    pdf.text(`Page ${i} of ${totalPages}`, 170, 285);
  }
  
  return pdf.output('blob');
}

export const pdfGenerator = new ESGPDFGenerator();