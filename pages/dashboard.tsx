import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { useESGScore } from "@/hooks/useESGScore";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Users, 
  Shield, 
  Leaf, 
  Download, 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Building,
  Zap,
  Droplets,
  Recycle
} from "lucide-react";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { ImpactCalculator } from "@/components/esg/impact-calculator";
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const organizationId = 1; // Demo organization ID

export default function Dashboard() {
  const { data: esgScores, isLoading: esgLoading, error: esgError } = useESGScore(organizationId);
  const { data: complianceData, isLoading: complianceLoading, error: complianceError } = useQuery({
    queryKey: [`/api/compliance-frameworks/${organizationId}`],
    retry: false,
  });

  const { data: environmentalMetrics, isLoading: ghgLoading } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}`],
    retry: false,
  });

  const { data: parameters, isLoading: parametersLoading } = useQuery({
    queryKey: [`/api/esg-parameters/${organizationId}`],
    retry: false,
  });

  if (esgLoading || complianceLoading || ghgLoading || parametersLoading) {
    return <LoadingSpinner message="Loading executive dashboard..." />;
  }

  if (esgError || complianceError) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  // Calculate ESG scores from API data
  const overallScore = esgScores ? parseFloat(esgScores.overallScore) : 74;
  const environmentalScore = esgScores ? parseFloat(esgScores.environmentalScore) : 78;
  const socialScore = esgScores ? parseFloat(esgScores.socialScore) : 71;
  const governanceScore = esgScores ? parseFloat(esgScores.governanceScore) : 73;

  // Process environmental metrics for GHG emissions
  const ghgEmissions = environmentalMetrics?.find((m: any) => m.metricType === "ghg_emissions");
  const totalEmissions = ghgEmissions ? parseFloat(ghgEmissions.value) : 198070;
  
  // Historical data for trend analysis
  const historicalScores = [
    { year: "2020", environmental: 68, social: 65, governance: 70, overall: 67 },
    { year: "2021", environmental: 72, social: 68, governance: 71, overall: 70 },
    { year: "2022", environmental: 75, social: 69, governance: 72, overall: 72 },
    { year: "2023", environmental: 76, social: 70, governance: 72, overall: 73 },
    { year: "2024", environmental: environmentalScore, social: socialScore, governance: governanceScore, overall: overallScore }
  ];

  // ESG score breakdown for pie chart
  const scoreBreakdown = [
    { name: "Environmental", value: environmentalScore, color: "hsl(142, 71%, 45%)" },
    { name: "Social", value: socialScore, color: "hsl(217, 91%, 60%)" },
    { name: "Governance", value: governanceScore, color: "hsl(271, 81%, 56%)" }
  ];

  // Compliance frameworks status
  const complianceFrameworks = complianceData || [
    { id: 1, frameworkName: "EU CSRD", status: "compliant", completionPercentage: 100, nextDeadline: "2025-03-31" },
    { id: 2, frameworkName: "SEC Climate Rules", status: "in_progress", completionPercentage: 75, nextDeadline: "2025-03-31" },
    { id: 3, frameworkName: "TCFD", status: "compliant", completionPercentage: 100, nextDeadline: "2024-12-31" },
    { id: 4, frameworkName: "GRI Standards", status: "compliant", completionPercentage: 100, nextDeadline: "2025-06-30" }
  ];

  // Environmental parameters for interactive sliders
  const environmentalParams = parameters?.filter((p: any) => p.category === "environmental") || [];

  const getScoreGrade = (score: number) => {
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  const getComplianceStatusIcon = (status: string) => {
    switch (status) {
      case "compliant":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "in_progress":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "non_compliant":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-600" />;
    }
  };

  const getComplianceStatusText = (status: string) => {
    switch (status) {
      case "compliant":
        return "Compliant";
      case "in_progress":
        return "In Progress";
      case "non_compliant":
        return "Non-Compliant";
      default:
        return "Pending";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">Real-time ESG performance overview and regulatory compliance status</p>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Generate Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Plus className="h-4 w-4" />
            Add Module
          </Button>
        </div>
      </div>

      {/* ESG Health Score Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Overall ESG Score */}
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Overall ESG Score</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{overallScore}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +3.2 from last quarter
                </p>
              </div>
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{getScoreGrade(overallScore)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Environmental Score */}
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Environmental</p>
                <p className="text-3xl font-bold text-primary mt-1">{environmentalScore}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +2.8 vs industry avg
                </p>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Social Score */}
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Social</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{socialScore}</p>
                <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 rotate-180" />
                  -1.2 vs industry avg
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Governance Score */}
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">Governance</p>
                <p className="text-3xl font-bold text-purple-600 mt-1">{governanceScore}</p>
                <p className="text-sm text-green-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
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
          <CardTitle>Regulatory Compliance Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {complianceFrameworks.map((framework) => (
              <div key={framework.id} className="text-center">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
                  {getComplianceStatusIcon(framework.status)}
                </div>
                <h3 className="font-medium text-gray-900">{framework.frameworkName}</h3>
                <p className={`text-sm mt-1 ${
                  framework.status === 'compliant' ? 'text-green-600' : 
                  framework.status === 'in_progress' ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {getComplianceStatusText(framework.status)}
                </p>
                <Progress value={framework.completionPercentage} className="mt-2 h-2" />
                {framework.nextDeadline && (
                  <p className="text-xs text-gray-500 mt-1">
                    Next: {new Date(framework.nextDeadline).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GHG Emissions Trends */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              GHG Emissions Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg flex items-center justify-center mb-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-gray-900">-18.5%</p>
                <p className="text-sm text-gray-600">YoY Emissions Reduction</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">12,450</p>
                <p className="text-xs text-gray-500">Scope 1 (tCO₂e)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">28,730</p>
                <p className="text-xs text-gray-500">Scope 2 (tCO₂e)</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-gray-900">156,890</p>
                <p className="text-xs text-gray-500">Scope 3 (tCO₂e)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmarking */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Industry Benchmarking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg flex items-center justify-center mb-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 text-center">
                <p className="text-2xl font-bold text-primary">Top 25%</p>
                <p className="text-sm text-gray-600">Industry Ranking</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">S&P 500 ESG Score</span>
                <span className="text-sm font-medium text-gray-900">{overallScore} / 68 avg</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">FTSE4Good Inclusion</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Included</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">DJSI World Index</span>
                <Badge variant="outline" className="text-green-600 border-green-600">Member</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ESG Score Trends and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historical ESG Score Trends */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ESG Score Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalScores}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="environmental" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={2}
                    name="Environmental"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="social" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Social"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="governance" 
                    stroke="hsl(271, 81%, 56%)" 
                    strokeWidth={2}
                    name="Governance"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="hsl(0, 0%, 20%)" 
                    strokeWidth={3}
                    name="Overall"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* ESG Score Breakdown */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Current ESG Score Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scoreBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scoreBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}`, 'Score']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive ESG Parameters */}
      {environmentalParams.length > 0 && (
        <Card className="esg-card">
          <CardHeader>
            <CardTitle>Interactive ESG Parameters</CardTitle>
            <p className="text-sm text-gray-600">
              Adjust key parameters to see real-time impact on ESG scores
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {environmentalParams.slice(0, 6).map((param: any) => (
                <ParameterSlider key={param.id} parameter={param} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emissions</p>
                <p className="text-2xl font-bold text-gray-900">{totalEmissions.toLocaleString()}</p>
                <p className="text-xs text-gray-500">tCO₂e per year</p>
              </div>
              <Building className="h-8 w-8 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renewable Energy</p>
                <p className="text-2xl font-bold text-primary">45%</p>
                <p className="text-xs text-gray-500">of total consumption</p>
              </div>
              <Zap className="h-8 w-8 text-primary" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Water Efficiency</p>
                <p className="text-2xl font-bold text-blue-600">87%</p>
                <p className="text-xs text-gray-500">efficiency rating</p>
              </div>
              <Droplets className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Waste Recycling</p>
                <p className="text-2xl font-bold text-green-600">78%</p>
                <p className="text-xs text-gray-500">recycling rate</p>
              </div>
              <Recycle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Executive Impact Calculator */}
      {parameters && parameters.length > 0 && (
        <div className="mt-8">
          <ImpactCalculator 
            parameters={parameters} 
            organizationId={organizationId} 
          />
        </div>
      )}
    </div>
  );
}
