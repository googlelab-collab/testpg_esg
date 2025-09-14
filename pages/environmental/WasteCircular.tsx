import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImpactCalculator } from "@/components/esg/impact-calculator";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { 
  Recycle, 
  TrendingUp, 
  Trash2, 
  RotateCcw, 
  Package,
  Settings,
  FileText,
  Target,
  Leaf
} from "lucide-react";

const organizationId = 1;

export default function WasteCircular() {
  const [parameters, setParameters] = useState({
    wasteDiversion: 75,
    circularDesign: 45,
    materialRecovery: 60,
    packagingOptimization: 80,
  });

  const { data: wasteData, isLoading, error } = useQuery({
    queryKey: ["/api/environmental-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "waste_generation") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load waste & circular economy data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Waste & Circular Economy Hub</h1>
          <p className="text-gray-600 mt-1">
            Circular economy principles following Ellen MacArthur Foundation framework and ISO 14040 LCA
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Circularity Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set Zero Waste Goals
          </Button>
        </div>
      </div>

      {/* Waste Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Waste Generated</p>
                <p className="text-2xl font-bold text-gray-900">2,840</p>
                <p className="text-xs text-green-600">-15.2% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">tonnes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Diversion Rate</p>
                <p className="text-2xl font-bold text-green-600">87%</p>
                <p className="text-xs text-green-600">+8% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Recycle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">diverted from landfill</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Circularity Index</p>
                <p className="text-2xl font-bold text-purple-600">42%</p>
                <p className="text-xs text-green-600">+12% vs baseline</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <RotateCcw className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">material circularity</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Packaging Reduction</p>
                <p className="text-2xl font-bold text-blue-600">28%</p>
                <p className="text-xs text-green-600">vs 2020 baseline</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">material reduction</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Waste Streams & Circularity */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Recycle className="h-5 w-5" />
                Waste Streams & Circular Material Flows
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="streams" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="streams">Waste Streams</TabsTrigger>
                  <TabsTrigger value="circular">Circular Flows</TabsTrigger>
                  <TabsTrigger value="recovery">Recovery Methods</TabsTrigger>
                </TabsList>
                
                <TabsContent value="streams" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Packaging Materials</span>
                      <span className="text-sm text-gray-600">1,420 tonnes (50%)</span>
                    </div>
                    <Progress value={50} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Manufacturing Waste</span>
                      <span className="text-sm text-gray-600">852 tonnes (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Office Waste</span>
                      <span className="text-sm text-gray-600">284 tonnes (10%)</span>
                    </div>
                    <Progress value={10} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Electronic Waste</span>
                      <span className="text-sm text-gray-600">142 tonnes (5%)</span>
                    </div>
                    <Progress value={5} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Organic Waste</span>
                      <span className="text-sm text-gray-600">142 tonnes (5%)</span>
                    </div>
                    <Progress value={5} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="circular" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Reused Materials</span>
                      <span className="text-sm text-gray-600">1,194 tonnes (42%)</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recycled Content Input</span>
                      <span className="text-sm text-gray-600">2,556 tonnes (58%)</span>
                    </div>
                    <Progress value={58} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Closed-Loop Systems</span>
                      <span className="text-sm text-gray-600">852 tonnes (30%)</span>
                    </div>
                    <Progress value={30} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Design for Circularity</span>
                      <span className="text-sm text-gray-600">45% of new products</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="recovery" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Recycling</span>
                      <span className="text-sm text-gray-600">1,704 tonnes (60%)</span>
                    </div>
                    <Progress value={60} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Composting</span>
                      <span className="text-sm text-gray-600">568 tonnes (20%)</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Energy Recovery</span>
                      <span className="text-sm text-gray-600">284 tonnes (10%)</span>
                    </div>
                    <Progress value={10} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Donation/Reuse</span>
                      <span className="text-sm text-gray-600">142 tonnes (5%)</span>
                    </div>
                    <Progress value={5} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Landfill</span>
                      <span className="text-sm text-gray-600">142 tonnes (5%)</span>
                    </div>
                    <Progress value={5} className="h-2 bg-red-100" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Circular Economy Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Circular Economy Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Waste Diversion Rate</label>
                  <Badge variant="outline">{parameters.wasteDiversion}%</Badge>
                </div>
                <Slider
                  value={[parameters.wasteDiversion]}
                  onValueChange={(value) => handleParameterChange('wasteDiversion', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Percentage diverted from landfill
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Circular Design</label>
                  <Badge variant="outline">{parameters.circularDesign}%</Badge>
                </div>
                <Slider
                  value={[parameters.circularDesign]}
                  onValueChange={(value) => handleParameterChange('circularDesign', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Products designed for circularity
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Material Recovery</label>
                  <Badge variant="outline">{parameters.materialRecovery}%</Badge>
                </div>
                <Slider
                  value={[parameters.materialRecovery]}
                  onValueChange={(value) => handleParameterChange('materialRecovery', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Recycling rate improvements
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Packaging Optimization</label>
                  <Badge variant="outline">{parameters.packagingOptimization}%</Badge>
                </div>
                <Slider
                  value={[parameters.packagingOptimization]}
                  onValueChange={(value) => handleParameterChange('packagingOptimization', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Reduction in packaging materials
                </p>
              </div>

              <Button className="w-full esg-primary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Zero Waste Goals & Circular Targets */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Zero Waste Goals & Circular Economy Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                <span className="font-medium">Zero Waste to Landfill</span>
              </div>
              <p className="text-sm text-gray-600">
                95% diversion rate by 2025
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>92%</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Circularity Rate</span>
              </div>
              <p className="text-sm text-gray-600">
                60% material circularity by 2030
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
                <Package className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Packaging Reduction</span>
              </div>
              <p className="text-sm text-gray-600">
                50% reduction in packaging by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>56%</span>
                </div>
                <Progress value={56} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-500" />
                <span className="font-medium">Sustainable Materials</span>
              </div>
              <p className="text-sm text-gray-600">
                80% sustainable material sourcing
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Impact Calculator */}
      <ImpactCalculator 
        parameters={[]} 
        organizationId={organizationId} 
        category="environmental" 
      />
    </div>
  );
}
