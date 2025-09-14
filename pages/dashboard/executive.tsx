import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ESGScoreCard } from "@/components/esg/esg-score-card";
import { ComplianceStatus } from "@/components/esg/compliance-status";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { 
  TrendingUp, 
  Download, 
  Plus, 
  Leaf, 
  Users, 
  Shield,
  FileText,
  Upload,
  BarChart,
  Calendar
} from "lucide-react";
import {
  LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const organizationId = 1;

export default function ExecutiveDashboard() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("Q4-2024");

  // Fetch ESG scores
  const { data: esgScore, isLoading: scoresLoading, error: scoresError } = useQuery({
    queryKey: ["/api/esg-scores", organizationId],
    retry: false,
  });

  // Fetch compliance frameworks
  const { data: complianceFrameworks, isLoading: complianceLoading } = useQuery({
    queryKey: ["/api/compliance", organizationId],
    retry: false,
  });

  // Fetch ESG parameters for interactive controls
  const { data: esgParameters, isLoading: parametersLoading } = useQuery({
    queryKey: ["/api/esg-parameters", organizationId],
    retry: false,
  });

  // Fetch activity log
  const { data: activityLog, isLoading: activityLoading } = useQuery({
    queryKey: ["/api/activity-log", organizationId],
    retry: false,
  });

  if (scoresLoading) return <LoadingSpinner message="Loading ESG dashboard..." />;
  if (scoresError) return <ErrorMessage message="Failed to load ESG scores" />;

  const score = esgScore || {
    overallScore: "74.2",
    environmentalScore: "78.1",
    socialScore: "71.5",
    governanceScore: "73.8",
    benchmarkSP500: "68.5",
    benchmarkIndustry: "71.2"
  };

  // Sample trend data for charts
  const monthlyTrends = [
    { month: "Jan", overall: 72.1, environmental: 75.2, social: 69.8, governance: 71.3 },
    { month: "Feb", overall: 72.8, environmental: 76.1, social: 70.2, governance: 72.1 },
    { month: "Mar", overall: 73.2, environmental: 76.8, social: 70.8, governance: 72.5 },
    { month: "Apr", overall: 73.5, environmental: 77.2, social: 70.9, governance: 72.8 },
    { month: "May", overall: 73.8, environmental: 77.5, social: 71.1, governance: 73.1 },
    { month: "Jun", overall: 74.0, environmental: 77.8, social: 71.3, governance: 73.4 },
    { month: "Jul", overall: 74.1, environmental: 78.0, social: 71.4, governance: 73.6 },
    { month: "Aug", overall: 74.2, environmental: 78.1, social: 71.5, governance: 73.8 }
  ];

  const benchmarkData = [
    { name: "Our Company", value: parseFloat(score.overallScore), color: "hsl(142, 71%, 45%)" },
    { name: "S&P 500 Avg", value: parseFloat(score.benchmarkSP500), color: "hsl(217, 91%, 60%)" },
    { name: "Industry Avg", value: parseFloat(score.benchmarkIndustry), color: "hsl(43, 96%, 56%)" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Real-time ESG performance overview and regulatory compliance status
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            MSCI ESG Rating
          </Badge>
          <Badge variant="outline" className="text-success">
            FTSE4Good Included
          </Badge>
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
        <ESGScoreCard
          title="Overall ESG Score"
          score={parseFloat(score.overallScore)}
          category="overall"
          benchmark={parseFloat(score.benchmarkSP500)}
          trend="up"
          trendValue={3.2}
          subtitle="MSCI ESG Rating Methodology"
        />
        
        <ESGScoreCard
          title="Environmental"
          score={parseFloat(score.environmentalScore)}
          category="environmental"
          benchmark={75.0}
          trend="up"
          trendValue={2.8}
          icon={<Leaf className="h-6 w-6" />}
        />
        
        <ESGScoreCard
          title="Social"
          score={parseFloat(score.socialScore)}
          category="social"
          benchmark={72.5}
          trend="down"
          trendValue={1.2}
          icon={<Users className="h-6 w-6" />}
        />
        
        <ESGScoreCard
          title="Governance"
          score={parseFloat(score.governanceScore)}
          category="governance"
          benchmark={69.8}
          trend="up"
          trendValue={4.1}
          icon={<Shield className="h-6 w-6" />}
        />
      </div>

      {/* Compliance Status */}
      {!complianceLoading && complianceFrameworks && (
        <ComplianceStatus frameworks={complianceFrameworks} />
      )}

      {/* Performance Trends and Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ESG Score Trends */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              ESG Score Trends
            </CardTitle>
            <p className="text-sm text-gray-600">
              Monthly ESG performance tracking across all categories
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214.3, 31.8%, 91.4%)" />
                  <XAxis dataKey="month" stroke="hsl(215.4, 16.3%, 46.9%)" />
                  <YAxis stroke="hsl(215.4, 16.3%, 46.9%)" domain={[65, 80]} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid hsl(214.3, 31.8%, 91.4%)',
                      borderRadius: '8px'
                    }}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="overall" 
                    stroke="hsl(222.2, 84%, 4.9%)" 
                    strokeWidth={3}
                    name="Overall Score"
                  />
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
                    stroke="hsl(262, 83%, 58%)" 
                    strokeWidth={2}
                    name="Governance"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Industry Benchmarking */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Industry Benchmarking
            </CardTitle>
            <p className="text-sm text-gray-600">
              Performance comparison against market benchmarks
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={benchmarkData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {benchmarkData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>ESG Score Ranking</span>
                <span className="font-medium text-primary">Top 25%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>DJSI World Member</span>
                <span className="font-medium text-success">Included</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>CDP Climate Score</span>
                <span className="font-medium text-success">A-</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive ESG Parameters */}
      {!parametersLoading && esgParameters && esgParameters.length > 0 && (
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Interactive ESG Parameters
            </CardTitle>
            <p className="text-sm text-gray-600">
              Adjust key parameters to see real-time impact on ESG scores
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {esgParameters.slice(0, 6).map((parameter) => (
                <ParameterSlider key={parameter.id} parameter={parameter} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Actions */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="h-4 w-4 text-secondary" />
                  <span>Generate CSRD Report</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <Upload className="h-4 w-4 text-primary" />
                  <span>Upload Emissions Data</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <BarChart className="h-4 w-4 text-accent" />
                  <span>Set New Targets</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>
              <Button variant="outline" className="w-full justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-purple-600" />
                  <span>Schedule Audit</span>
                </div>
                <span className="text-gray-400">→</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="esg-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!activityLoading && activityLog ? (
              <div className="space-y-4">
                {activityLog.slice(0, 4).map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(activity.timestamp).toLocaleString()} • {activity.action}
                      </p>
                    </div>
                  </div>
                ))}
                <Button variant="ghost" className="w-full text-center text-sm text-secondary">
                  View All Activity
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-success rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Q4 2024 GHG emissions data validated</p>
                    <p className="text-xs text-gray-500">2 hours ago • System</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">TCFD report approved by board</p>
                    <p className="text-xs text-gray-500">1 day ago • Board of Directors</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-warning rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Supplier ESG assessment reminder</p>
                    <p className="text-xs text-gray-500">2 days ago • Supply Chain</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">Renewable energy targets updated</p>
                    <p className="text-xs text-gray-500">3 days ago • Sustainability Team</p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
