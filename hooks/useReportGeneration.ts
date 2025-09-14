import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { generateESGReport, downloadPDF, type ESGReportData, type ReportConfig } from '@/lib/reportGenerator';
import { useToast } from '@/hooks/use-toast';

export interface ReportGenerationOptions {
  organizationId?: number;
  reportType: 'environmental' | 'social' | 'governance' | 'comprehensive';
  module: string;
  period?: string;
  framework?: 'GRI' | 'SASB' | 'TCFD' | 'EU-CSRD' | 'SEC' | 'ISSB';
  includeCharts?: boolean;
  includeMetrics?: boolean;
  includeCompliance?: boolean;
}

export function useReportGeneration() {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  // Fetch available frameworks
  const { data: frameworks } = useQuery({
    queryKey: ['/api/reports/frameworks'],
  });

  // Generate report data from backend
  const generateReportData = useMutation({
    mutationFn: async (options: ReportGenerationOptions) => {
      const response = await apiRequest('/api/reports/generate', {
        method: 'POST',
        body: JSON.stringify(options),
      });
      return response;
    },
  });

  // Main function to generate and download PDF report
  const generateReport = async (options: ReportGenerationOptions) => {
    console.log('Starting report generation with options:', options);
    setIsGenerating(true);
    
    try {
      // Step 1: Generate report data from backend
      console.log('Calling backend API for report data...');
      const result = await generateReportData.mutateAsync(options);
      console.log('Backend response:', result);
      
      if (!result.success || !result.reportData) {
        throw new Error('Failed to generate report data');
      }

      // Step 2: Configure report settings
      const reportConfig: ReportConfig = {
        title: `${options.module} ${options.reportType.charAt(0).toUpperCase() + options.reportType.slice(1)} Report`,
        subtitle: options.period || 'Annual 2024',
        framework: options.framework || 'GRI',
        includeCharts: options.includeCharts ?? true,
        includeMetrics: options.includeMetrics ?? true,
        includeCompliance: options.includeCompliance ?? true,
      };

      // Step 3: Generate PDF using client-side generator
      console.log('Generating PDF with config:', reportConfig);
      const pdfBlob = await generateESGReport(result.reportData, reportConfig);
      console.log('PDF generated successfully, size:', pdfBlob.size);

      // Step 4: Download the PDF
      const fileName = `${result.reportData.organizationName}_${options.module}_${options.reportType}_Report_${new Date().toISOString().split('T')[0]}.pdf`;
      console.log('Downloading PDF as:', fileName);
      downloadPDF(pdfBlob, fileName);

      toast({
        title: 'Report Generated Successfully',
        description: `${options.module} report has been downloaded.`,
      });

      return { success: true, fileName };
    } catch (error) {
      console.error('Error generating report:', error);
      toast({
        title: 'Report Generation Failed',
        description: 'There was an error generating the report. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateReport,
    isGenerating,
    frameworks: frameworks || [],
    generateReportData,
  };
}

// Specialized hooks for different report types
export function useEnvironmentalReport() {
  const { generateReport, isGenerating } = useReportGeneration();

  const generateEnvironmentalReport = (module: string, options: Partial<ReportGenerationOptions> = {}) => {
    return generateReport({
      reportType: 'environmental',
      module,
      framework: 'GRI',
      ...options,
    });
  };

  return { generateEnvironmentalReport, isGenerating };
}

export function useSocialReport() {
  const { generateReport, isGenerating } = useReportGeneration();

  const generateSocialReport = (module: string, options: Partial<ReportGenerationOptions> = {}) => {
    return generateReport({
      reportType: 'social',
      module,
      framework: 'SASB',
      ...options,
    });
  };

  return { generateSocialReport, isGenerating };
}

export function useGovernanceReport() {
  const { generateReport, isGenerating } = useReportGeneration();

  const generateGovernanceReport = (module: string, options: Partial<ReportGenerationOptions> = {}) => {
    return generateReport({
      reportType: 'governance',
      module,
      framework: 'TCFD',
      ...options,
    });
  };

  return { generateGovernanceReport, isGenerating };
}

export function useComprehensiveReport() {
  const { generateReport, isGenerating } = useReportGeneration();

  const generateComprehensiveReport = (options: Partial<ReportGenerationOptions> = {}) => {
    return generateReport({
      reportType: 'comprehensive',
      module: 'Comprehensive ESG',
      framework: 'GRI',
      ...options,
    });
  };

  return { generateComprehensiveReport, isGenerating };
}