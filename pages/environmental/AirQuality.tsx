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
  Wind, 
  TrendingDown, 
  AlertTriangle, 
  Shield, 
  Factory,
  Settings,
  FileText,
  Target,
  Activity
} from "lucide-react";

const organizationId = 1;

export default function AirQuality() {
  const [parameters, setParameters] = useState({
    emissionControls: 85,
    fuelSwitching: 60,
    processOptimization: 75,
    monitoringEnhancement: 90,
  });

  const { data: airQualityData, isLoading, error } = useQuery({
    queryKey: ["/api/environmental-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "air_quality") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load air quality data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Air Quality Monitor</h1>
          <p className="text-gray-600 mt-1">
            Air quality management following WHO guidelines and EPA National Ambient Air Quality Standards
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
                  title: 'Air Quality Management Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'WHO Air Quality Guidelines' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 79, environmentalScore: 82, socialScore: 76, governanceScore: 78,
                    keyAchievements: ['Air Quality Index at 42 (Good)', '24% reduction in PM2.5 emissions', 'WHO guidelines compliance achieved'],
                    keyRisks: ['Industrial emissions monitoring', 'Regional air quality impacts', 'Regulatory compliance requirements']
                  },
                  metrics: [
                    { category: 'environmental', metricName: 'Air Quality Index', value: '42', unit: 'AQI', trend: 'down' as const },
                    { category: 'environmental', metricName: 'PM2.5 Emissions', value: '18.5', unit: 'µg/m³', trend: 'down' as const },
                    { category: 'environmental', metricName: 'NOx Emissions', value: '125', unit: 'tons/year', trend: 'down' as const },
                    { category: 'environmental', metricName: 'SO2 Emissions', value: '78', unit: 'tons/year', trend: 'down' as const }
                  ],
                  complianceStatus: [
                    { framework: 'WHO Air Quality Guidelines', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'EPA NAAQS', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance emissions monitoring systems', 'Implement cleaner production technologies', 'Strengthen community engagement programs']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Air_Quality_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Air Quality Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set Emission Targets
          </Button>
        </div>
      </div>

      {/* Air Quality Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Air Quality Index</p>
                <p className="text-2xl font-bold text-green-600">42</p>
                <p className="text-xs text-green-600">Good quality</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">WHO guidelines compliance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">PM2.5 Emissions</p>
                <p className="text-2xl font-bold text-blue-600">18.5</p>
                <p className="text-xs text-green-600">-24% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">tonnes/year</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">NOx Emissions</p>
                <p className="text-2xl font-bold text-orange-600">142</p>
                <p className="text-xs text-green-600">-18% vs baseline</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">tonnes/year</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">SOx Emissions</p>
                <p className="text-2xl font-bold text-purple-600">45.2</p>
                <p className="text-xs text-green-600">-32% vs baseline</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">tonnes/year</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Air Emissions Breakdown */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wind className="h-5 w-5" />
                Air Emissions by Source & Pollutant
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="pollutants" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pollutants">By Pollutant</TabsTrigger>
                  <TabsTrigger value="sources">By Source</TabsTrigger>
                  <TabsTrigger value="compliance">Compliance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="pollutants" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Nitrogen Oxides (NOx)</span>
                      <span className="text-sm text-gray-600">142 tonnes (65%)</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Sulfur Oxides (SOx)</span>
                      <span className="text-sm text-gray-600">45.2 tonnes (21%)</span>
                    </div>
                    <Progress value={21} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Particulate Matter (PM2.5)</span>
                      <span className="text-sm text-gray-600">18.5 tonnes (8%)</span>
                    </div>
                    <Progress value={8} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Volatile Organic Compounds</span>
                      <span className="text-sm text-gray-600">12.8 tonnes (6%)</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="sources" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Manufacturing Processes</span>
                      <span className="text-sm text-gray-600">131 tonnes (60%)</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Combustion Sources</span>
                      <span className="text-sm text-gray-600">65.5 tonnes (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Vehicle Fleet</span>
                      <span className="text-sm text-gray-600">15.3 tonnes (7%)</span>
                    </div>
                    <Progress value={7} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fugitive Emissions</span>
                      <span className="text-sm text-gray-600">6.7 tonnes (3%)</span>
                    </div>
                    <Progress value={3} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="compliance" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">EPA NAAQS Compliance</span>
                      <span className="text-sm text-green-600">100% compliant</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">WHO Air Quality Guidelines</span>
                      <span className="text-sm text-green-600">95% compliant</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Local Permit Limits</span>
                      <span className="text-sm text-green-600">98% within limits</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Continuous Monitoring</span>
                      <span className="text-sm text-blue-600">99.2% uptime</span>
                    </div>
                    <Progress value={99} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Air Quality Control Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Air Quality Control Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Emission Controls</label>
                  <Badge variant="outline">{parameters.emissionControls}%</Badge>
                </div>
                <Slider
                  value={[parameters.emissionControls]}
                  onValueChange={(value) => handleParameterChange('emissionControls', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Control technology efficiency
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Fuel Switching</label>
                  <Badge variant="outline">{parameters.fuelSwitching}%</Badge>
                </div>
                <Slider
                  value={[parameters.fuelSwitching]}
                  onValueChange={(value) => handleParameterChange('fuelSwitching', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Transition to cleaner fuels
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Process Optimization</label>
                  <Badge variant="outline">{parameters.processOptimization}%</Badge>
                </div>
                <Slider
                  value={[parameters.processOptimization]}
                  onValueChange={(value) => handleParameterChange('processOptimization', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Efficiency improvements
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Monitoring Enhancement</label>
                  <Badge variant="outline">{parameters.monitoringEnhancement}%</Badge>
                </div>
                <Slider
                  value={[parameters.monitoringEnhancement]}
                  onValueChange={(value) => handleParameterChange('monitoringEnhancement', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Monitoring accuracy and frequency
                </p>
              </div>

              <Button className="w-full esg-primary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Air Quality Targets & Health Impact */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Air Quality Targets & Health Impact Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-blue-600" />
                <span className="font-medium">NOx Reduction</span>
              </div>
              <p className="text-sm text-gray-600">
                40% reduction by 2030 vs 2020
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
                <Activity className="h-5 w-5 text-purple-600" />
                <span className="font-medium">PM2.5 Reduction</span>
              </div>
              <p className="text-sm text-gray-600">
                50% reduction by 2030 vs 2020
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>48%</span>
                </div>
                <Progress value={48} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium">Health Protection</span>
              </div>
              <p className="text-sm text-gray-600">
                Zero WHO guideline exceedances
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Compliance</span>
                  <span>95%</span>
                </div>
                <Progress value={95} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Wind className="h-5 w-5 text-cyan-600" />
                <span className="font-medium">Air Quality Index</span>
              </div>
              <p className="text-sm text-gray-600">
                Maintain "Good" AQI rating
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Average AQI</span>
                  <span>42</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
