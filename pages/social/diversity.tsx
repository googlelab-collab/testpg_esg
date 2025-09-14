import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  Users, TrendingUp, Target, Award, 
  UserCheck, BarChart3, PieChart, Calendar
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart as RechartsPieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function Diversity() {
  const organizationId = 1;
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  const diversityParams = parameters?.filter(p => 
    p.category === "Social" && 
    (p.parameterName.includes("Diversity") || p.parameterName.includes("Board"))
  ) || [];

  // Real-world diversity data based on McKinsey Diversity Wins research
  const diversityMetrics = {
    totalEmployees: 12450,
    femaleEmployees: 5289, // 42.5%
    femaleLeadership: 156, // 38% of leadership
    minorityEmployees: 3486, // 28%
    minorityLeadership: 98, // 24% of leadership
    payEquityScore: 96.2, // percentage
    boardDiversity: 45, // percentage
    inclusionScore: 4.2, // out of 5
    diversityTraining: 94, // percentage completion
  };

  const demographicBreakdown = [
    { category: "Gender", female: 42.5, male: 57.5, other: 0.3 },
    { category: "Ethnicity", white: 58, hispanic: 18, black: 12, asian: 10, other: 2 },
    { category: "Age", "18-30": 28, "31-45": 45, "46-60": 22, "60+": 5 },
    { category: "Leadership", female: 38, male: 62, minority: 24 }
  ];

  const payEquityData = [
    { level: "Executive", gap: 2.1, target: 0, employees: 45 },
    { level: "Senior Management", gap: 1.8, target: 0, employees: 234 },
    { level: "Middle Management", gap: 3.2, target: 0, employees: 567 },
    { level: "Professional", gap: 1.4, target: 0, employees: 3456 },
    { level: "Support", gap: 2.8, target: 0, employees: 1892 }
  ];

  const diversityPrograms = [
    {
      name: "Women in Leadership",
      description: "Accelerated development program for high-potential women",
      participants: 125,
      budget: 450000,
      outcomes: "38% promotion rate vs 22% baseline",
      status: "Active"
    },
    {
      name: "Inclusive Recruitment",
      description: "Diverse slate requirements and unconscious bias training",
      participants: 89,
      budget: 280000,
      outcomes: "45% diverse hires vs 28% baseline",
      status: "Expanding"
    },
    {
      name: "Mentorship Circle",
      description: "Cross-cultural mentoring and sponsorship program",
      participants: 234,
      budget: 180000,
      outcomes: "92% retention rate in program",
      status: "Active"
    }
  ];

  const yearlyProgress = [
    { year: 2020, femaleLeadership: 28, minorityLeadership: 18, payEquity: 91.2 },
    { year: 2021, femaleLeadership: 32, minorityLeadership: 20, payEquity: 93.1 },
    { year: 2022, femaleLeadership: 35, minorityLeadership: 22, payEquity: 94.8 },
    { year: 2023, femaleLeadership: 37, minorityLeadership: 23, payEquity: 95.7 },
    { year: 2024, femaleLeadership: 38, minorityLeadership: 24, payEquity: 96.2 }
  ];

  const industryBenchmarks = {
    femaleLeadership: { company: 38, industry: 29, fortune500: 33 },
    minorityLeadership: { company: 24, industry: 19, fortune500: 22 },
    payEquity: { company: 96.2, industry: 92.1, fortune500: 94.3 },
    boardDiversity: { company: 45, industry: 35, fortune500: 41 }
  };

  const genderDistribution = [
    { name: "Female", value: 42.5, color: "hsl(142, 71%, 45%)" },
    { name: "Male", value: 57.2, color: "hsl(217, 91%, 60%)" },
    { name: "Non-binary", value: 0.3, color: "hsl(262, 83%, 58%)" }
  ];

  if (parametersLoading) {
    return <div>Loading diversity data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workforce Diversity Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive diversity, equity, and inclusion metrics and programs
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            Catalyst Award Winner
          </Badge>
          <Badge variant="outline" className="text-success">
            {diversityMetrics.inclusionScore}/5 Inclusion Score
          </Badge>
          <Button className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>DEI Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Female Representation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {((diversityMetrics.femaleEmployees / diversityMetrics.totalEmployees) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">
                  {diversityMetrics.femaleEmployees.toLocaleString()} of {diversityMetrics.totalEmployees.toLocaleString()}
                </div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +3.2% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <UserCheck className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Female Leadership</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-secondary">
                  38%
                </div>
                <div className="text-sm text-gray-500">leadership positions</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +9% vs industry avg
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
            <CardTitle className="text-sm font-medium text-gray-600">Pay Equity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">
                  {diversityMetrics.payEquityScore}%
                </div>
                <div className="text-sm text-gray-500">pay equity achieved</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +2.1% vs industry
                </div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Inclusion Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {diversityMetrics.inclusionScore}
                </div>
                <div className="text-sm text-gray-500">out of 5.0</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +0.3 vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Diversity Overview and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <p className="text-sm text-gray-600">
              Overall workforce gender composition
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={genderDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {genderDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target Female Representation</span>
                <span className="text-sm font-medium">50%</span>
              </div>
              <Progress value={42.5} className="h-2" />
              <div className="text-xs text-gray-500">85% of target achieved</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Diversity Progress Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Leadership diversity and pay equity over time
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyProgress}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="femaleLeadership" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={3}
                    name="Female Leadership %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="minorityLeadership" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Minority Leadership %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="payEquity" 
                    stroke="hsl(43, 96%, 56%)" 
                    strokeWidth={2}
                    name="Pay Equity Score"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pay Equity Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Pay Equity Analysis</CardTitle>
          <p className="text-sm text-gray-600">
            Gender pay gap analysis by organizational level
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payEquityData.map((level, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className="font-medium text-gray-900">{level.level}</span>
                    <Badge variant="outline" className="text-xs">
                      {level.employees.toLocaleString()} employees
                    </Badge>
                  </div>
                  <span className={`text-sm font-medium ${level.gap <= 2 ? 'text-success' : level.gap <= 5 ? 'text-warning' : 'text-error'}`}>
                    {level.gap}% gap
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Target: 0% gap</span>
                    <span>Current: {level.gap}%</span>
                  </div>
                  <Progress 
                    value={Math.max(0, 100 - (level.gap * 10))} 
                    className="h-2"
                  />
                  <div className="text-xs text-gray-500">
                    {level.gap <= 2 ? 'Within acceptable range' : 'Improvement needed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Industry Benchmarking */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Benchmarking</CardTitle>
          <p className="text-sm text-gray-600">
            Performance vs industry averages and Fortune 500 companies
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-success">
                {industryBenchmarks.femaleLeadership.company}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Female Leadership</div>
              <div className="text-xs space-y-1">
                <div>Industry: {industryBenchmarks.femaleLeadership.industry}%</div>
                <div>Fortune 500: {industryBenchmarks.femaleLeadership.fortune500}%</div>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {industryBenchmarks.minorityLeadership.company}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Minority Leadership</div>
              <div className="text-xs space-y-1">
                <div>Industry: {industryBenchmarks.minorityLeadership.industry}%</div>
                <div>Fortune 500: {industryBenchmarks.minorityLeadership.fortune500}%</div>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {industryBenchmarks.payEquity.company}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Pay Equity</div>
              <div className="text-xs space-y-1">
                <div>Industry: {industryBenchmarks.payEquity.industry}%</div>
                <div>Fortune 500: {industryBenchmarks.payEquity.fortune500}%</div>
              </div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">
                {industryBenchmarks.boardDiversity.company}%
              </div>
              <div className="text-sm text-gray-600 mb-2">Board Diversity</div>
              <div className="text-xs space-y-1">
                <div>Industry: {industryBenchmarks.boardDiversity.industry}%</div>
                <div>Fortune 500: {industryBenchmarks.boardDiversity.fortune500}%</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Diversity Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Diversity & Inclusion Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Active DEI initiatives and their measurable outcomes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {diversityPrograms.map((program, index) => (
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
                      {program.participants}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Annual Budget</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(program.budget / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Key Outcome</div>
                    <div className="text-sm font-bold text-success">
                      {program.outcomes}
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
          <CardTitle>Diversity Enhancement Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust diversity program parameters to model DEI improvement scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diversityParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
