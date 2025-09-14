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
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp,
  Settings,
  FileText,
  Target,
  MapPin,
  Building
} from "lucide-react";

const organizationId = 1;

export default function CommunityImpact() {
  const [parameters, setParameters] = useState({
    communityInvestment: 75,
    localHiring: 60,
    supplierDiversity: 55,
    educationPrograms: 80,
  });

  const { data: communityData, isLoading, error } = useQuery({
    queryKey: ["/api/social-metrics", organizationId],
    select: (data) => data?.filter((metric: any) => metric.metricType === "community") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load community impact data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Impact Tracker</h1>
          <p className="text-gray-600 mt-1">
            Community investment tracking following UN SDGs and London Benchmarking Group methodology
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
                  title: 'Community Impact & Investment Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'LBG Framework' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 82, environmentalScore: 76, socialScore: 88, governanceScore: 79,
                    keyAchievements: ['$2.4M community investment', '15,000 volunteer hours', 'Local hiring 65% of workforce'],
                    keyRisks: ['Community relations challenges', 'Social license to operate', 'Local economic dependencies']
                  },
                  metrics: [
                    { category: 'social', metricName: 'Community Investment', value: '2.4', unit: 'M USD', trend: 'up' as const },
                    { category: 'social', metricName: 'Volunteer Hours', value: '15,000', unit: 'hours', trend: 'up' as const },
                    { category: 'social', metricName: 'Local Hiring Rate', value: '65', unit: '%', trend: 'up' as const },
                    { category: 'social', metricName: 'Community Programs', value: '23', unit: 'active programs', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'LBG Framework', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'UN Global Compact', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Expand education partnerships', 'Enhance local procurement', 'Strengthen community engagement processes']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Community_Impact_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Impact Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Target className="h-4 w-4" />
            Set Community Goals
          </Button>
        </div>
      </div>

      {/* Community Impact Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Community Investment</p>
                <p className="text-2xl font-bold text-green-600">$4.2M</p>
                <p className="text-xs text-green-600">1.8% of pre-tax profits</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">annual investment</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Local Hiring</p>
                <p className="text-2xl font-bold text-blue-600">68%</p>
                <p className="text-xs text-blue-600">from local communities</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">of total workforce</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Supplier Diversity</p>
                <p className="text-2xl font-bold text-purple-600">35%</p>
                <p className="text-xs text-green-600">+8% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">diverse supplier spend</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Education Beneficiaries</p>
                <p className="text-2xl font-bold text-orange-600">15,240</p>
                <p className="text-xs text-orange-600">students supported</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <GraduationCap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">across all programs</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Community Programs */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Community Programs & Initiatives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="programs" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="programs">Investment Areas</TabsTrigger>
                  <TabsTrigger value="sdgs">SDG Alignment</TabsTrigger>
                  <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
                </TabsList>
                
                <TabsContent value="programs" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Education & Skills Development</span>
                      <span className="text-sm text-gray-600">$1.7M (40%)</span>
                    </div>
                    <Progress value={40} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Healthcare & Wellbeing</span>
                      <span className="text-sm text-gray-600">$1.1M (26%)</span>
                    </div>
                    <Progress value={26} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Economic Development</span>
                      <span className="text-sm text-gray-600">$0.8M (19%)</span>
                    </div>
                    <Progress value={19} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Environmental Conservation</span>
                      <span className="text-sm text-gray-600">$0.6M (15%)</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="sdgs" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">SDG 4: Quality Education</span>
                      <span className="text-sm text-gray-600">35% of programs</span>
                    </div>
                    <Progress value={35} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">SDG 3: Good Health</span>
                      <span className="text-sm text-gray-600">25% of programs</span>
                    </div>
                    <Progress value={25} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">SDG 8: Decent Work</span>
                      <span className="text-sm text-gray-600">20% of programs</span>
                    </div>
                    <Progress value={20} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">SDG 11: Sustainable Cities</span>
                      <span className="text-sm text-gray-600">20% of programs</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="partnerships" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">NGO Partnerships</span>
                      <span className="text-sm text-gray-600">12 active partnerships</span>
                    </div>
                    <Progress value={48} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Educational Institutions</span>
                      <span className="text-sm text-gray-600">8 universities/colleges</span>
                    </div>
                    <Progress value={32} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Government Programs</span>
                      <span className="text-sm text-gray-600">5 initiatives</span>
                    </div>
                    <Progress value={20} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Community Impact Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Community Impact Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Community Investment</label>
                  <Badge variant="outline">{parameters.communityInvestment}%</Badge>
                </div>
                <Slider
                  value={[parameters.communityInvestment]}
                  onValueChange={(value) => handleParameterChange('communityInvestment', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  % of pre-tax profits invested
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Local Hiring</label>
                  <Badge variant="outline">{parameters.localHiring}%</Badge>
                </div>
                <Slider
                  value={[parameters.localHiring]}
                  onValueChange={(value) => handleParameterChange('localHiring', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Target for local community hiring
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Supplier Diversity</label>
                  <Badge variant="outline">{parameters.supplierDiversity}%</Badge>
                </div>
                <Slider
                  value={[parameters.supplierDiversity]}
                  onValueChange={(value) => handleParameterChange('supplierDiversity', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Diverse and local supplier spend
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Education Programs</label>
                  <Badge variant="outline">{parameters.educationPrograms}%</Badge>
                </div>
                <Slider
                  value={[parameters.educationPrograms]}
                  onValueChange={(value) => handleParameterChange('educationPrograms', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Skills and education program reach
                </p>
              </div>

              <Button className="w-full esg-secondary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SDG Impact & Measurement */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            SDG Impact & Community Development Goals
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span className="font-medium">Education Access</span>
              </div>
              <p className="text-sm text-gray-600">
                15,000+ students supported annually
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Goal Achievement</span>
                  <span>102%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                <span className="font-medium">Local Employment</span>
              </div>
              <p className="text-sm text-gray-600">
                75% local hiring target by 2025
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>91%</span>
                </div>
                <Progress value={91} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="font-medium">Economic Impact</span>
              </div>
              <p className="text-sm text-gray-600">
                $15M indirect economic contribution
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Multiplier Effect</span>
                  <span>3.6x</span>
                </div>
                <Progress value={72} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-orange-600" />
                <span className="font-medium">Geographic Reach</span>
              </div>
              <p className="text-sm text-gray-600">
                42 communities across 8 regions
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Coverage</span>
                  <span>85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
