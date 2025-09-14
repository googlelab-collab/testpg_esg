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
  HardHat, 
  Shield, 
  AlertTriangle, 
  Activity, 
  TrendingDown,
  Settings,
  FileText,
  Target,
  Users,
  Clock
} from "lucide-react";

const organizationId = 1;

export default function EmployeeSafety() {
  const [parameters, setParameters] = useState({
    safetyTraining: 85,
    incidentReduction: 60,
    safetyTechnology: 70,
    safetyCulture: 80,
  });

  const { data: safetyData, isLoading, error } = useQuery({
    queryKey: ["/api/social-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "safety") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load employee safety data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Safety Analytics</h1>
          <p className="text-gray-600 mt-1">
            Workplace safety management following ILO standards and OSHA requirements
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
                  title: 'Employee Safety & Health Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'OSHA Standards' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 88, environmentalScore: 78, socialScore: 92, governanceScore: 85,
                    keyAchievements: ['Zero fatalities achieved', '18% reduction in incident rate', 'OSHA VPP Star status maintained'],
                    keyRisks: ['High-risk operational areas', 'Contractor safety management', 'Mental health awareness gaps']
                  },
                  metrics: [
                    { category: 'social', metricName: 'Total Recordable Incident Rate', value: '0.45', unit: 'per 100 FTE', trend: 'down' as const },
                    { category: 'social', metricName: 'Lost Time Injury Rate', value: '0.12', unit: 'per 100 FTE', trend: 'down' as const },
                    { category: 'social', metricName: 'Safety Training Hours', value: '12.5', unit: 'hours/employee', trend: 'up' as const },
                    { category: 'social', metricName: 'Near Miss Reports', value: '1,247', unit: 'reports', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'OSHA Standards', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'ISO 45001', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance psychological safety programs', 'Expand contractor safety training', 'Implement predictive safety analytics']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Employee_Safety_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Safety Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Target className="h-4 w-4" />
            Set Safety Goals
          </Button>
        </div>
      </div>

      {/* Safety Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">TRIR</p>
                <p className="text-2xl font-bold text-green-600">0.45</p>
                <p className="text-xs text-green-600">-32% vs industry avg</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Total Recordable Incident Rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">DART Rate</p>
                <p className="text-2xl font-bold text-blue-600">0.18</p>
                <p className="text-xs text-green-600">-45% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Days Away, Restricted, Transfer</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Safety Training</p>
                <p className="text-2xl font-bold text-purple-600">42</p>
                <p className="text-xs text-purple-600">hours per employee</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <HardHat className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">annual training</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Zero Fatalities</p>
                <p className="text-2xl font-bold text-green-600">847</p>
                <p className="text-xs text-green-600">days without incident</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">safety milestone</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Safety Performance Metrics */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Safety Performance & Incident Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Safety Metrics</TabsTrigger>
                  <TabsTrigger value="incidents">Incident Types</TabsTrigger>
                  <TabsTrigger value="training">Training Coverage</TabsTrigger>
                </TabsList>
                
                <TabsContent value="metrics" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Total Recordable Incident Rate (TRIR)</span>
                      <span className="text-sm text-gray-600">0.45 vs 1.2 industry</span>
                    </div>
                    <Progress value={38} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Days Away Rate (DART)</span>
                      <span className="text-sm text-gray-600">0.18 vs 0.6 industry</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Near Miss Reporting Rate</span>
                      <span className="text-sm text-gray-600">8.2 per 100 employees</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Safety Observation Rate</span>
                      <span className="text-sm text-gray-600">15.6 per employee</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="incidents" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Slips, Trips & Falls</span>
                      <span className="text-sm text-gray-600">35% of incidents</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ergonomic Injuries</span>
                      <span className="text-sm text-gray-600">28% of incidents</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Equipment-Related</span>
                      <span className="text-sm text-gray-600">22% of incidents</span>
                    </div>
                    <Progress value={22} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Chemical Exposure</span>
                      <span className="text-sm text-gray-600">15% of incidents</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="training" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">General Safety Training</span>
                      <span className="text-sm text-gray-600">100% completion</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Job-Specific Training</span>
                      <span className="text-sm text-gray-600">96% completion</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Emergency Response</span>
                      <span className="text-sm text-gray-600">89% completion</span>
                    </div>
                    <Progress value={89} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Leadership Safety</span>
                      <span className="text-sm text-gray-600">92% completion</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Safety Program Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Safety Program Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Safety Training</label>
                  <Badge variant="outline">{parameters.safetyTraining}%</Badge>
                </div>
                <Slider
                  value={[parameters.safetyTraining]}
                  onValueChange={(value) => handleParameterChange('safetyTraining', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hours per employee annually
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Incident Reduction</label>
                  <Badge variant="outline">{parameters.incidentReduction}%</Badge>
                </div>
                <Slider
                  value={[parameters.incidentReduction]}
                  onValueChange={(value) => handleParameterChange('incidentReduction', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Target improvement in TRIR
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Safety Technology</label>
                  <Badge variant="outline">{parameters.safetyTechnology}%</Badge>
                </div>
                <Slider
                  value={[parameters.safetyTechnology]}
                  onValueChange={(value) => handleParameterChange('safetyTechnology', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Monitoring and protective equipment
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Safety Culture</label>
                  <Badge variant="outline">{parameters.safetyCulture}%</Badge>
                </div>
                <Slider
                  value={[parameters.safetyCulture]}
                  onValueChange={(value) => handleParameterChange('safetyCulture', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Behavior-based safety programs
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Safety Goals & Best Practices */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Safety Goals & Industry Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-green-600" />
                <span className="font-medium">Zero Harm Vision</span>
              </div>
              <p className="text-sm text-gray-600">
                Zero workplace fatalities and serious injuries
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Days Without Incident</span>
                  <span>847</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Training Excellence</span>
              </div>
              <p className="text-sm text-gray-600">
                40+ hours safety training per employee
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Achievement</span>
                  <span>105%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Safety Leadership</span>
              </div>
              <p className="text-sm text-gray-600">
                Leadership engagement in safety programs
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Participation</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                <span className="font-medium">ISO 45001</span>
              </div>
              <p className="text-sm text-gray-600">
                Occupational health & safety certification
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Compliance</span>
                  <span>Certified</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
