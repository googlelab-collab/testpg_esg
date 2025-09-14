import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { 
  Recycle, 
  Package, 
  Repeat, 
  ArrowRight,
  Settings,
  FileText,
  TrendingUp,
  Award,
  Target,
  Trash2
} from "lucide-react";

const organizationId = 1;

export default function CircularEconomy() {
  const [parameters, setParameters] = useState({
    wasteDiversion: 68,
    circularDesign: 35,
    materialRecovery: 52,
    packagingOptimization: 45,
  });

  const { data: wasteData, isLoading, error } = useQuery({
    queryKey: ["/api/waste", organizationId],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load circular economy data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Circular Economy Hub</h1>
          <p className="text-gray-600 mt-1">
            Waste reduction and circular economy following Ellen MacArthur Foundation principles
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Circular Economy & Waste Management Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'Ellen MacArthur Foundation' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 73, environmentalScore: 78, socialScore: 70, governanceScore: 71,
                    keyAchievements: ['68% waste diverted from landfill', '15.2% reduction in total waste', 'Circular economy principles implemented'],
                    keyRisks: ['Waste processing capacity', 'Material recovery challenges', 'Supply chain circularity gaps']
                  },
                  metrics: [
                    { category: 'environmental', metricName: 'Total Waste Generated', value: '24580', unit: 'tons', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Waste Diverted', value: '68', unit: '%', trend: 'up' as const },
                    { category: 'environmental', metricName: 'Material Recovery Rate', value: '52', unit: '%', trend: 'up' as const },
                    { category: 'environmental', metricName: 'Packaging Optimization', value: '45', unit: '%', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'Ellen MacArthur Foundation', status: 'in_progress' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'EU Circular Economy Action Plan', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance material recovery programs', 'Implement design for circularity', 'Strengthen supplier circular economy requirements']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Circular_Economy_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error('PDF generation error:', error);
                alert(`PDF generation failed: ${error.message}`);
              }
            }}
          >
            <FileText className="h-4 w-4" />
            Download Waste Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set Zero Waste Goals
          </Button>
        </div>
      </div>

      {/* Waste Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Waste Generated</p>
                <p className="text-2xl font-bold text-gray-900">24,580</p>
                <p className="text-xs text-green-600">-15.2% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste Diverted</p>
                <p className="text-2xl font-bold text-green-600">68%</p>
                <p className="text-xs text-green-600">+12.3% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Circular Materials</p>
                <p className="text-2xl font-bold text-blue-600">35%</p>
                <p className="text-xs text-green-600">+8.7% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Repeat className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Packaging Reduction</p>
                <p className="text-2xl font-bold text-purple-600">22%</p>
                <p className="text-xs text-green-600">+5.8% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Waste Streams */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5" />
                Waste Streams & Diversion Methods
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="type" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="type">By Type</TabsTrigger>
                  <TabsTrigger value="method">By Method</TabsTrigger>
                  <TabsTrigger value="facility">By Facility</TabsTrigger>
                </TabsList>
                
                <TabsContent value="type" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">General Waste</span>
                      <span className="text-sm text-gray-600">12,450 tonnes</span>
                    </div>
                    <Progress value={51} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Packaging Materials</span>
                      <span className="text-sm text-gray-600">7,280 tonnes</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Electronic Waste</span>
                      <span className="text-sm text-gray-600">2,940 tonnes</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hazardous Waste</span>
                      <span className="text-sm text-gray-600">1,910 tonnes</span>
                    </div>
                    <Progress value={7} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="method" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recycling</span>
                      <span className="text-sm text-gray-600">16,750 tonnes</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Composting</span>
                      <span className="text-sm text-gray-600">2,940 tonnes</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Energy Recovery</span>
                      <span className="text-sm text-gray-600">2,450 tonnes</span>
                    </div>
                    <Progress value={10} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Landfill</span>
                      <span className="text-sm text-gray-600">2,440 tonnes</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="facility" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Manufacturing Plants</span>
                      <span className="text-sm text-gray-600">14,750 tonnes</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Office Buildings</span>
                      <span className="text-sm text-gray-600">4,920 tonnes</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Distribution Centers</span>
                      <span className="text-sm text-gray-600">3,690 tonnes</span>
                    </div>
                    <Progress value={15} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">R&D Facilities</span>
                      <span className="text-sm text-gray-600">1,220 tonnes</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Circular Economy Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Circular Economy Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Waste Diversion Rate</label>
                  <Badge variant="outline">{parameters.wasteDiversion}%</Badge>
                </div>
                <Slider
                  value={[parameters.wasteDiversion]}
                  onValueChange={(value) => handleParameterChange('wasteDiversion', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  % diverted from landfill
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Circular Design</label>
                  <Badge variant="outline">{parameters.circularDesign}%</Badge>
                </div>
                <Slider
                  value={[parameters.circularDesign]}
                  onValueChange={(value) => handleParameterChange('circularDesign', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  % products designed for circularity
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Material Recovery</label>
                  <Badge variant="outline">{parameters.materialRecovery}%</Badge>
                </div>
                <Slider
                  value={[parameters.materialRecovery]}
                  onValueChange={(value) => handleParameterChange('materialRecovery', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recycling rate improvements
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Packaging Optimization</label>
                  <Badge variant="outline">{parameters.packagingOptimization}%</Badge>
                </div>
                <Slider
                  value={[parameters.packagingOptimization]}
                  onValueChange={(value) => handleParameterChange('packagingOptimization', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  % reduction in packaging materials
                </p>
              </div>

              <Button className="w-full esg-primary">
                Update Circular Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Circular Economy Goals */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Circular Economy Goals & Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Zero Waste to Landfill</span>
              </div>
              <p className="text-sm text-gray-600">
                100% waste diversion by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Repeat className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Circular Materials</span>
              </div>
              <p className="text-sm text-gray-600">
                50% circular content by 2035
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Package className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Packaging Reduction</span>
              </div>
              <p className="text-sm text-gray-600">
                30% packaging reduction by 2028
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>73%</span>
                </div>
                <Progress value={73} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
