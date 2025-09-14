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
  Building, 
  Shield, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Settings,
  FileText,
  Target,
  Search,
  Clock
} from "lucide-react";

const organizationId = 1;

export default function SupplyChainLabor() {
  const [parameters, setParameters] = useState({
    supplierAudits: 80,
    laborCompliance: 75,
    workerVoice: 65,
    capacityBuilding: 70,
  });

  const { data: supplyChainData, isLoading, error } = useQuery({
    queryKey: ["/api/social-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "supply_chain") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load supply chain labor data" />;

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
            Supply chain labor monitoring following ILO Core Labour Standards and UN Guiding Principles
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Labor Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Target className="h-4 w-4" />
            Set Labor Standards
          </Button>
        </div>
      </div>

      {/* Supply Chain Labor Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Suppliers Audited</p>
                <p className="text-2xl font-bold text-green-600">89%</p>
                <p className="text-xs text-green-600">of critical suppliers</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Search className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">annual audit coverage</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ILO Compliance</p>
                <p className="text-2xl font-bold text-blue-600">94%</p>
                <p className="text-xs text-blue-600">core standards met</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">supplier compliance rate</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Worker Voice</p>
                <p className="text-2xl font-bold text-purple-600">76%</p>
                <p className="text-xs text-purple-600">grievance systems</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">suppliers with programs</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Training Hours</p>
                <p className="text-2xl font-bold text-orange-600">28,540</p>
                <p className="text-xs text-orange-600">capacity building</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">across supply chain</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Labor Standards Monitoring */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Labor Standards Monitoring & Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="compliance" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="compliance">ILO Standards</TabsTrigger>
                  <TabsTrigger value="audits">Audit Results</TabsTrigger>
                  <TabsTrigger value="remediation">Remediation</TabsTrigger>
                </TabsList>
                
                <TabsContent value="compliance" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Freedom of Association</span>
                      <span className="text-sm text-gray-600">96% compliance</span>
                    </div>
                    <Progress value={96} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Forced Labor Prevention</span>
                      <span className="text-sm text-gray-600">98% compliance</span>
                    </div>
                    <Progress value={98} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Child Labor Prevention</span>
                      <span className="text-sm text-gray-600">99% compliance</span>
                    </div>
                    <Progress value={99} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Non-discrimination</span>
                      <span className="text-sm text-gray-600">92% compliance</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="audits" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Low Risk Suppliers</span>
                      <span className="text-sm text-gray-600">342 suppliers (65%)</span>
                    </div>
                    <Progress value={65} className="h-2 bg-green-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Medium Risk Suppliers</span>
                      <span className="text-sm text-gray-600">134 suppliers (25%)</span>
                    </div>
                    <Progress value={25} className="h-2 bg-yellow-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">High Risk Suppliers</span>
                      <span className="text-sm text-gray-600">45 suppliers (8%)</span>
                    </div>
                    <Progress value={8} className="h-2 bg-orange-100" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Critical Issues</span>
                      <span className="text-sm text-gray-600">5 suppliers (1%)</span>
                    </div>
                    <Progress value={1} className="h-2 bg-red-100" />
                  </div>
                </TabsContent>
                
                <TabsContent value="remediation" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Issues Resolved</span>
                      <span className="text-sm text-gray-600">87% within 90 days</span>
                    </div>
                    <Progress value={87} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Corrective Action Plans</span>
                      <span className="text-sm text-gray-600">45 active plans</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Follow-up Audits</span>
                      <span className="text-sm text-gray-600">92% completion rate</span>
                    </div>
                    <Progress value={92} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Supplier Terminations</span>
                      <span className="text-sm text-gray-600">3 due to non-compliance</span>
                    </div>
                    <Progress value={5} className="h-2 bg-red-100" />
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
                  <label className="text-sm font-medium">Supplier Audits</label>
                  <Badge variant="outline">{parameters.supplierAudits}%</Badge>
                </div>
                <Slider
                  value={[parameters.supplierAudits]}
                  onValueChange={(value) => handleParameterChange('supplierAudits', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Annual audit frequency
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Labor Compliance</label>
                  <Badge variant="outline">{parameters.laborCompliance}%</Badge>
                </div>
                <Slider
                  value={[parameters.laborCompliance]}
                  onValueChange={(value) => handleParameterChange('laborCompliance', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  ILO core standards compliance
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Worker Voice</label>
                  <Badge variant="outline">{parameters.workerVoice}%</Badge>
                </div>
                <Slider
                  value={[parameters.workerVoice]}
                  onValueChange={(value) => handleParameterChange('workerVoice', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Grievance mechanisms coverage
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Capacity Building</label>
                  <Badge variant="outline">{parameters.capacityBuilding}%</Badge>
                </div>
                <Slider
                  value={[parameters.capacityBuilding]}
                  onValueChange={(value) => handleParameterChange('capacityBuilding', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Training and certification programs
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Supply Chain Labor Goals */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Supply Chain Labor Goals & Best Practices
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
                Zero forced and child labor tolerance
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Compliance</span>
                  <span>99%</span>
                </div>
                <Progress value={99} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Worker Protection</span>
              </div>
              <p className="text-sm text-gray-600">
                100% supplier coverage with grievance systems
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Coverage</span>
                  <span>76%</span>
                </div>
                <Progress value={76} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Capacity Building</span>
              </div>
              <p className="text-sm text-gray-600">
                50,000 training hours by 2025
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>57%</span>
                </div>
                <Progress value={57} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Risk Assessment</span>
              </div>
              <p className="text-sm text-gray-600">
                100% high-risk region coverage
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Coverage</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
