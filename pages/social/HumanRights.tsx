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
  Scale, 
  Shield, 
  Users, 
  MessageSquare, 
  CheckCircle,
  Settings,
  FileText,
  Target,
  AlertTriangle,
  Gavel
} from "lucide-react";

const organizationId = 1;

export default function HumanRights() {
  const [parameters, setParameters] = useState({
    assessmentCoverage: 85,
    stakeholderEngagement: 70,
    remediationPrograms: 75,
    policyImplementation: 90,
  });

  const { data: humanRightsData, isLoading, error } = useQuery({
    queryKey: ["/api/social-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "human_rights") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load human rights data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Rights Due Diligence</h1>
          <p className="text-gray-600 mt-1">
            Human rights management following UN Guiding Principles and OECD Guidelines
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            UNGP Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Target className="h-4 w-4" />
            Update Policy
          </Button>
        </div>
      </div>

      {/* Human Rights Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Assessment Coverage</p>
                <p className="text-2xl font-bold text-blue-600">92%</p>
                <p className="text-xs text-blue-600">of operations assessed</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">human rights impact</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Stakeholder Consultations</p>
                <p className="text-2xl font-bold text-green-600">847</p>
                <p className="text-xs text-green-600">+25% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <MessageSquare className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">community engagements</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Grievance Cases</p>
                <p className="text-2xl font-bold text-purple-600">45</p>
                <p className="text-xs text-purple-600">87% resolved</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Gavel className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">current year</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Training Coverage</p>
                <p className="text-2xl font-bold text-orange-600">98%</p>
                <p className="text-xs text-orange-600">of employees trained</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">human rights awareness</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Human Rights Framework */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                Human Rights Framework & Implementation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="ungp" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="ungp">UN Guiding Principles</TabsTrigger>
                  <TabsTrigger value="salient">Salient Issues</TabsTrigger>
                  <TabsTrigger value="grievance">Grievances</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ungp" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Policy Commitment</span>
                      <span className="text-sm text-gray-600">Fully implemented</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Due Diligence Process</span>
                      <span className="text-sm text-gray-600">92% coverage</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Remediation Mechanisms</span>
                      <span className="text-sm text-gray-600">87% effectiveness</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Transparency & Reporting</span>
                      <span className="text-sm text-gray-600">Annual disclosure</span>
                    </div>
                    <Progress value={95} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="salient" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Labor Rights</span>
                      <span className="text-sm text-gray-600">High priority</span>
                    </div>
                    <Progress value={85} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Land & Community Rights</span>
                      <span className="text-sm text-gray-600">Medium-high priority</span>
                    </div>
                    <Progress value={70} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Privacy & Data Protection</span>
                      <span className="text-sm text-gray-600">Medium priority</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Security & Safety</span>
                      <span className="text-sm text-gray-600">Medium priority</span>
                    </div>
                    <Progress value={55} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="grievance" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Cases Resolved</span>
                      <span className="text-sm text-gray-600">39 of 45 cases</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Average Resolution Time</span>
                      <span className="text-sm text-gray-600">45 days</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Stakeholder Satisfaction</span>
                      <span className="text-sm text-gray-600">4.2/5.0 rating</span>
                    </div>
                    <Progress value={84} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Repeat Issues</span>
                      <span className="text-sm text-gray-600">8% recurrence rate</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Human Rights Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Human Rights Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Assessment Coverage</label>
                  <Badge variant="outline">{parameters.assessmentCoverage}%</Badge>
                </div>
                <Slider
                  value={[parameters.assessmentCoverage]}
                  onValueChange={(value) => handleParameterChange('assessmentCoverage', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Operations assessed for impacts
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Stakeholder Engagement</label>
                  <Badge variant="outline">{parameters.stakeholderEngagement}%</Badge>
                </div>
                <Slider
                  value={[parameters.stakeholderEngagement]}
                  onValueChange={(value) => handleParameterChange('stakeholderEngagement', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Consultation frequency and depth
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Remediation Programs</label>
                  <Badge variant="outline">{parameters.remediationPrograms}%</Badge>
                </div>
                <Slider
                  value={[parameters.remediationPrograms]}
                  onValueChange={(value) => handleParameterChange('remediationPrograms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Effectiveness of remediation
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Policy Implementation</label>
                  <Badge variant="outline">{parameters.policyImplementation}%</Badge>
                </div>
                <Slider
                  value={[parameters.policyImplementation]}
                  onValueChange={(value) => handleParameterChange('policyImplementation', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Training and integration coverage
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Human Rights Performance & Commitments */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Human Rights Performance & Commitments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Zero Tolerance</span>
              </div>
              <p className="text-sm text-gray-600">
                Zero tolerance for human rights violations
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Compliance</span>
                  <span>99.2%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Access to Remedy</span>
              </div>
              <p className="text-sm text-gray-600">
                100% operations with grievance mechanisms
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
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Stakeholder Voice</span>
              </div>
              <p className="text-sm text-gray-600">
                Meaningful consultation and participation
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Satisfaction</span>
                  <span>4.2/5</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Continuous Improvement</span>
              </div>
              <p className="text-sm text-gray-600">
                Regular assessment and enhancement
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
