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
  Factory, 
  Shield, 
  Users, 
  AlertTriangle, 
  Target,
  Settings,
  FileText,
  CheckCircle,
  Clock,
  GraduationCap
} from "lucide-react";

const organizationId = 1;

export default function SupplyChainLabor() {
  const [parameters, setParameters] = useState({
    supplierAuditFrequency: 78,
    laborStandardsCompliance: 85,
    workerVoiceMechanisms: 62,
    capacityBuildingPrograms: 70,
  });

  const { data: laborData, isLoading, error } = useQuery({
    queryKey: [`/api/social-metrics/${organizationId}?metricType=supply_chain`],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner message="Loading supply chain labor data..." />;
  if (error) {
    console.error("Supply chain labor data error:", error);
    // Still show the page with mock data if API fails
  }

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Labor Monitor</h1>
          <p className="text-gray-600 mt-1">
            Labor standards monitoring following ILO Core Labour Standards and UN Global Compact principles
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Labor Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Shield className="h-4 w-4" />
            Audit Schedule
          </Button>
        </div>
      </div>

      {/* Labor Standards Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Supplier Compliance</p>
                <p className="text-2xl font-bold text-green-600">85%</p>
                <p className="text-xs text-gray-500">ILO core standards</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Audited Suppliers</p>
                <p className="text-2xl font-bold text-blue-600">78%</p>
                <p className="text-xs text-gray-500">annually</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Worker Voice</p>
                <p className="text-2xl font-bold text-purple-600">62%</p>
                <p className="text-xs text-gray-500">grievance mechanisms</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Training Hours</p>
                <p className="text-2xl font-bold text-yellow-600">2,850</p>
                <p className="text-xs text-gray-500">supplier capacity building</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Labor Standards Compliance */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Labor Standards Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="standards" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="standards">ILO Standards</TabsTrigger>
                  <TabsTrigger value="audits">Audit Results</TabsTrigger>
                  <TabsTrigger value="risks">Risk Assessment</TabsTrigger>
                  <TabsTrigger value="remediation">Remediation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="standards" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Freedom of Association</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">92% Compliant</Badge>
                    </div>
                    <Progress value={92} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Forced Labor Elimination</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">89% Compliant</Badge>
                    </div>
                    <Progress value={89} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Child Labor Prohibition</span>
                      <Badge variant="outline" className="text-green-600 border-green-600">96% Compliant</Badge>
                    </div>
                    <Progress value={96} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Non-Discrimination</span>
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">74% Compliant</Badge>
                    </div>
                    <Progress value={74} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="audits" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tier 1 Suppliers</span>
                      <span className="text-sm text-gray-600">95% audited</span>
                    </div>
                    <Progress value={95} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Tier 2 Suppliers</span>
                      <span className="text-sm text-gray-600">68% audited</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Critical Suppliers</span>
                      <span className="text-sm text-gray-600">100% audited</span>
                    </div>
                    <Progress value={100} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">High-Risk Regions</span>
                      <span className="text-sm text-gray-600">88% audited</span>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="risks" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">High Risk</span>
                      <span className="text-sm text-red-600">12% of suppliers</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Medium Risk</span>
                      <span className="text-sm text-yellow-600">28% of suppliers</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Low Risk</span>
                      <span className="text-sm text-green-600">60% of suppliers</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="remediation" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Remediation Plans</span>
                      <span className="text-sm text-gray-600">45 suppliers</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Completed Actions</span>
                      <span className="text-sm text-gray-600">127 issues resolved</span>
                    </div>
                    <Progress value={82} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Follow-up Audits</span>
                      <span className="text-sm text-gray-600">38 conducted</span>
                    </div>
                    <Progress value={68} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Labor Monitoring Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Labor Monitoring Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Supplier Audit Frequency</label>
                  <Badge variant="outline">{parameters.supplierAuditFrequency}%</Badge>
                </div>
                <Slider
                  value={[parameters.supplierAuditFrequency]}
                  onValueChange={(value) => handleParameterChange('supplierAuditFrequency', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suppliers audited annually, audit depth
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Labor Standards Compliance</label>
                  <Badge variant="outline">{parameters.laborStandardsCompliance}%</Badge>
                </div>
                <Slider
                  value={[parameters.laborStandardsCompliance]}
                  onValueChange={(value) => handleParameterChange('laborStandardsCompliance', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suppliers meeting ILO core standards
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Worker Voice Mechanisms</label>
                  <Badge variant="outline">{parameters.workerVoiceMechanisms}%</Badge>
                </div>
                <Slider
                  value={[parameters.workerVoiceMechanisms]}
                  onValueChange={(value) => handleParameterChange('workerVoiceMechanisms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Grievance procedures, worker surveys
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Capacity Building</label>
                  <Badge variant="outline">{parameters.capacityBuildingPrograms}%</Badge>
                </div>
                <Slider
                  value={[parameters.capacityBuildingPrograms]}
                  onValueChange={(value) => handleParameterChange('capacityBuildingPrograms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Training hours, certification requirements
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Labor Standards Targets */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Labor Standards Targets & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium">ILO Compliance</span>
              </div>
              <p className="text-sm text-gray-600">
                100% supplier compliance by 2026
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Factory className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Audit Coverage</span>
              </div>
              <p className="text-sm text-gray-600">
                90% supplier audit coverage
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>87%</span>
                </div>
                <Progress value={87} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Worker Voice</span>
              </div>
              <p className="text-sm text-gray-600">
                Grievance mechanisms for 80% suppliers
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Remediation Time</span>
              </div>
              <p className="text-sm text-gray-600">
                90-day issue resolution target
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Average: 72 days</span>
                  <span>80%</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
