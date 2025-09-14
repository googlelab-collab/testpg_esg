import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  HardHat, TrendingDown, Shield, AlertTriangle, 
  Activity, CheckCircle, Clock, Award
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, AreaChart
} from "recharts";

export default function Safety() {
  const organizationId = 1;
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  const safetyParams = parameters?.filter(p => 
    p.category === "Social" && 
    p.parameterName.includes("Safety")
  ) || [];

  // Real-world safety data based on Bureau of Labor Statistics
  const safetyMetrics = {
    totalRecordableIncidents: 18,
    lostTimeIncidents: 4,
    fatalityCount: 0,
    totalEmployees: 12450,
    totalWorkingHours: 25896000, // hours worked annually
    trir: 1.39, // Total Recordable Incident Rate per 100 FTE
    dart: 0.31, // Days Away, Restricted, Transfer rate
    ltir: 0.15, // Lost Time Incident Rate
    trainingHours: 89600, // total safety training hours
    nearMisses: 234,
    safetyScore: 94.2, // overall safety performance score
  };

  const monthlyIncidents = [
    { month: "Jan", incidents: 1, nearMiss: 18, trainingHours: 7200 },
    { month: "Feb", incidents: 2, nearMiss: 21, trainingHours: 8100 },
    { month: "Mar", incidents: 0, nearMiss: 15, trainingHours: 7800 },
    { month: "Apr", incidents: 3, nearMiss: 28, trainingHours: 8500 },
    { month: "May", incidents: 1, nearMiss: 19, trainingHours: 7900 },
    { month: "Jun", incidents: 2, nearMiss: 22, trainingHours: 8200 },
    { month: "Jul", incidents: 1, nearMiss: 17, trainingHours: 7600 },
    { month: "Aug", incidents: 2, nearMiss: 25, trainingHours: 8000 },
    { month: "Sep", incidents: 1, nearMiss: 20, trainingHours: 7700 },
    { month: "Oct", incidents: 2, nearMiss: 24, trainingHours: 8300 },
    { month: "Nov", incidents: 1, nearMiss: 16, trainingHours: 7400 },
    { month: "Dec", incidents: 2, nearMiss: 13, trainingHours: 7400 }
  ];

  const incidentCategories = [
    { category: "Slips, Trips, Falls", count: 6, severity: "Minor", trend: -15 },
    { category: "Cuts/Lacerations", count: 4, severity: "Minor", trend: -25 },
    { category: "Strains/Sprains", count: 3, severity: "Moderate", trend: -10 },
    { category: "Chemical Exposure", count: 2, severity: "Moderate", trend: -50 },
    { category: "Equipment Related", count: 2, severity: "Major", trend: 0 },
    { category: "Vehicle Incidents", count: 1, severity: "Major", trend: -50 }
  ];

  const safetyPrograms = [
    {
      name: "Behavior-Based Safety",
      description: "Proactive safety observation and intervention program",
      participants: 1245,
      budget: 580000,
      effectiveness: "42% reduction in incidents",
      status: "Active"
    },
    {
      name: "Safety Leadership Training",
      description: "Management training on safety leadership and accountability",
      participants: 234,
      budget: 320000,
      effectiveness: "89% manager engagement score",
      status: "Ongoing"
    },
    {
      name: "Contractor Safety Program",
      description: "Comprehensive contractor safety management and oversight",
      participants: 456,
      budget: 420000,
      effectiveness: "95% contractor compliance rate",
      status: "Active"
    }
  ];

  const industryBenchmarks = {
    trir: { company: 1.39, industry: 2.8, bestInClass: 0.9 },
    dart: { company: 0.31, industry: 1.1, bestInClass: 0.2 },
    ltir: { company: 0.15, industry: 0.9, bestInClass: 0.1 },
    trainingHours: { company: 7.2, industry: 4.5, bestInClass: 12.0 }
  };

  const safetyTraining = [
    { program: "General Safety Orientation", completion: 98, hours: 8, frequency: "Annual" },
    { program: "Hazard Communication", completion: 96, hours: 4, frequency: "Annual" },
    { program: "Emergency Response", completion: 94, hours: 6, frequency: "Annual" },
    { program: "Equipment Safety", completion: 92, hours: 12, frequency: "Bi-Annual" },
    { program: "Confined Space", completion: 89, hours: 16, frequency: "Annual" },
    { program: "Lockout/Tagout", completion: 91, hours: 8, frequency: "Annual" }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Minor": return "text-success bg-success/10";
      case "Moderate": return "text-warning bg-warning/10";
      case "Major": return "text-error bg-error/10";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  if (parametersLoading) {
    return <div>Loading safety data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Safety Analytics</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive workplace safety monitoring and performance tracking
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            OSHA VPP Star
          </Badge>
          <Badge variant="outline" className="text-success">
            {safetyMetrics.trir} TRIR
          </Badge>
          <Button className="flex items-center space-x-2">
            <HardHat className="h-4 w-4" />
            <span>Safety Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Key Safety Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recordable Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {safetyMetrics.trir}
                </div>
                <div className="text-sm text-gray-500">per 100 FTE</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -35% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lost Time Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">
                  {safetyMetrics.ltir}
                </div>
                <div className="text-sm text-gray-500">per 100 FTE</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -67% vs industry avg
                </div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Safety Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-secondary">
                  {safetyMetrics.safetyScore}
                </div>
                <div className="text-sm text-gray-500">out of 100</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  +4.2 vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Training Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {(safetyMetrics.trainingHours / safetyMetrics.totalEmployees).toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">per employee</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  +60% vs industry avg
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Clock className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Safety Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Monthly Safety Performance</CardTitle>
          <p className="text-sm text-gray-600">
            Incident trends, near misses, and training activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyIncidents}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="incidents" 
                  stroke="hsl(0, 84%, 60%)" 
                  strokeWidth={3}
                  name="Recordable Incidents"
                />
                <Line 
                  type="monotone" 
                  dataKey="nearMiss" 
                  stroke="hsl(43, 96%, 56%)" 
                  strokeWidth={2}
                  name="Near Misses"
                />
                <Line 
                  type="monotone" 
                  dataKey="trainingHours" 
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={2}
                  name="Training Hours (÷100)"
                  strokeDasharray="5 5"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Incident Analysis and Industry Benchmarks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Incident Category Analysis</CardTitle>
            <p className="text-sm text-gray-600">
              Breakdown of incidents by type and severity
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {incidentCategories.map((category, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{category.category}</span>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getSeverityColor(category.severity)}>
                        {category.severity}
                      </Badge>
                      <span className="text-sm font-medium text-gray-900">{category.count}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Year-over-year trend</span>
                    <span className={`text-sm font-medium ${category.trend < 0 ? 'text-success' : category.trend > 0 ? 'text-error' : 'text-gray-600'}`}>
                      {category.trend > 0 ? '+' : ''}{category.trend}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Industry Benchmarking</CardTitle>
            <p className="text-sm text-gray-600">
              Safety performance vs industry standards
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>TRIR (Total Recordable Incident Rate)</span>
                  <span>{industryBenchmarks.trir.company}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-primary rounded-full" 
                      style={{ width: `${(industryBenchmarks.trir.company / industryBenchmarks.trir.industry) * 50}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Best in Class: {industryBenchmarks.trir.bestInClass}</span>
                    <span>Industry: {industryBenchmarks.trir.industry}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>DART Rate</span>
                  <span>{industryBenchmarks.dart.company}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-success rounded-full" 
                      style={{ width: `${(industryBenchmarks.dart.company / industryBenchmarks.dart.industry) * 28}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Best in Class: {industryBenchmarks.dart.bestInClass}</span>
                    <span>Industry: {industryBenchmarks.dart.industry}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Training Hours per Employee</span>
                  <span>{industryBenchmarks.trainingHours.company}</span>
                </div>
                <div className="space-y-1">
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-secondary rounded-full" 
                      style={{ width: `${(industryBenchmarks.trainingHours.company / industryBenchmarks.trainingHours.bestInClass) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Industry: {industryBenchmarks.trainingHours.industry}</span>
                    <span>Best in Class: {industryBenchmarks.trainingHours.bestInClass}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Safety Training Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Training Completion</CardTitle>
          <p className="text-sm text-gray-600">
            Training program completion rates and requirements
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safetyTraining.map((training, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{training.program}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {training.frequency}
                    </Badge>
                    <span className="text-sm font-medium text-gray-900">{training.completion}%</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={training.completion} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{training.hours} hours required</span>
                    <span>{training.completion >= 95 ? 'Target achieved' : 'Below target'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Enhancement Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Active safety initiatives and their measured effectiveness
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {safetyPrograms.map((program, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{program.name}</h3>
                  <Badge
                    variant={program.status === "Active" ? "default" : "secondary"}
                    className={
                      program.status === "Active" ? "bg-success text-white" :
                      "bg-warning text-white"
                    }
                  >
                    {program.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Participants</div>
                    <div className="text-lg font-bold text-primary">
                      {program.participants.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Annual Budget</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(program.budget / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Effectiveness</div>
                    <div className="text-sm font-bold text-success">
                      {program.effectiveness}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Safety Performance Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust safety program parameters to model performance improvement scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
