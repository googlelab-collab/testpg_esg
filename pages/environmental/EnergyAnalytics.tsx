import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import ReportGenerator from "@/components/reports/ReportGenerator";
import { 
  Zap, 
  TrendingUp, 
  Sun, 
  Wind, 
  Battery,
  Settings,
  FileText,
  Target,
  Factory
} from "lucide-react";

const organizationId = 1;

export default function EnergyAnalytics() {
  const [parameters, setParameters] = useState({
    buildingEfficiency: 75,
    renewableEnergy: 45,
    equipmentUpgrades: 60,
    operationalChanges: 80,
  });
  
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  const { data: energyData, isLoading, error } = useQuery({
    queryKey: ["/api/environmental-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "energy_consumption") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load energy analytics data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Energy Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Energy management following ISO 50001 standards and ENERGY STAR benchmarking
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button 
            className="flex items-center space-x-2"
            onClick={async () => {
              try {
                console.log('Generating Energy Analytics PDF report...');
                
                // Import PDF generator
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                console.log('PDF generator imported successfully');
                
                // Prepare report config - using exact same pattern as GHG emissions
                const config = {
                  title: 'Energy Analytics Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'GRI' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                console.log('Config prepared:', config);
                
                // Prepare report data
                const reportData = {
                  executiveSummary: {
                    overallScore: 82,
                    environmentalScore: 85,
                    socialScore: 78,
                    governanceScore: 75,
                    keyAchievements: [
                      '8.2% reduction in energy consumption',
                      '45% renewable energy share achieved',
                      'ISO 50001 certification maintained',
                      'ENERGY STAR portfolio score of 85'
                    ],
                    keyRisks: [
                      'Energy price volatility impact',
                      'Grid reliability concerns',
                      'Technology transition costs'
                    ]
                  },
                  metrics: [
                    { category: 'environmental', metricName: 'Total Energy Consumption', value: '2450', unit: 'MWh', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Renewable Energy Share', value: '45', unit: '%', trend: 'up' as const },
                    { category: 'environmental', metricName: 'Energy Intensity', value: '0.125', unit: 'MWh/revenue', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Carbon Intensity', value: '0.42', unit: 'tCO₂e/MWh', trend: 'down' as const },
                  ],
                  complianceStatus: [
                    { framework: 'ISO 50001', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'ENERGY STAR', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'RE100', status: 'in_progress' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: [
                    'Expand renewable energy procurement to 75% by 2025',
                    'Implement advanced energy management systems',
                    'Enhance equipment efficiency programs'
                  ]
                };
                
                // Generate and download PDF
                const pdfBlob = await generateESGReport(config, reportData);
                
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Energy_Analytics_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('Energy Analytics PDF report generated successfully');
              } catch (error) {
                console.error('Error generating Energy Analytics PDF:', error);
                alert('Failed to generate PDF report. Please try again.');
              }
            }}
          >
            <FileText className="h-4 w-4" />
            Download Energy Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set RE100 Target
          </Button>
        </div>
      </div>

      {/* Energy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Consumption</p>
                <p className="text-2xl font-bold text-blue-600">2,450</p>
                <p className="text-xs text-green-600">-8.2% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">MWh</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renewable Energy</p>
                <p className="text-2xl font-bold text-green-600">45%</p>
                <p className="text-xs text-green-600">+12% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Sun className="h-6 w-6 text-green-600" />
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
                <p className="text-sm font-medium text-gray-600">Carbon Intensity</p>
                <p className="text-2xl font-bold text-purple-600">0.42</p>
                <p className="text-xs text-green-600">-15% vs baseline</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">tCO₂e/MWh</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency Score</p>
                <p className="text-2xl font-bold text-orange-600">87</p>
                <p className="text-xs text-green-600">+5 vs industry avg</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">ENERGY STAR score</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Energy Breakdown */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Energy Consumption by Source
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="sources" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="sources">Energy Sources</TabsTrigger>
                  <TabsTrigger value="facilities">By Facility</TabsTrigger>
                  <TabsTrigger value="trends">Trends</TabsTrigger>
                </TabsList>
                
                <TabsContent value="sources" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Grid Electricity</span>
                      <span className="text-sm text-gray-600">1,347 MWh (55%)</span>
                    </div>
                    <Progress value={55} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Solar Power</span>
                      <span className="text-sm text-gray-600">686 MWh (28%)</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Natural Gas</span>
                      <span className="text-sm text-gray-600">294 MWh (12%)</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wind Power</span>
                      <span className="text-sm text-gray-600">123 MWh (5%)</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="facilities" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Manufacturing Plant A</span>
                      <span className="text-sm text-gray-600">980 MWh (40%)</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Corporate Headquarters</span>
                      <span className="text-sm text-gray-600">735 MWh (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Distribution Centers</span>
                      <span className="text-sm text-gray-600">490 MWh (20%)</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Regional Offices</span>
                      <span className="text-sm text-gray-600">245 MWh (10%)</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="trends" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Energy Intensity Improvement</span>
                      <span className="text-sm text-gray-600">-8.2% YoY</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Renewable Energy Growth</span>
                      <span className="text-sm text-gray-600">+12% YoY</span>
                    </div>
                    <Progress value={112} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cost Reduction</span>
                      <span className="text-sm text-gray-600">-6.5% YoY</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Energy Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Energy Efficiency Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Building Efficiency</label>
                  <Badge variant="outline">{parameters.buildingEfficiency}%</Badge>
                </div>
                <Slider
                  value={[parameters.buildingEfficiency]}
                  onValueChange={(value) => handleParameterChange('buildingEfficiency', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  kWh/sq ft reduction target
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Renewable Energy</label>
                  <Badge variant="outline">{parameters.renewableEnergy}%</Badge>
                </div>
                <Slider
                  value={[parameters.renewableEnergy]}
                  onValueChange={(value) => handleParameterChange('renewableEnergy', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Procurement target by 2030
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Equipment Upgrades</label>
                  <Badge variant="outline">{parameters.equipmentUpgrades}%</Badge>
                </div>
                <Slider
                  value={[parameters.equipmentUpgrades]}
                  onValueChange={(value) => handleParameterChange('equipmentUpgrades', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  HVAC and lighting efficiency
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Operational Changes</label>
                  <Badge variant="outline">{parameters.operationalChanges}%</Badge>
                </div>
                <Slider
                  value={[parameters.operationalChanges]}
                  onValueChange={(value) => handleParameterChange('operationalChanges', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Behavioral and operational improvements
                </p>
              </div>

              <Button className="w-full esg-primary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Energy Targets & Performance */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Energy Targets & Industry Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-green-600" />
                <span className="font-medium">RE100 Commitment</span>
              </div>
              <p className="text-sm text-gray-600">
                100% renewable electricity by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>45%</span>
                </div>
                <Progress value={45} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Energy Intensity</span>
              </div>
              <p className="text-sm text-gray-600">
                50% reduction by 2030 (vs 2020)
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>32%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Battery className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Energy Storage</span>
              </div>
              <p className="text-sm text-gray-600">
                Grid resilience and demand management
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span>15 MWh</span>
                </div>
                <Progress value={25} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">Green PPAs</span>
              </div>
              <p className="text-sm text-gray-600">
                Power Purchase Agreements portfolio
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Contracted</span>
                  <span>850 MW</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Generator Dialog */}
      <Dialog open={showReportGenerator} onOpenChange={setShowReportGenerator}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Generate Energy Analytics Report</DialogTitle>
          </DialogHeader>
          <ReportGenerator
            defaultModule="Energy Analytics"
            defaultReportType="environmental"
            onClose={() => setShowReportGenerator(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
