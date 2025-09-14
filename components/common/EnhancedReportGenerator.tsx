import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { generateESGReport, type ReportConfig, type ESGReportData } from "@/lib/pdfGenerator";
import { 
  FileText, 
  Download, 
  Settings, 
  CheckCircle, 
  Loader,
  BarChart3,
  Shield,
  Globe,
  Calendar,
  Target
} from "lucide-react";

interface EnhancedReportGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  organizationId: number;
  defaultModule?: string;
}

export default function EnhancedReportGenerator({ 
  isOpen, 
  onClose, 
  organizationId, 
  defaultModule 
}: EnhancedReportGeneratorProps) {
  const [reportConfig, setReportConfig] = useState<Partial<ReportConfig>>({
    framework: 'GRI',
    reportingPeriod: '2024',
    includeCharts: true,
    includeMetrics: true,
    includeCompliance: true,
  });
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const { toast } = useToast();

  const { data: organizationData } = useQuery({
    queryKey: [`/api/organizations/${organizationId}`],
    retry: false,
  });

  const generateReportMutation = useMutation({
    mutationFn: async (config: ReportConfig) => {
      // Fetch report data from backend
      const response = await apiRequest('/api/reports/generate', {
        method: 'POST',
        body: JSON.stringify({
          organizationId,
          reportType: defaultModule || 'comprehensive',
          framework: config.framework,
          period: config.reportingPeriod,
          includeCharts: config.includeCharts,
          includeMetrics: config.includeMetrics,
          includeCompliance: config.includeCompliance,
        }),
      });

      return response.data;
    },
    onSuccess: async (reportData) => {
      try {
        setIsGenerating(true);
        setGenerationProgress(25);

        // Prepare full config
        const fullConfig: ReportConfig = {
          title: `${reportConfig.framework} ESG Report`,
          organizationName: organizationData?.name || 'Organization',
          reportingPeriod: reportConfig.reportingPeriod || '2024',
          framework: reportConfig.framework || 'GRI',
          includeCharts: reportConfig.includeCharts || false,
          includeMetrics: reportConfig.includeMetrics || false,
          includeCompliance: reportConfig.includeCompliance || false,
        };

        setGenerationProgress(50);

        // Generate PDF
        const pdfBlob = await generateESGReport(fullConfig, reportData);
        
        setGenerationProgress(75);

        // Download PDF
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `ESG_Report_${fullConfig.framework}_${fullConfig.reportingPeriod}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        setGenerationProgress(100);

        toast({
          title: "Report Generated Successfully",
          description: `${fullConfig.framework} report has been downloaded`,
        });

        setTimeout(() => {
          setIsGenerating(false);
          setGenerationProgress(0);
          onClose();
        }, 1000);

      } catch (error) {
        console.error('PDF generation error:', error);
        setIsGenerating(false);
        setGenerationProgress(0);
        toast({
          title: "Report Generation Failed",
          description: "Please try again or contact support",
          variant: "destructive",
        });
      }
    },
    onError: (error: Error) => {
      setIsGenerating(false);
      setGenerationProgress(0);
      toast({
        title: "Report Generation Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleGenerateReport = () => {
    const config = reportConfig as ReportConfig;
    generateReportMutation.mutate(config);
  };

  const frameworks = [
    { 
      value: 'GRI', 
      label: 'GRI Standards', 
      description: 'Global Reporting Initiative - Comprehensive sustainability reporting',
      icon: Globe 
    },
    { 
      value: 'SASB', 
      label: 'SASB Standards', 
      description: 'Sustainability Accounting Standards Board - Industry-specific',
      icon: BarChart3 
    },
    { 
      value: 'TCFD', 
      label: 'TCFD Framework', 
      description: 'Task Force on Climate-related Financial Disclosures',
      icon: Target 
    },
    { 
      value: 'EU-CSRD', 
      label: 'EU CSRD', 
      description: 'Corporate Sustainability Reporting Directive',
      icon: Shield 
    },
    { 
      value: 'SEC', 
      label: 'SEC Climate Rules', 
      description: 'U.S. Securities and Exchange Commission',
      icon: Shield 
    },
    { 
      value: 'ISSB', 
      label: 'ISSB Standards', 
      description: 'International Sustainability Standards Board',
      icon: Globe 
    },
  ];

  const reportingPeriods = [
    { value: '2024', label: '2024 (Current Year)' },
    { value: '2023', label: '2023' },
    { value: '2022', label: '2022' },
    { value: 'Q4-2024', label: 'Q4 2024' },
    { value: 'Q3-2024', label: 'Q3 2024' },
    { value: 'H1-2024', label: 'H1 2024' },
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Professional ESG Report Generator
          </DialogTitle>
        </DialogHeader>

        {isGenerating ? (
          <div className="space-y-6 py-8">
            <div className="text-center">
              <Loader className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Generating Your ESG Report</h3>
              <p className="text-gray-600">This may take a few moments...</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{generationProgress}%</span>
              </div>
              <Progress value={generationProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`text-center p-4 rounded-lg ${generationProgress >= 25 ? 'bg-green-50 text-green-800' : 'bg-gray-50'}`}>
                <CheckCircle className={`h-6 w-6 mx-auto mb-2 ${generationProgress >= 25 ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium">Data Collection</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${generationProgress >= 50 ? 'bg-green-50 text-green-800' : 'bg-gray-50'}`}>
                <FileText className={`h-6 w-6 mx-auto mb-2 ${generationProgress >= 50 ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium">Report Generation</p>
              </div>
              <div className={`text-center p-4 rounded-lg ${generationProgress >= 100 ? 'bg-green-50 text-green-800' : 'bg-gray-50'}`}>
                <Download className={`h-6 w-6 mx-auto mb-2 ${generationProgress >= 100 ? 'text-green-600' : 'text-gray-400'}`} />
                <p className="text-sm font-medium">Download</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Framework Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Framework Selection</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {frameworks.map((framework) => {
                    const Icon = framework.icon;
                    return (
                      <div
                        key={framework.value}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          reportConfig.framework === framework.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setReportConfig(prev => ({ ...prev, framework: framework.value as any }))}
                      >
                        <div className="flex items-start gap-3">
                          <Icon className="h-5 w-5 text-blue-600 mt-1" />
                          <div>
                            <h3 className="font-semibold">{framework.label}</h3>
                            <p className="text-sm text-gray-600 mt-1">{framework.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Report Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Reporting Period
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select 
                    value={reportConfig.reportingPeriod} 
                    onValueChange={(value) => setReportConfig(prev => ({ ...prev, reportingPeriod: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select reporting period" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportingPeriods.map((period) => (
                        <SelectItem key={period.value} value={period.value}>
                          {period.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Report Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeMetrics"
                      checked={reportConfig.includeMetrics}
                      onCheckedChange={(checked) => 
                        setReportConfig(prev => ({ ...prev, includeMetrics: checked as boolean }))
                      }
                    />
                    <Label htmlFor="includeMetrics">Include ESG Metrics Tables</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCharts"
                      checked={reportConfig.includeCharts}
                      onCheckedChange={(checked) => 
                        setReportConfig(prev => ({ ...prev, includeCharts: checked as boolean }))
                      }
                    />
                    <Label htmlFor="includeCharts">Include Charts & Visualizations</Label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="includeCompliance"
                      checked={reportConfig.includeCompliance}
                      onCheckedChange={(checked) => 
                        setReportConfig(prev => ({ ...prev, includeCompliance: checked as boolean }))
                      }
                    />
                    <Label htmlFor="includeCompliance">Include Compliance Analysis</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Report Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Framework:</span>
                    <Badge variant="outline">{reportConfig.framework}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Period:</span>
                    <span>{reportConfig.reportingPeriod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Organization:</span>
                    <span>{organizationData?.name || 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Estimated Pages:</span>
                    <span>
                      {8 + 
                        (reportConfig.includeMetrics ? 3 : 0) + 
                        (reportConfig.includeCharts ? 2 : 0) + 
                        (reportConfig.includeCompliance ? 2 : 0)
                      } pages
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerateReport}
                disabled={generateReportMutation.isPending || !reportConfig.framework}
                className="flex items-center gap-2"
              >
                {generateReportMutation.isPending ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
                Generate Professional Report
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}