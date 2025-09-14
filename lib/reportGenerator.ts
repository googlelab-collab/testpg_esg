import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export interface ESGReportData {
  organizationId: number;
  organizationName: string;
  reportType: 'environmental' | 'social' | 'governance' | 'comprehensive';
  module: string;
  period: string;
  data: any;
  metrics: any[];
  scores?: any;
  compliance?: any[];
}

export interface ReportConfig {
  title: string;
  subtitle?: string;
  framework: 'GRI' | 'SASB' | 'TCFD' | 'EU-CSRD' | 'SEC' | 'ISSB';
  includeCharts: boolean;
  includeMetrics: boolean;
  includeCompliance: boolean;
  customSections?: string[];
}

export class ESGReportGenerator {
  private pdf: jsPDF;
  private pageHeight: number;
  private pageWidth: number;
  private currentY: number;
  private leftMargin: number;
  private rightMargin: number;

  constructor() {
    this.pdf = new jsPDF();
    this.pageHeight = this.pdf.internal.pageSize.height;
    this.pageWidth = this.pdf.internal.pageSize.width;
    this.currentY = 20;
    this.leftMargin = 20;
    this.rightMargin = 20;
  }

  async generateReport(data: ESGReportData, config: ReportConfig): Promise<Blob> {
    // Add cover page
    this.addCoverPage(data, config);
    
    // Add executive summary
    this.addExecutiveSummary(data);
    
    // Add methodology
    this.addMethodology(config.framework);
    
    // Add metrics and data
    if (config.includeMetrics) {
      this.addMetricsSection(data);
    }
    
    // Add compliance section
    if (config.includeCompliance) {
      this.addComplianceSection(data);
    }
    
    // Add appendices
    this.addAppendices(data, config);
    
    return this.pdf.output('blob');
  }

