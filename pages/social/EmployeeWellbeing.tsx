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
  Heart, 
  Activity, 
  Clock, 
  Brain, 
  TrendingUp,
  Settings,
  FileText,
  Target,
  Users,
  Smile
} from "lucide-react";

const organizationId = 1;

export default function EmployeeWellbeing() {
  const [parameters, setParameters] = useState({
    wellbeingPrograms: 80,
    mentalHealthSupport: 75,
    workLifeBalance: 85,
    healthSafetyCulture: 90,
  });

  const { data: wellbeingData, isLoading, error } = useQuery({
    queryKey: ["/api/social-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "wellbeing") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load employee wellbeing data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Wellbeing Center</h1>
          <p className="text-gray-600 mt-1">
            Employee wellbeing following WHO Healthy Workplace Framework and ISO 45003 standards
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
                  title: 'Employee Wellbeing & Mental Health Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'WHO Workplace Health' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 85, environmentalScore: 78, socialScore: 90, governanceScore: 82,
                    keyAchievements: ['87% employee engagement score', 'Mental health support expanded', '95% health program participation'],
                    keyRisks: ['Work-life balance challenges', 'Mental health stigma', 'Remote work wellbeing gaps']
                  },
                  metrics: [
                    { category: 'social', metricName: 'Employee Engagement', value: '87', unit: '%', trend: 'up' as const },
                    { category: 'social', metricName: 'Mental Health Support Usage', value: '32', unit: '%', trend: 'up' as const },
                    { category: 'social', metricName: 'Wellness Program Participation', value: '95', unit: '%', trend: 'up' as const },
                    { category: 'social', metricName: 'Employee Turnover Rate', value: '8.5', unit: '%', trend: 'down' as const }
                  ],
                  complianceStatus: [
                    { framework: 'WHO Workplace Health', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'Mental Health First Aid', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance remote work support', 'Expand mental health resources', 'Implement flexible work arrangements']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Employee_Wellbeing_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Wellbeing Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Target className="h-4 w-4" />
            Set Wellbeing Goals
          </Button>
        </div>
      </div>

      {/* Wellbeing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Engagement Score</p>
                <p className="text-2xl font-bold text-green-600">8.2</p>
                <p className="text-xs text-green-600">+0.5 vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Smile className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">out of 10 scale</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">EAP Utilization</p>
                <p className="text-2xl font-bold text-blue-600">18%</p>
                <p className="text-xs text-blue-600">above industry avg</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Employee Assistance Program</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Flexible Work</p>
                <p className="text-2xl font-bold text-purple-600">89%</p>
                <p className="text-xs text-purple-600">employee satisfaction</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">work-life balance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Health Programs</p>
                <p className="text-2xl font-bold text-orange-600">94%</p>
                <p className="text-xs text-orange-600">participation rate</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">wellness initiatives</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Wellbeing Metrics */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Employee Wellbeing Metrics & Programs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="engagement" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="engagement">Engagement</TabsTrigger>
                  <TabsTrigger value="mental">Mental Health</TabsTrigger>
                  <TabsTrigger value="physical">Physical Health</TabsTrigger>
                </TabsList>
                
                <TabsContent value="engagement" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Engagement</span>
                      <span className="text-sm text-gray-600">8.2/10 (Top 25%)</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Job Satisfaction</span>
                      <span className="text-sm text-gray-600">8.5/10</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Work-Life Balance</span>
                      <span className="text-sm text-gray-600">7.8/10</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Career Development</span>
                      <span className="text-sm text-gray-600">7.6/10</span>
                    </div>
                    <Progress value={76} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="mental" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">EAP Utilization</span>
                      <span className="text-sm text-gray-600">18% (vs 12% industry)</span>
                    </div>
                    <Progress value={18} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Mental Health Days</span>
                      <span className="text-sm text-gray-600">4.2 days average</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Stress Management</span>
                      <span className="text-sm text-gray-600">76% satisfaction</span>
                    </div>
                    <Progress value={76} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Manager Training</span>
                      <span className="text-sm text-gray-600">94% completion</span>
                    </div>
                    <Progress value={94} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="physical" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wellness Program Participation</span>
                      <span className="text-sm text-gray-600">94% enrollment</span>
                    </div>
                    <Progress value={94} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Fitness Center Usage</span>
                      <span className="text-sm text-gray-600">45% regular users</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Health Screenings</span>
                      <span className="text-sm text-gray-600">87% participation</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Ergonomic Assessments</span>
                      <span className="text-sm text-gray-600">68% completed</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Wellbeing Program Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Wellbeing Program Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Wellbeing Programs</label>
                  <Badge variant="outline">{parameters.wellbeingPrograms}%</Badge>
                </div>
                <Slider
                  value={[parameters.wellbeingPrograms]}
                  onValueChange={(value) => handleParameterChange('wellbeingPrograms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Employee coverage and scope
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Mental Health Support</label>
                  <Badge variant="outline">{parameters.mentalHealthSupport}%</Badge>
                </div>
                <Slider
                  value={[parameters.mentalHealthSupport]}
                  onValueChange={(value) => handleParameterChange('mentalHealthSupport', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  EAP utilization and resources
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Work-Life Balance</label>
                  <Badge variant="outline">{parameters.workLifeBalance}%</Badge>
                </div>
                <Slider
                  value={[parameters.workLifeBalance]}
                  onValueChange={(value) => handleParameterChange('workLifeBalance', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Flexible work options and policies
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Health & Safety Culture</label>
                  <Badge variant="outline">{parameters.healthSafetyCulture}%</Badge>
                </div>
                <Slider
                  value={[parameters.healthSafetyCulture]}
                  onValueChange={(value) => handleParameterChange('healthSafetyCulture', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Psychological safety and wellness culture
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Wellbeing Goals & Benchmarks */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Wellbeing Goals & Industry Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium">Engagement Excellence</span>
              </div>
              <p className="text-sm text-gray-600">
                Top 10% engagement scores by 2025
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Current Position</span>
                  <span>Top 25%</span>
                </div>
                <Progress value={75} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Mental Health Support</span>
              </div>
              <p className="text-sm text-gray-600">
                25% EAP utilization target
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
                <Clock className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Work-Life Integration</span>
              </div>
              <p className="text-sm text-gray-600">
                90% satisfaction with flexibility
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Achievement</span>
                  <span>99%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Wellness Participation</span>
              </div>
              <p className="text-sm text-gray-600">
                95% wellness program engagement
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Participation</span>
                  <span>99%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
