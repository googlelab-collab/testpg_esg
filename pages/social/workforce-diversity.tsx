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
  Users, 
  UserCheck, 
  TrendingUp, 
  Award, 
  Target,
  Settings,
  FileText,
  Briefcase,
  GraduationCap,
  Scale
} from "lucide-react";

const organizationId = 1;

export default function WorkforceDiversity() {
  const [parameters, setParameters] = useState({
    diversityTargets: 50,
    payEquityPrograms: 85,
    inclusiveHiring: 72,
    leadershipDevelopment: 68,
  });

  const { data: diversityData, isLoading, error } = useQuery({
    queryKey: [`/api/social-metrics/${organizationId}`],
    select: (data) => {
      if (!data || !Array.isArray(data)) return [];
      return data.filter((metric: any) => metric.metricType === "diversity");
    },
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load workforce diversity data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workforce Diversity Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Diversity, equity & inclusion tracking following UN Global Compact and EEOC standards
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Diversity Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Target className="h-4 w-4" />
            Set DEI Goals
          </Button>
        </div>
      </div>

      {/* Diversity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Gender Diversity</p>
                <p className="text-2xl font-bold text-blue-600">47%</p>
                <p className="text-xs text-green-600">+3% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ethnic Diversity</p>
                <p className="text-2xl font-bold text-purple-600">38%</p>
                <p className="text-xs text-green-600">+5% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Leadership Diversity</p>
                <p className="text-2xl font-bold text-green-600">42%</p>
                <p className="text-xs text-green-600">+8% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pay Equity Score</p>
                <p className="text-2xl font-bold text-yellow-600">94%</p>
                <p className="text-xs text-gray-500">gender pay gap</p>
              </div>
              <div className="w-12 h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                <Scale className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Diversity Metrics */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Diversity Metrics by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="gender" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="gender">Gender</TabsTrigger>
                  <TabsTrigger value="ethnicity">Ethnicity</TabsTrigger>
                  <TabsTrigger value="age">Age</TabsTrigger>
                  <TabsTrigger value="leadership">Leadership</TabsTrigger>
                </TabsList>
                
                <TabsContent value="gender" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Overall Workforce</span>
                      <span className="text-sm text-gray-600">47% women, 53% men</span>
                    </div>
                    <Progress value={47} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Senior Leadership</span>
                      <span className="text-sm text-gray-600">42% women, 58% men</span>
                    </div>
                    <Progress value={42} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Technical Roles</span>
                      <span className="text-sm text-gray-600">38% women, 62% men</span>
                    </div>
                    <Progress value={38} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">New Hires</span>
                      <span className="text-sm text-gray-600">52% women, 48% men</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="ethnicity" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Underrepresented Groups</span>
                      <span className="text-sm text-gray-600">38% of workforce</span>
                    </div>
                    <Progress value={38} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Hispanic/Latino</span>
                      <span className="text-sm text-gray-600">18% of workforce</span>
                    </div>
                    <Progress value={18} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Asian</span>
                      <span className="text-sm text-gray-600">22% of workforce</span>
                    </div>
                    <Progress value={22} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Black/African American</span>
                      <span className="text-sm text-gray-600">15% of workforce</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="age" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Under 30</span>
                      <span className="text-sm text-gray-600">28% of workforce</span>
                    </div>
                    <Progress value={28} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">30-50</span>
                      <span className="text-sm text-gray-600">52% of workforce</span>
                    </div>
                    <Progress value={52} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Over 50</span>
                      <span className="text-sm text-gray-600">20% of workforce</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="leadership" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">C-Suite</span>
                      <span className="text-sm text-gray-600">40% diverse</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">VP Level</span>
                      <span className="text-sm text-gray-600">45% diverse</span>
                    </div>
                    <Progress value={45} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Director Level</span>
                      <span className="text-sm text-gray-600">48% diverse</span>
                    </div>
                    <Progress value={48} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Manager Level</span>
                      <span className="text-sm text-gray-600">52% diverse</span>
                    </div>
                    <Progress value={52} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* DEI Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                DEI Program Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Diversity Targets</label>
                  <Badge variant="outline">{parameters.diversityTargets}%</Badge>
                </div>
                <Slider
                  value={[parameters.diversityTargets]}
                  onValueChange={(value) => handleParameterChange('diversityTargets', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Representation by level and function
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Pay Equity Programs</label>
                  <Badge variant="outline">{parameters.payEquityPrograms}%</Badge>
                </div>
                <Slider
                  value={[parameters.payEquityPrograms]}
                  onValueChange={(value) => handleParameterChange('payEquityPrograms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Pay gaps addressed
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Inclusive Hiring</label>
                  <Badge variant="outline">{parameters.inclusiveHiring}%</Badge>
                </div>
                <Slider
                  value={[parameters.inclusiveHiring]}
                  onValueChange={(value) => handleParameterChange('inclusiveHiring', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Diverse candidate slate requirements
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Leadership Development</label>
                  <Badge variant="outline">{parameters.leadershipDevelopment}%</Badge>
                </div>
                <Slider
                  value={[parameters.leadershipDevelopment]}
                  onValueChange={(value) => handleParameterChange('leadershipDevelopment', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Underrepresented groups in succession
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* DEI Goals & Benchmarks */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            DEI Goals & Industry Benchmarks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Gender Parity</span>
              </div>
              <p className="text-sm text-gray-600">
                50% representation by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Leadership Diversity</span>
              </div>
              <p className="text-sm text-gray-600">
                50% diverse leadership by 2030
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>84%</span>
                </div>
                <Progress value={84} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5 text-green-600" />
                <span className="font-medium">Pay Equity</span>
              </div>
              <p className="text-sm text-gray-600">
                100% pay equity by 2025
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>94%</span>
                </div>
                <Progress value={94} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-yellow-600" />
                <span className="font-medium">Development Programs</span>
              </div>
              <p className="text-sm text-gray-600">
                Mentorship and sponsorship coverage
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Coverage</span>
                  <span>68%</span>
                </div>
                <Progress value={68} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
