import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { 
  TrendingUp, 
  Leaf, 
  Users, 
  Shield, 
  Download, 
  Plus,
  ArrowUp,
  ArrowDown,
  Minus,
  CheckCircle,
  Clock,
  FileText,
  Target,
  Activity
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { useESGScore, useDashboardData } from "@/hooks/useESGScore";
import { formatESGScore, getESGRating, getESGScoreColor } from "@/lib/esgCalculations";

const organizationId = 1; // In production, this would come from auth context

export default function ExecutiveDashboard() {
  const [esgParameters, setEsgParameters] = useState({
    renewableEnergy: 45,
    emissionsReduction: 30,
    boardDiversity: 40,
    safetyTraining: 32,
    independentDirectors: 75,
    esgCompensation: 25,
  });

  const { data: esgScore, isLoading: scoreLoading, error: scoreError } = useESGScore(organizationId);
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useDashboardData(organizationId);

  if (scoreLoading || dashboardLoading) return <LoadingSpinner />;
  if (scoreError || dashboardError) return <ErrorMessage message="Failed to load dashboard data" />;

  const mockESGScore = esgScore || {
    overallScore: 74,
    environmentalScore: 78,
    socialScore: 71,
    governanceScore: 73,
    benchmarkData: {
      sp500Average: 68,
      industryAverage: 65,
      ftse4goodIncluded: true,
      djsiWorldMember: true
    }
  };

  const mockCompliance = [
    { framework: "EU CSRD", status: "compliant", nextDeadline: "Q1 2025" },
    { framework: "SEC Climate Rules", status: "in_progress", nextDeadline: "March 2025" },
    { framework: "TCFD", status: "compliant", nextDeadline: "Dec 2024" },
    { framework: "GRI Standards", status: "compliant", nextDeadline: "2023" }
  ];

  const mockEmissions = {
    scope1: 12450,
    scope2: 28730,
    scope3: 156890,
    yoyReduction: -18.5
  };

  const handleParameterChange = (parameter: string, value: number) => {
    setEsgParameters(prev => ({ ...prev, [parameter]: value }));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'text-green-600';
      case 'in_progress':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time ESG performance overview and regulatory compliance status
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2 esg-secondary">
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>
      </div>

      {/* ESG Health Score Overview */}
      <div className="esg-dashboard-grid">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall ESG Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatESGScore(mockESGScore.overallScore)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <ArrowUp className="h-4 w-4 inline mr-1" />
                  +3.2 from last quarter
                </p>
              </div>
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{getESGRating(mockESGScore.overallScore)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Environmental</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{formatESGScore(mockESGScore.environmentalScore)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <ArrowUp className="h-4 w-4 inline mr-1" />
                  +2.8 vs industry avg
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Social</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{formatESGScore(mockESGScore.socialScore)}</p>
                <p className="text-sm text-yellow-600 mt-1">
                  <Minus className="h-4 w-4 inline mr-1" />
                  -1.2 vs industry avg
                </p>
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
                <p className="text-sm font-medium text-gray-600">Governance</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{formatESGScore(mockESGScore.governanceScore)}</p>
                <p className="text-sm text-green-600 mt-1">
                  <ArrowUp className="h-4 w-4 inline mr-1" />
                  +4.1 vs industry avg
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Compliance Dashboard */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Regulatory Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockCompliance.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  {getStatusIcon(item.status)}
                </div>
                <h3 className="font-medium text-gray-900">{item.framework}</h3>
                <p className={`text-sm ${getStatusColor(item.status)} capitalize`}>
                  {item.status.replace('_', ' ')}
                </p>
                <p className="text-xs text-gray-500 mt-1">Next: {item.nextDeadline}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              GHG Emissions Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="esg-chart-container mb-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">{mockEmissions.yoyReduction}%</p>
                <p className="text-sm text-gray-600">YoY Emissions Reduction</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{mockEmissions.scope1.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Scope 1 (tCO₂e)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{mockEmissions.scope2.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Scope 2 (tCO₂e)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">{mockEmissions.scope3.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Scope 3 (tCO₂e)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Industry Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="esg-chart-container mb-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-green-600">Top 25%</p>
                <p className="text-sm text-gray-600">Industry Ranking</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">S&P 500 ESG Score</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatESGScore(mockESGScore.overallScore)} / {mockESGScore.benchmarkData?.sp500Average} avg
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">FTSE4Good Inclusion</span>
                <Badge variant={mockESGScore.benchmarkData?.ftse4goodIncluded ? "default" : "secondary"}>
                  {mockESGScore.benchmarkData?.ftse4goodIncluded ? "Included" : "Not Included"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DJSI World Index</span>
                <Badge variant={mockESGScore.benchmarkData?.djsiWorldMember ? "default" : "secondary"}>
                  {mockESGScore.benchmarkData?.djsiWorldMember ? "Member" : "Not Member"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive ESG Score Adjustment System */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Interactive ESG Score Parameters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Environmental Parameters */}
            <div className="space-y-4">
              <h3 className="font-medium text-green-600">Environmental Parameters</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Renewable Energy %</label>
                    <Badge variant="outline">{esgParameters.renewableEnergy}%</Badge>
                  </div>
                  <Slider
                    value={[esgParameters.renewableEnergy]}
                    onValueChange={(value) => handleParameterChange('renewableEnergy', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Emissions Reduction Target</label>
                    <Badge variant="outline">{esgParameters.emissionsReduction}%</Badge>
                  </div>
                  <Slider
                    value={[esgParameters.emissionsReduction]}
                    onValueChange={(value) => handleParameterChange('emissionsReduction', value[0])}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Social Parameters */}
            <div className="space-y-4">
              <h3 className="font-medium text-blue-600">Social Parameters</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Board Diversity %</label>
                    <Badge variant="outline">{esgParameters.boardDiversity}%</Badge>
                  </div>
                  <Slider
                    value={[esgParameters.boardDiversity]}
                    onValueChange={(value) => handleParameterChange('boardDiversity', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Safety Training Hours</label>
                    <Badge variant="outline">{esgParameters.safetyTraining}h</Badge>
                  </div>
                  <Slider
                    value={[esgParameters.safetyTraining]}
                    onValueChange={(value) => handleParameterChange('safetyTraining', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>

            {/* Governance Parameters */}
            <div className="space-y-4">
              <h3 className="font-medium text-purple-600">Governance Parameters</h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">Independent Directors %</label>
                    <Badge variant="outline">{esgParameters.independentDirectors}%</Badge>
                  </div>
                  <Slider
                    value={[esgParameters.independentDirectors]}
                    onValueChange={(value) => handleParameterChange('independentDirectors', value[0])}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-gray-700">ESG Compensation Link %</label>
                    <Badge variant="outline">{esgParameters.esgCompensation}%</Badge>
                  </div>
                  <Slider
                    value={[esgParameters.esgCompensation]}
                    onValueChange={(value) => handleParameterChange('esgCompensation', value[0])}
                    max={50}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Real-time Impact Visualization */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Parameter Impact on Overall ESG Score</h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{formatESGScore(mockESGScore.environmentalScore)}</div>
                <div className="text-sm text-gray-600">Environmental</div>
                <div className="text-xs text-green-600">+2 from adjustments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{formatESGScore(mockESGScore.socialScore)}</div>
                <div className="text-sm text-gray-600">Social</div>
                <div className="text-xs text-green-600">+1 from adjustments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{formatESGScore(mockESGScore.governanceScore)}</div>
                <div className="text-sm text-gray-600">Governance</div>
                <div className="text-xs text-green-600">+3 from adjustments</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="esg-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Generate CSRD Report</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-90" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                  <span className="font-medium">Upload Emissions Data</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-90" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <Target className="h-5 w-5 text-yellow-600" />
                  <span className="font-medium">Set New Targets</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-90" />
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span className="font-medium">Schedule Audit</span>
                </div>
                <ArrowUp className="h-4 w-4 text-gray-400 rotate-90" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-card">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { message: "Q4 2024 GHG emissions data validated", time: "2 hours ago", source: "System", color: "bg-green-500" },
                { message: "TCFD report approved by board", time: "1 day ago", source: "Board of Directors", color: "bg-blue-500" },
                { message: "Supplier ESG assessment reminder", time: "2 days ago", source: "Supply Chain", color: "bg-yellow-500" },
                { message: "Renewable energy targets updated", time: "3 days ago", source: "Sustainability Team", color: "bg-green-500" }
              ].map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 ${activity.color} rounded-full mt-2`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time} • {activity.source}</p>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="ghost" className="w-full mt-4 text-blue-600 hover:text-blue-800">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
