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
  Sun, 
  Wind, 
  Zap, 
  Battery, 
  TrendingUp,
  Settings,
  FileText,
  Target,
  Factory,
  Leaf
} from "lucide-react";

const organizationId = 1;

export default function RenewableEnergy() {
  const [parameters, setParameters] = useState({
    renewableTargets: 75,
    powerPurchaseAgreements: 60,
    onsiteGeneration: 40,
    gridDecarbonization: 55,
  });

  const { data: renewableData, isLoading, error } = useQuery({
    queryKey: ["/api/environmental-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "renewable_energy") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load renewable energy data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Renewable Energy Planner</h1>
          <p className="text-gray-600 mt-1">
            Renewable energy strategy following RE100 initiative and IEA Net Zero by 2050 roadmap
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
                  title: 'Renewable Energy Report (RE100)',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'GRI' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 85, environmentalScore: 88, socialScore: 82, governanceScore: 80,
                    keyAchievements: ['68% renewable energy share achieved', '45MW solar capacity installed', 'RE100 commitment progress on track'],
                    keyRisks: ['Grid stability challenges', 'Renewable energy intermittency', 'Technology cost fluctuations']
                  },
                  metrics: [
                    { category: 'environmental', metricName: 'Renewable Energy Share', value: '68', unit: '%', trend: 'up' as const },
                    { category: 'environmental', metricName: 'Solar Capacity', value: '45', unit: 'MW', trend: 'up' as const },
                    { category: 'environmental', metricName: 'Wind Capacity', value: '28', unit: 'MW', trend: 'up' as const },
                    { category: 'environmental', metricName: 'Renewable Investment', value: '15.6', unit: 'M USD', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'RE100 Initiative', status: 'in_progress' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'IEA Net Zero by 2050', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Accelerate renewable energy procurement', 'Explore energy storage solutions', 'Enhance grid flexibility initiatives']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Renewable_Energy_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download RE100 Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Join RE100
          </Button>
        </div>
      </div>

      {/* Renewable Energy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renewable Share</p>
                <p className="text-2xl font-bold text-green-600">68%</p>
                <p className="text-xs text-green-600">+15% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">of total electricity</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solar Capacity</p>
                <p className="text-2xl font-bold text-yellow-600">45</p>
                <p className="text-xs text-green-600">+12 MW this year</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Sun className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">MW installed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wind PPAs</p>
                <p className="text-2xl font-bold text-blue-600">180</p>
                <p className="text-xs text-blue-600">20-year contracts</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">MW contracted</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Storage Capacity</p>
                <p className="text-2xl font-bold text-purple-600">25</p>
                <p className="text-xs text-purple-600">Grid stabilization</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Battery className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">MWh storage</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Renewable Energy Portfolio */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-5 w-5" />
                Renewable Energy Portfolio & Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="portfolio" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="portfolio">Portfolio Mix</TabsTrigger>
                  <TabsTrigger value="projects">Projects</TabsTrigger>
                  <TabsTrigger value="certificates">RECs & I-RECs</TabsTrigger>
                </TabsList>
                
                <TabsContent value="portfolio" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Solar Power</span>
                      <span className="text-sm text-gray-600">45 MW (35%)</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wind Power</span>
                      <span className="text-sm text-gray-600">65 MW (50%)</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hydroelectric</span>
                      <span className="text-sm text-gray-600">15 MW (12%)</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Geothermal</span>
                      <span className="text-sm text-gray-600">4 MW (3%)</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="projects" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Operational Projects</span>
                      <span className="text-sm text-gray-600">12 facilities</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Under Construction</span>
                      <span className="text-sm text-gray-600">3 facilities</span>
                    </div>
                    <Progress value={19} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Development Pipeline</span>
                      <span className="text-sm text-gray-600">2 facilities</span>
                    </div>
                    <Progress value={13} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Grid Connection Queue</span>
                      <span className="text-sm text-gray-600">1 facility</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="certificates" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">RECs Purchased</span>
                      <span className="text-sm text-gray-600">450,000 MWh</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">I-RECs International</span>
                      <span className="text-sm text-gray-600">180,000 MWh</span>
                    </div>
                    <Progress value={24} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Direct PPAs</span>
                      <span className="text-sm text-gray-600">120,000 MWh</span>
                    </div>
                    <Progress value={16} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Renewable Energy Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Renewable Energy Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Renewable Targets</label>
                  <Badge variant="outline">{parameters.renewableTargets}%</Badge>
                </div>
                <Slider
                  value={[parameters.renewableTargets]}
                  onValueChange={(value) => handleParameterChange('renewableTargets', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Renewable energy by 2030
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Power Purchase Agreements</label>
                  <Badge variant="outline">{parameters.powerPurchaseAgreements}%</Badge>
                </div>
                <Slider
                  value={[parameters.powerPurchaseAgreements]}
                  onValueChange={(value) => handleParameterChange('powerPurchaseAgreements', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Long-term PPA contracts
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Onsite Generation</label>
                  <Badge variant="outline">{parameters.onsiteGeneration}%</Badge>
                </div>
                <Slider
                  value={[parameters.onsiteGeneration]}
                  onValueChange={(value) => handleParameterChange('onsiteGeneration', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solar and wind capacity
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Grid Decarbonization</label>
                  <Badge variant="outline">{parameters.gridDecarbonization}%</Badge>
                </div>
                <Slider
                  value={[parameters.gridDecarbonization]}
                  onValueChange={(value) => handleParameterChange('gridDecarbonization', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Utility green energy programs
                </p>
              </div>

              <Button className="w-full esg-primary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RE100 Commitment & SBT Alignment */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            RE100 Commitment & Science-Based Target Alignment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">RE100 Target</span>
              </div>
              <p className="text-sm text-gray-600">
                100% renewable electricity by 2030
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
                <Wind className="h-5 w-5 text-blue-600" />
                <span className="font-medium">SBT Alignment</span>
              </div>
              <p className="text-sm text-gray-600">
                1.5°C pathway renewable energy
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Alignment</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Grid Resilience</span>
              </div>
              <p className="text-sm text-gray-600">
                Energy storage and grid services
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span>25 MWh</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Cost Savings</span>
              </div>
              <p className="text-sm text-gray-600">
                Renewable energy cost benefits
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Annual Savings</span>
                  <span>$2.4M</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