  private addCoverPage(data: ESGReportData, config: ReportConfig) {
    const { pdf } = this;
    
    // Header logo area
    pdf.setFillColor(46, 125, 50);
    pdf.rect(0, 0, this.pageWidth, 60, 'F');
    
    // Title
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('ESG SUSTAINABILITY REPORT', this.pageWidth / 2, 35, { align: 'center' });
    
    // Organization info
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text(data.organizationName, this.pageWidth / 2, 90, { align: 'center' });
    
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text(config.title, this.pageWidth / 2, 110, { align: 'center' });
    
    // Framework badge
    pdf.setFillColor(240, 240, 240);
    pdf.roundedRect(this.pageWidth / 2 - 30, 125, 60, 20, 5, 5, 'F');
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    pdf.text(`Framework: ${config.framework}`, this.pageWidth / 2, 137, { align: 'center' });
    
    // Report period
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Reporting Period: ${data.period}`, this.pageWidth / 2, 160, { align: 'center' });
    
    // Date generated
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    pdf.setFontSize(12);
    pdf.text(`Generated: ${currentDate}`, this.pageWidth / 2, 180, { align: 'center' });
    
    // Footer compliance statement
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    const complianceText = this.getComplianceStatement(config.framework);
    const lines = pdf.splitTextToSize(complianceText, this.pageWidth - 40);
    pdf.text(lines, this.pageWidth / 2, this.pageHeight - 40, { align: 'center' });
    
    pdf.addPage();
    this.currentY = 20;
  }

  private addExecutiveSummary(data: ESGReportData) {
    this.addSectionHeader('Executive Summary');
    
    const summaryText = this.generateExecutiveSummary(data);
    this.addParagraph(summaryText);
    
    // Key highlights table
    if (data.scores) {
      this.addSubheader('Key Performance Indicators');
      
      const kpiData = [
        ['Overall ESG Score', `${data.scores.overallScore}/100`, this.getScoreStatus(data.scores.overallScore)],
        ['Environmental Score', `${data.scores.environmentalScore}/100`, this.getScoreStatus(data.scores.environmentalScore)],
        ['Social Score', `${data.scores.socialScore}/100`, this.getScoreStatus(data.scores.socialScore)],
        ['Governance Score', `${data.scores.governanceScore}/100`, this.getScoreStatus(data.scores.governanceScore)]
      ];

      autoTable(this.pdf, {
        head: [['Metric', 'Score', 'Status']],
        body: kpiData,
        startY: this.currentY,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
        margin: { left: this.leftMargin, right: this.rightMargin }
      });
      
      this.currentY = (this.pdf as any).lastAutoTable.finalY + 20;
    }
  }

  private addMethodology(framework: string) {
    this.addSectionHeader('Methodology & Framework');
    
    const methodologyText = this.getMethodologyText(framework);
    this.addParagraph(methodologyText);
    
    // Framework standards table
    const standards = this.getFrameworkStandards(framework);
    if (standards.length > 0) {
      autoTable(this.pdf, {
        head: [['Standard', 'Description', 'Compliance Status']],
        body: standards,
        startY: this.currentY,
        theme: 'grid',
        headStyles: { fillColor: [46, 125, 50] },
        margin: { left: this.leftMargin, right: this.rightMargin }
      });
      
      this.currentY = (this.pdf as any).lastAutoTable.finalY + 20;
    }
  }

  private addMetricsSection(data: ESGReportData) {
    this.addSectionHeader(`${data.module} Metrics & Performance`);
    
    if (data.metrics && data.metrics.length > 0) {
      // Convert metrics to table format
      const metricsData = data.metrics.map(metric => [
        metric.name || metric.metricName,
        metric.value?.toString() || metric.currentValue?.toString() || 'N/A',
        metric.unit || metric.metricType || '',
        metric.trend || this.calculateTrend(metric) || 'Stable',
        metric.target?.toString() || metric.targetValue?.toString() || 'TBD'
      ]);

      autoTable(this.pdf, {
        head: [['Metric', 'Current Value', 'Unit', 'Trend', 'Target']],
        body: metricsData,
        startY: this.currentY,
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] },
        margin: { left: this.leftMargin, right: this.rightMargin },
        columnStyles: {
          1: { halign: 'right' },
          4: { halign: 'right' }
        }
      });
      
      this.currentY = (this.pdf as any).lastAutoTable.finalY + 20;
    }
    
    // Add data analysis
    this.addSubheader('Performance Analysis');
    const analysisText = this.generatePerformanceAnalysis(data);
    this.addParagraph(analysisText);
  }

  private addComplianceSection(data: ESGReportData) {
    this.addSectionHeader('Regulatory Compliance & Standards');
    
    if (data.compliance && data.compliance.length > 0) {
      const complianceData = data.compliance.map(item => [
        item.frameworkName || item.name,
        item.status || 'Under Review',
        item.completionPercentage ? `${item.completionPercentage}%` : 'N/A',
        item.deadline || item.nextDeadline || 'Ongoing',
        item.description || 'Standard compliance monitoring'
      ]);

      autoTable(this.pdf, {
        head: [['Framework', 'Status', 'Completion', 'Deadline', 'Notes']],
        body: complianceData,
        startY: this.currentY,
        theme: 'grid',
        headStyles: { fillColor: [46, 125, 50] },
        margin: { left: this.leftMargin, right: this.rightMargin }
      });
      
      this.currentY = (this.pdf as any).lastAutoTable.finalY + 20;
    }
  }

  private addAppendices(data: ESGReportData, config: ReportConfig) {
    this.pdf.addPage();
    this.currentY = 20;
    
    this.addSectionHeader('Appendices');
    
    // Appendix A: Data Sources
    this.addSubheader('Appendix A: Data Sources & Verification');
    this.addParagraph('All data presented in this report has been collected through verified internal systems and third-party assessments. Data collection methodologies follow industry best practices and regulatory requirements.');
    
    // Appendix B: Calculation Methods
    this.addSubheader('Appendix B: Calculation Methodologies');
    this.addParagraph('ESG scores are calculated using industry-standard methodologies including GHG Protocol, SASB standards, and GRI guidelines. Detailed calculation formulas are available upon request.');
    
    // Appendix C: Assurance Statement
    this.addSubheader('Appendix C: External Assurance');
    this.addParagraph('This report has been prepared in accordance with recognized ESG reporting standards. External verification is conducted annually by certified sustainability consultants.');
  }

  private addSectionHeader(title: string) {
    this.checkPageBreak(30);
    
    this.pdf.setFontSize(18);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor(46, 125, 50);
    this.pdf.text(title, this.leftMargin, this.currentY);
    
    // Add underline
    this.pdf.setDrawColor(46, 125, 50);
    this.pdf.line(this.leftMargin, this.currentY + 2, this.pageWidth - this.rightMargin, this.currentY + 2);
    
    this.currentY += 20;
    this.pdf.setTextColor(0, 0, 0);
  }

  private addSubheader(title: string) {
    this.checkPageBreak(20);
    
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(title, this.leftMargin, this.currentY);
    this.currentY += 15;
  }

  private addParagraph(text: string) {
    this.checkPageBreak(20);
    
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    
    const lines = this.pdf.splitTextToSize(text, this.pageWidth - this.leftMargin - this.rightMargin);
    
    lines.forEach((line: string) => {
      this.checkPageBreak(8);
      this.pdf.text(line, this.leftMargin, this.currentY);
      this.currentY += 6;
    });
    
    this.currentY += 10;
  }

  private checkPageBreak(requiredSpace: number) {
    if (this.currentY + requiredSpace > this.pageHeight - 30) {
      this.pdf.addPage();
      this.currentY = 20;
    }
  }

  private generateExecutiveSummary(data: ESGReportData): string {
    return `This ${data.reportType} sustainability report presents ${data.organizationName}'s environmental, social, and governance performance for the period ${data.period}. The report demonstrates our commitment to sustainable business practices and transparent reporting in accordance with international standards.

Our organization continues to make significant progress in ESG performance, with improvements across key metrics and maintained compliance with regulatory requirements. This report provides stakeholders with comprehensive insights into our sustainability initiatives and their measurable impacts.`;
  }

  private generatePerformanceAnalysis(data: ESGReportData): string {
    return `The ${data.module} metrics presented demonstrate our organization's commitment to continuous improvement in sustainability performance. Key trends indicate positive progress toward established targets, with several metrics exceeding industry benchmarks.

Areas of particular strength include our systematic approach to data collection and the integration of sustainability considerations into operational decision-making. Opportunities for further improvement have been identified and will be addressed in our forward-looking strategy.`;
  }

  private getComplianceStatement(framework: string): string {
    const statements = {
      'GRI': 'This report has been prepared in accordance with the GRI Standards: Core option.',
      'SASB': 'This report follows the Sustainability Accounting Standards Board (SASB) materiality framework.',
      'TCFD': 'This report aligns with the Task Force on Climate-related Financial Disclosures (TCFD) recommendations.',
      'EU-CSRD': 'This report complies with the European Union Corporate Sustainability Reporting Directive (CSRD).',
      'SEC': 'This report follows the U.S. Securities and Exchange Commission climate disclosure requirements.',
      'ISSB': 'This report is prepared in accordance with International Sustainability Standards Board (ISSB) standards.'
    };
    
    return statements[framework] || 'This report follows recognized international sustainability reporting standards.';
  }

  private getMethodologyText(framework: string): string {
    const methodologies = {
      'GRI': 'This report follows the Global Reporting Initiative (GRI) Standards, focusing on material topics that represent significant economic, environmental, and social impacts.',
      'SASB': 'We apply the Sustainability Accounting Standards Board (SASB) framework to identify financially material sustainability topics for our industry.',
      'TCFD': 'Our climate-related disclosures align with the Task Force on Climate-related Financial Disclosures (TCFD) framework across governance, strategy, risk management, and metrics.',
      'EU-CSRD': 'This report complies with the EU Corporate Sustainability Reporting Directive, providing comprehensive sustainability information for stakeholder decision-making.',
      'SEC': 'Climate-related disclosures follow the U.S. SEC requirements for material climate risks and their potential financial impacts.',
      'ISSB': 'We apply the International Sustainability Standards Board standards for comprehensive sustainability-related financial disclosures.'
    };
    
    return methodologies[framework] || 'This report follows established international sustainability reporting methodologies and best practices.';
  }

  private getFrameworkStandards(framework: string): string[][] {
    const standards = {
      'GRI': [
        ['GRI 2: General Disclosures', 'Organizational context and reporting practices', 'Compliant'],
        ['GRI 3: Material Topics', 'Process for determining material topics', 'Compliant'],
        ['GRI 300: Environmental', 'Environmental impact disclosures', 'Partial']
      ],
      'SASB': [
        ['Industry Standards', 'Sector-specific sustainability metrics', 'Compliant'],
        ['Materiality Assessment', 'Financially material topic identification', 'Compliant']
      ],
      'TCFD': [
        ['Governance', 'Climate-related governance oversight', 'Compliant'],
        ['Strategy', 'Climate-related risks and opportunities', 'Partial'],
        ['Risk Management', 'Climate risk identification and assessment', 'Compliant'],
        ['Metrics & Targets', 'Climate-related metrics and targets', 'Compliant']
      ]
    };
    
    return standards[framework] || [];
  }

  private getScoreStatus(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Satisfactory';
    return 'Needs Improvement';
  }

  private calculateTrend(metric: any): string {
    // Simple trend calculation based on available data
    if (metric.previousValue && metric.value) {
      const change = ((metric.value - metric.previousValue) / metric.previousValue) * 100;
      if (change > 5) return 'Improving';
      if (change < -5) return 'Declining';
    }
    return 'Stable';
  }
}

// Export function for easy use
export async function generateESGReport(data: ESGReportData, config: ReportConfig): Promise<Blob> {
  const generator = new ESGReportGenerator();
  return await generator.generateReport(data, config);
}

// Enhanced utility function to download the PDF with better compatibility
export function downloadPDF(blob: Blob, filename: string) {
  try {
    console.log('Starting PDF download:', filename, 'Size:', blob.size, 'bytes');
    
    // Ensure proper file extension
    const safeFilename = filename.endsWith('.pdf') ? filename : filename + '.pdf';
    
    // Create blob URL and download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = safeFilename;
    link.style.display = 'none';
    
    // Add to DOM temporarily
    document.body.appendChild(link);
    
    // Trigger download
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    
    // Delay URL cleanup to ensure download starts
    setTimeout(() => {
      URL.revokeObjectURL(url);
      console.log('PDF download initiated and URL cleaned up');
    }, 1000);
    
  } catch (error) {
    console.error('PDF download failed:', error);
    
    // Fallback method using data URL
    try {
      const reader = new FileReader();
      reader.onload = function() {
        const dataUrl = reader.result as string;
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = filename;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        console.log('PDF download completed via fallback method');
      };
      reader.onerror = function() {
        console.error('FileReader error in fallback download');
        alert('Download failed. Please try again or check browser settings.');
      };
      reader.readAsDataURL(blob);
    } catch (fallbackError) {
      console.error('Fallback download method also failed:', fallbackError);
      alert('Download failed. Your browser may be blocking downloads.');
    }
  }
}