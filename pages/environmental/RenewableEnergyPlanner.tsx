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
  Settings,
  FileText,
  TrendingUp,
  Award,
  Target,
  Calendar,
  DollarSign
} from "lucide-react";

const organizationId = 1;

export default function RenewableEnergyPlanner() {
  const [parameters, setParameters] = useState({
    renewableTargets: 75,
    powerPurchaseAgreements: 45,
    onsiteGeneration: 32,
    gridDecarbonization: 28,
  });

  const { data: renewableData, isLoading, error } = useQuery({
    queryKey: ["/api/renewable-energy", organizationId],
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
            Renewable energy planning following RE100 initiative and IEA Net Zero roadmap
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            RE100 Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set SBT Targets
          </Button>
        </div>
      </div>

      {/* Renewable Energy Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renewable %</p>
                <p className="text-2xl font-bold text-green-600">45%</p>
                <p className="text-xs text-green-600">+12.3% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Sun className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Solar Capacity</p>
                <p className="text-2xl font-bold text-yellow-600">25.4</p>
                <p className="text-xs text-green-600">+8.7 MW vs last year</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Sun className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Wind Capacity</p>
                <p className="text-2xl font-bold text-blue-600">18.2</p>
                <p className="text-xs text-green-600">+5.1 MW vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Cost Savings</p>
                <p className="text-2xl font-bold text-purple-600">$3.2M</p>
                <p className="text-xs text-green-600">+22.5% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
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
                <Zap className="h-5 w-5" />
                Renewable Energy Portfolio & Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="current" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="current">Current Mix</TabsTrigger>
                  <TabsTrigger value="planned">Planned Projects</TabsTrigger>
                  <TabsTrigger value="roadmap">2030 Roadmap</TabsTrigger>
                </TabsList>
                
                <TabsContent value="current" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Solar Power</span>
                      <span className="text-sm text-gray-600">32,400 MWh (58%)</span>
                    </div>
                    <Progress value={58} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wind Power</span>
                      <span className="text-sm text-gray-600">18,200 MWh (33%)</span>
                    </div>
                    <Progress value={33} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hydroelectric</span>
                      <span className="text-sm text-gray-600">4,800 MWh (9%)</span>
                    </div>
                    <Progress value={9} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="planned" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Solar Expansion Phase 2</span>
                      <span className="text-sm text-gray-600">15.5 MW by Q2 2025</span>
                    </div>
                    <Progress value={68} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wind Farm Partnership</span>
                      <span className="text-sm text-gray-600">25.0 MW by Q4 2025</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Battery Storage</span>
                      <span className="text-sm text-gray-600">8.2 MWh by Q3 2025</span>
                    </div>
                    <Progress value={52} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Green PPAs</span>
                      <span className="text-sm text-gray-600">45.0 MW by Q1 2026</span>
                    </div>
                    <Progress value={22} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="roadmap" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">2025 Target</span>
                      <span className="text-sm text-gray-600">60% renewable</span>
                    </div>
                    <Progress value={75} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">2027 Target</span>
                      <span className="text-sm text-gray-600">80% renewable</span>
                    </div>
                    <Progress value={47} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">2030 Target</span>
                      <span className="text-sm text-gray-600">100% renewable</span>
                    </div>
                    <Progress value={28} className="h-2" />
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
                RE Planning Parameters
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
                  % renewable by year, technology mix
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
                  Contract duration, pricing
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">On-site Generation</label>
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
                  Solar, wind capacity additions
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
                Update RE Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* RE100 Commitment Progress */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            RE100 Commitment & SBT Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sun className="h-5 w-5 text-green-600" />
                <span className="font-medium">RE100 Target</span>
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
                <Battery className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Energy Storage</span>
              </div>
              <p className="text-sm text-gray-600">
                Grid stability and backup capacity
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Capacity</span>
                  <span>8.2 MWh</span>
                </div>
                <Progress value={65} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Timeline Adherence</span>
              </div>
              <p className="text-sm text-gray-600">
                On track for 2030 commitment
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Schedule</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
