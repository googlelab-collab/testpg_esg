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
  Leaf, 
  Trees, 
  Bug, 
  Mountain,
  Settings,
  FileText,
  TrendingUp,
  Award,
  Target,
  MapPin
} from "lucide-react";

const organizationId = 1;

export default function BiodiversityImpact() {
  const [parameters, setParameters] = useState({
    habitatConservation: 65,
    speciesProtection: 42,
    restorationInvestment: 38,
    supplyChainBiodiversity: 55,
  });

  const { data: biodiversityData, isLoading, error } = useQuery({
    queryKey: ["/api/biodiversity", organizationId],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load biodiversity data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biodiversity Impact Assessor</h1>
          <p className="text-gray-600 mt-1">
            Biodiversity monitoring following CBD Global Framework and TNFD recommendations
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Biodiversity Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set Nature Targets
          </Button>
        </div>
      </div>

      {/* Biodiversity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Protected Areas</p>
                <p className="text-2xl font-bold text-green-600">15,420</p>
                <p className="text-xs text-green-600">+8.5% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Trees className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Species Supported</p>
                <p className="text-2xl font-bold text-blue-600">127</p>
                <p className="text-xs text-green-600">+12 vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Bug className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Habitat Restored</p>
                <p className="text-2xl font-bold text-purple-600">2,840</p>
                <p className="text-xs text-green-600">+15.2% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Mountain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Biodiversity Score</p>
                <p className="text-2xl font-bold text-orange-600">68</p>
                <p className="text-xs text-green-600">+4.2 vs last year</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Biodiversity Metrics */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="h-5 w-5" />
                Biodiversity Metrics by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="habitat" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="habitat">Habitat</TabsTrigger>
                  <TabsTrigger value="species">Species</TabsTrigger>
                  <TabsTrigger value="ecosystem">Ecosystem</TabsTrigger>
                  <TabsTrigger value="supply">Supply Chain</TabsTrigger>
                </TabsList>
                
                <TabsContent value="habitat" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Protected Areas</span>
                      <span className="text-sm text-gray-600">15,420 hectares</span>
                    </div>
                    <Progress value={65} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Restored Habitats</span>
                      <span className="text-sm text-gray-600">2,840 hectares</span>
                    </div>
                    <Progress value={38} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Corridors Created</span>
                      <span className="text-sm text-gray-600">1,250 hectares</span>
                    </div>
                    <Progress value={22} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Wetlands Protected</span>
                      <span className="text-sm text-gray-600">890 hectares</span>
                    </div>
                    <Progress value={18} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="species" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Threatened Species</span>
                      <span className="text-sm text-gray-600">42 species</span>
                    </div>
                    <Progress value={33} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Endemic Species</span>
                      <span className="text-sm text-gray-600">18 species</span>
                    </div>
                    <Progress value={14} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Keystone Species</span>
                      <span className="text-sm text-gray-600">8 species</span>
                    </div>
                    <Progress value={6} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Pollinators</span>
                      <span className="text-sm text-gray-600">59 species</span>
                    </div>
                    <Progress value={47} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="ecosystem" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Forest Ecosystems</span>
                      <span className="text-sm text-gray-600">8,940 hectares</span>
                    </div>
                    <Progress value={58} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Grassland Ecosystems</span>
                      <span className="text-sm text-gray-600">3,720 hectares</span>
                    </div>
                    <Progress value={24} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Aquatic Ecosystems</span>
                      <span className="text-sm text-gray-600">1,890 hectares</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Urban Ecosystems</span>
                      <span className="text-sm text-gray-600">870 hectares</span>
                    </div>
                    <Progress value={6} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="supply" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Certified Suppliers</span>
                      <span className="text-sm text-gray-600">55% of spend</span>
                    </div>
                    <Progress value={55} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Deforestation-Free</span>
                      <span className="text-sm text-gray-600">78% of commodities</span>
                    </div>
                    <Progress value={78} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Sustainable Sourcing</span>
                      <span className="text-sm text-gray-600">62% of materials</span>
                    </div>
                    <Progress value={62} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Biodiversity Assessments</span>
                      <span className="text-sm text-gray-600">89% of suppliers</span>
                    </div>
                    <Progress value={89} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Biodiversity Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Biodiversity Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Habitat Conservation</label>
                  <Badge variant="outline">{parameters.habitatConservation}%</Badge>
                </div>
                <Slider
                  value={[parameters.habitatConservation]}
                  onValueChange={(value) => handleParameterChange('habitatConservation', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  % of operations in protected areas
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Species Protection</label>
                  <Badge variant="outline">{parameters.speciesProtection}%</Badge>
                </div>
                <Slider
                  value={[parameters.speciesProtection]}
                  onValueChange={(value) => handleParameterChange('speciesProtection', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Number of threatened species supported
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Restoration Investment</label>
                  <Badge variant="outline">{parameters.restorationInvestment}%</Badge>
                </div>
                <Slider
                  value={[parameters.restorationInvestment]}
                  onValueChange={(value) => handleParameterChange('restorationInvestment', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Hectares of habitat restored
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Supply Chain Biodiversity</label>
                  <Badge variant="outline">{parameters.supplyChainBiodiversity}%</Badge>
                </div>
                <Slider
                  value={[parameters.supplyChainBiodiversity]}
                  onValueChange={(value) => handleParameterChange('supplyChainBiodiversity', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  % suppliers with biodiversity policies
                </p>
              </div>

              <Button className="w-full esg-primary">
                Update Nature Strategy
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Nature-Based Solutions */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Nature-Based Solutions & Targets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trees className="h-5 w-5 text-green-600" />
                <span className="font-medium">Net Positive Impact</span>
              </div>
              <p className="text-sm text-gray-600">
                Net positive biodiversity by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>42%</span>
                </div>
                <Progress value={42} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Mountain className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Habitat Restoration</span>
              </div>
              <p className="text-sm text-gray-600">
                5,000 hectares restored by 2028
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
                <Bug className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Species Conservation</span>
              </div>
              <p className="text-sm text-gray-600">
                200 species protection programs
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>64%</span>
                </div>
                <Progress value={64} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
