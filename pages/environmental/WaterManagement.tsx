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
  Droplets, 
  TrendingDown, 
  Recycle, 
  AlertTriangle, 
  Factory,
  Settings,
  FileText,
  Target,
  Shield
} from "lucide-react";

const organizationId = 1;

export default function WaterManagement() {
  const [parameters, setParameters] = useState({
    efficiencyMeasures: 65,
    recyclingPrograms: 45,
    droughtResilience: 70,
    supplierStewardship: 55,
  });

  const { data: waterData, isLoading, error } = useQuery({
    queryKey: ["/api/environmental-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "water_usage") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load water management data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Water Management System</h1>
          <p className="text-gray-600 mt-1">
            Water stewardship following CEO Water Mandate and CDP Water Security standards
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
                  title: 'Water Management Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'GRI' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 76, environmentalScore: 80, socialScore: 74, governanceScore: 72,
                    keyAchievements: ['12.3% reduction in water withdrawal', 'Medium water stress risk management', 'CDP Water A- rating achieved'],
                    keyRisks: ['Water scarcity in key regions', 'Regulatory compliance requirements', 'Supply chain water risks']
                  },
                  metrics: [
                    { category: 'environmental', metricName: 'Total Water Withdrawal', value: '1245', unit: 'megalitres', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Water Stress Risk', value: 'Medium', unit: 'risk level', trend: 'stable' as const },
                    { category: 'environmental', metricName: 'Water Recycling Rate', value: '35', unit: '%', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'CDP Water Security', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'CEO Water Mandate', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Implement water recycling systems', 'Enhance supplier water stewardship', 'Develop water risk mitigation strategies']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Water_Management_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Water Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set Water Targets
          </Button>
        </div>
      </div>

      {/* Water Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Withdrawal</p>
                <p className="text-2xl font-bold text-blue-600">1,245</p>
                <p className="text-xs text-green-600">-12.3% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">megalitres</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Water Stress Risk</p>
                <p className="text-2xl font-bold text-orange-600">Medium</p>
                <p className="text-xs text-gray-600">38% of operations</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">WRI Aqueduct assessment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recycling Rate</p>
                <p className="text-2xl font-bold text-green-600">42%</p>
                <p className="text-xs text-green-600">+8% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">of total consumption</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Intensity Score</p>
                <p className="text-2xl font-bold text-purple-600">2.1</p>
                <p className="text-xs text-green-600">-18% vs baseline</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">m³/unit product</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Water Usage Breakdown */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Droplets className="h-5 w-5" />
                Water Usage by Source & Location
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sources" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sources">Water Sources</TabsTrigger>
                  <TabsTrigger value="stress">Water Stress</TabsTrigger>
                  <TabsTrigger value="quality">Quality Metrics</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sources" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Municipal Water</span>
                      <span className="text-sm text-gray-600">685 ML (55%)</span>
                    </div>
                    <Progress value={55} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Groundwater</span>
                      <span className="text-sm text-gray-600">374 ML (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Surface Water</span>
                      <span className="text-sm text-gray-600">124 ML (10%)</span>
                    </div>
                    <Progress value={10} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recycled Water</span>
                      <span className="text-sm text-gray-600">62 ML (5%)</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="stress" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">High Water Stress</span>
                      <span className="text-sm text-gray-600">3 facilities (18%)</span>
                    </div>
                    <Progress value={18} className="h-2 bg-red-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Medium Water Stress</span>
                      <span className="text-sm text-gray-600">5 facilities (38%)</span>
                    </div>
                    <Progress value={38} className="h-2 bg-orange-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Low Water Stress</span>
                      <span className="text-sm text-gray-600">8 facilities (44%)</span>
                    </div>
                    <Progress value={44} className="h-2 bg-green-100" />
                  </div>
                </TabsContent>
                
                <TabsContent value="quality" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wastewater Treatment</span>
                      <span className="text-sm text-gray-600">95% compliance</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Discharge Quality</span>
                      <span className="text-sm text-gray-600">98% within limits</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pollution Prevention</span>
                      <span className="text-sm text-gray-600">Zero incidents</span>
                    </div>
                    <Progress value={100} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Water Stewardship Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Water Stewardship Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Efficiency Measures</label>
                  <Badge variant="outline">{parameters.efficiencyMeasures}%</Badge>
                </div>
                <Slider
                  value={[parameters.efficiencyMeasures]}
                  onValueChange={(value) => handleParameterChange('efficiencyMeasures', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Reduction in consumption per unit
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Recycling Programs</label>
                  <Badge variant="outline">{parameters.recyclingPrograms}%</Badge>
                </div>
                <Slider
                  value={[parameters.recyclingPrograms]}
                  onValueChange={(value) => handleParameterChange('recyclingPrograms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Water recycled and reused
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Drought Resilience</label>
                  <Badge variant="outline">{parameters.droughtResilience}%</Badge>
                </div>
                <Slider
                  value={[parameters.droughtResilience]}
                  onValueChange={(value) => handleParameterChange('droughtResilience', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alternative source development
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Supplier Stewardship</label>
                  <Badge variant="outline">{parameters.supplierStewardship}%</Badge>
                </div>
                <Slider
                  value={[parameters.supplierStewardship]}
                  onValueChange={(value) => handleParameterChange('supplierStewardship', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suppliers with water programs
                </p>
              </div>

              <Button className="w-full esg-primary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Water Targets & Initiatives */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Water Targets & Conservation Initiatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Water Efficiency</span>
              </div>
              <p className="text-sm text-gray-600">
                25% intensity reduction by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>72%</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Recycling Target</span>
              </div>
              <p className="text-sm text-gray-600">
                60% recycling rate by 2030
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
                <Shield className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Risk Mitigation</span>
              </div>
              <p className="text-sm text-gray-600">
                Water stress risk assessment coverage
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Coverage</span>
                  <span>100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Supplier Engagement</span>
              </div>
              <p className="text-sm text-gray-600">
                Water-stressed region supplier programs
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Engagement</span>
                  <span>55%</span>
                </div>
                <Progress value={55} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
