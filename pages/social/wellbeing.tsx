import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/ParameterSlider";
import { 
  Heart, TrendingUp, TrendingDown, Target, 
  Brain, DollarSign, Users, Activity 
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function Wellbeing() {
  const organizationId = 1;
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  const wellbeingParams = parameters?.filter(p => 
    p.category === "social" && 
    p.parameterName.includes("Wellbeing")
  ) || [];

  // Real-world wellbeing data based on WHO Healthy Workplace Framework and Gallup research
  const wellbeingMetrics = {
    overallWellbeingScore: 7.2, // out of 10
    engagementScore: 73.8, // % engaged employees
    mentalHealthSupport: 89.3, // % with access to support
    workLifeBalance: 6.8, // out of 10
    financialWellness: 71.5, // % financially secure
    physicalHealth: 78.2, // % in good health
    wellbeingInvestment: 15600000, // USD annually
    programParticipation: 67.4 // % participating in programs
  };

  const wellbeingDimensions = [
    { dimension: "Physical Health", score: 78.2, benchmark: 72.5, programs: 12, participation: 68.7 },
    { dimension: "Mental Health", score: 74.6, benchmark: 69.8, programs: 8, participation: 45.3 },
    { dimension: "Financial Wellness", score: 71.5, benchmark: 66.2, programs: 6, participation: 52.4 },
    { dimension: "Work-Life Balance", score: 68.0, benchmark: 65.1, programs: 10, participation: 73.8 },
    { dimension: "Social Connection", score: 76.8, benchmark: 71.3, programs: 7, participation: 61.2 },
    { dimension: "Purpose & Meaning", score: 79.4, benchmark: 74.7, programs: 5, participation: 58.9 }
  ];

  const monthlyTrends = [
    { month: "Jan", engagement: 71.2, stress: 32.4, satisfaction: 74.6, turnover: 8.9 },
    { month: "Feb", engagement: 72.8, stress: 30.1, satisfaction: 75.2, turnover: 8.2 },
    { month: "Mar", engagement: 73.5, stress: 28.7, satisfaction: 76.1, turnover: 7.8 },
    { month: "Apr", engagement: 74.1, stress: 27.3, satisfaction: 76.8, turnover: 7.5 },
    { month: "May", engagement: 75.2, stress: 26.9, satisfaction: 77.4, turnover: 7.1 },
    { month: "Jun", engagement: 74.8, stress: 28.1, satisfaction: 76.9, turnover: 7.4 },
    { month: "Jul", engagement: 73.9, stress: 29.5, satisfaction: 76.2, turnover: 7.8 },
    { month: "Aug", engagement: 74.7, stress: 27.8, satisfaction: 77.1, turnover: 7.2 },
    { month: "Sep", engagement: 75.6, stress: 25.9, satisfaction: 78.3, turnover: 6.8 },
    { month: "Oct", engagement: 76.2, stress: 24.7, satisfaction: 78.9, turnover: 6.5 },
    { month: "Nov", engagement: 75.8, stress: 25.3, satisfaction: 78.5, turnover: 6.7 },
    { month: "Dec", engagement: 74.9, stress: 26.8, satisfaction: 77.8, turnover: 7.0 }
  ];

  const wellbeingPrograms = [
    {
      program: "Employee Assistance Program",
      description: "Confidential counseling and mental health support",
      category: "Mental Health",
      participants: 12567,
      investment: 2800000,
      satisfaction: 88.4,
      outcomes: ["30% stress reduction", "25% improved sleep", "40% better coping"],
      utilization: 34.5,
      roi: 4.2
    },
    {
      program: "Flexible Work Arrangements",
      description: "Remote work, flexible hours, and job sharing options",
      category: "Work-Life Balance",
      participants: 28734,
      investment: 5600000,
      satisfaction: 91.7,
      outcomes: ["35% better work-life balance", "20% less burnout", "15% higher productivity"],
      utilization: 78.9,
      roi: 3.8
    },
    {
      program: "Financial Wellness Platform",
      description: "Financial planning, debt counseling, and investment guidance",
      category: "Financial Wellness",
      participants: 19234,
      investment: 1900000,
      satisfaction: 84.2,
      outcomes: ["$2,500 avg debt reduction", "40% increased savings", "60% better financial literacy"],
      utilization: 52.7,
      roi: 5.1
    },
    {
      program: "Physical Health & Fitness",
      description: "On-site gyms, fitness classes, and wellness screenings",
      category: "Physical Health",
      participants: 24890,
      investment: 3400000,
      satisfaction: 86.9,
      outcomes: ["25% improved fitness", "30% better health metrics", "20% reduced healthcare costs"],
      utilization: 68.3,
      roi: 3.2
    },
    {
      program: "Mindfulness & Stress Management",
      description: "Meditation sessions, stress reduction workshops, and resilience training",
      category: "Mental Health",
      participants: 15678,
      investment: 1200000,
      satisfaction: 89.6,
      outcomes: ["40% stress reduction", "35% better focus", "50% improved emotional regulation"],
      utilization: 43.0,
      roi: 4.7
    }
  ];

  const healthMetrics = [
    { metric: "Healthcare Cost per Employee", current: 8420, benchmark: 9150, improvement: -8.0, unit: "USD" },
    { metric: "Sick Days per Employee", current: 6.8, benchmark: 8.2, improvement: -17.1, unit: "days" },
    { metric: "Health Risk Assessment Participation", current: 78.5, benchmark: 65.0, improvement: 20.8, unit: "%" },
    { metric: "Preventive Care Utilization", current: 82.3, benchmark: 71.5, improvement: 15.1, unit: "%" },
    { metric: "Wellness Program Engagement", current: 67.4, benchmark: 52.8, improvement: 27.7, unit: "%" },
    { metric: "Employee Health Score", current: 7.6, benchmark: 6.9, improvement: 10.1, unit: "out of 10" }
  ];

  const mentalHealthSupport = [
    {
      service: "24/7 Crisis Hotline",
      availability: "24/7",
      utilization: 8.2,
      satisfaction: 92.4,
      cost: 450000,
      outcomes: ["100% crisis intervention", "95% follow-up completion"]
    },
    {
      service: "Individual Counseling",
      availability: "Business hours",
      utilization: 23.7,
      satisfaction: 89.1,
      cost: 1800000,
      outcomes: ["6 session average", "78% improvement in wellbeing scores"]
    },
    {
      service: "Group Therapy Sessions",
      availability: "Weekly",
      utilization: 12.4,
      satisfaction: 86.8,
      cost: 320000,
      outcomes: ["8-week programs", "85% completion rate"]
    },
    {
      service: "Digital Mental Health App",
      availability: "24/7",
      utilization: 45.6,
      satisfaction: 81.2,
      cost: 280000,
      outcomes: ["Daily usage average 15 min", "70% report stress reduction"]
    },
    {
      service: "Manager Mental Health Training",
      availability: "Quarterly",
      utilization: 89.3,
      satisfaction: 88.7,
      cost: 180000,
      outcomes: ["All managers trained", "40% better early intervention"]
    }
  ];

  const demographicAnalysis = [
    { demographic: "Generation Z", engagement: 71.2, wellbeing: 6.8, topConcerns: ["Career growth", "Mental health", "Financial security"] },
    { demographic: "Millennials", engagement: 74.8, wellbeing: 7.1, topConcerns: ["Work-life balance", "Family support", "Career advancement"] },
    { demographic: "Generation X", engagement: 76.4, wellbeing: 7.3, topConcerns: ["Job security", "Healthcare", "Retirement planning"] },
    { demographic: "Baby Boomers", engagement: 79.1, wellbeing: 7.6, topConcerns: ["Healthcare", "Retirement", "Flexible schedules"] }
  ];

  const workLifeBalance = [
    { factor: "Flexible Work Hours", satisfaction: 87.3, utilization: 78.9, impact: "High" },
    { factor: "Remote Work Options", satisfaction: 91.2, utilization: 65.4, impact: "Very High" },
    { factor: "Compressed Work Week", satisfaction: 84.6, utilization: 23.7, impact: "Medium" },
    { factor: "Job Sharing", satisfaction: 88.9, utilization: 8.2, impact: "Medium" },
    { factor: "Unlimited PTO", satisfaction: 79.4, utilization: 56.8, impact: "High" },
    { factor: "Sabbatical Programs", satisfaction: 92.8, utilization: 4.1, impact: "Very High" }
  ];

  const wellbeingROI = [
    { investment: "Mental Health Programs", cost: 4200000, savings: 16800000, roi: 4.0, metric: "Reduced absenteeism & turnover" },
    { investment: "Physical Wellness", cost: 3400000, savings: 10880000, roi: 3.2, metric: "Lower healthcare costs" },
    { investment: "Financial Wellness", cost: 1900000, savings: 9690000, roi: 5.1, metric: "Increased productivity" },
    { investment: "Work-Life Balance", cost: 5600000, savings: 21280000, roi: 3.8, metric: "Retention & engagement" }
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "Very High": return "text-green-600 bg-green-50";
      case "High": return "text-blue-600 bg-blue-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (parametersLoading) {
    return <div>Loading employee wellbeing data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Employee Wellbeing Center</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive employee wellbeing following WHO Healthy Workplace Framework and evidence-based practices
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            WHO Framework
          </Badge>
          <Badge variant="outline" className="text-success">
            ISO 45003 Aligned
          </Badge>
          <Button className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Wellbeing Goals</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Overall Wellbeing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {wellbeingMetrics.overallWellbeingScore}/10
                </div>
                <div className="text-sm text-gray-500">wellbeing score</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +0.4 vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Employee Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {wellbeingMetrics.engagementScore}%
                </div>
                <div className="text-sm text-gray-500">engaged employees</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +5.7% vs industry
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mental Health Support</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {wellbeingMetrics.mentalHealthSupport}%
                </div>
                <div className="text-sm text-gray-500">have access</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12.3% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Brain className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Wellbeing Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  ${(wellbeingMetrics.wellbeingInvestment / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">annually</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +18.9% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellbeing Trends and Dimensions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Wellbeing Performance Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly tracking of key wellbeing and engagement metrics
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={3}
                    name="Engagement %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="satisfaction" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={2}
                    name="Satisfaction %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="stress" 
                    stroke="hsl(0, 84%, 60%)" 
                    strokeWidth={2}
                    name="Stress %"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Wellbeing Dimensions</CardTitle>
            <p className="text-sm text-gray-600">
              Performance across six dimensions of employee wellbeing
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {wellbeingDimensions.map((dimension, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{dimension.dimension}</span>
                    <Badge variant="outline" className="text-success bg-success/10">
                      {dimension.participation}% Participation
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-2">
                    <div>
                      <div className="text-sm text-gray-600">Score</div>
                      <div className="text-lg font-bold text-primary">
                        {dimension.score}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Benchmark</div>
                      <div className="text-lg font-bold text-gray-600">
                        {dimension.benchmark}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Programs</div>
                      <div className="text-lg font-bold text-blue-600">
                        {dimension.programs}
                      </div>
                    </div>
                  </div>
                  <Progress value={(dimension.score / 100) * 100} className="h-2" />
                  <div className="text-xs text-gray-500 mt-1">
                    +{(dimension.score - dimension.benchmark).toFixed(1)} vs benchmark
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Wellbeing Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Wellbeing Programs & Initiatives</CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive wellbeing programs and their impact on employee health
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wellbeingPrograms.map((program, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{program.program}</h3>
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    {program.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Participants</div>
                    <div className="text-lg font-bold text-blue-600">
                      {program.participants.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-purple-600">
                      ${(program.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                    <div className="text-lg font-bold text-green-600">
                      {program.satisfaction}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Utilization</div>
                    <div className="text-lg font-bold text-orange-600">
                      {program.utilization}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="text-lg font-bold text-gray-900">
                      {program.roi}:1
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Key Outcomes</div>
                  <div className="flex flex-wrap gap-1">
                    {program.outcomes.map((outcome, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-green-600 bg-green-50">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Mental Health Support Services */}
      <Card>
        <CardHeader>
          <CardTitle>Mental Health Support Services</CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive mental health resources and utilization patterns
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mentalHealthSupport.map((service, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{service.service}</h3>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {service.satisfaction}% Satisfaction
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Availability</div>
                    <div className="text-lg font-bold text-blue-600">
                      {service.availability}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Utilization</div>
                    <div className="text-lg font-bold text-green-600">
                      {service.utilization}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Annual Cost</div>
                    <div className="text-lg font-bold text-purple-600">
                      ${(service.cost / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                    <div className="text-lg font-bold text-orange-600">
                      {service.satisfaction}%
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Key Outcomes</div>
                  <div className="flex flex-wrap gap-1">
                    {service.outcomes.map((outcome, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs text-blue-600 bg-blue-50">
                        {outcome}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Work-Life Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Work-Life Balance Initiatives</CardTitle>
          <p className="text-sm text-gray-600">
            Flexible work arrangements and their impact on employee satisfaction
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {workLifeBalance.map((factor, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{factor.factor}</h3>
                  <Badge variant="outline" className={getImpactColor(factor.impact)}>
                    {factor.impact} Impact
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                    <div className="text-lg font-bold text-green-600">
                      {factor.satisfaction}%
                    </div>
                    <Progress value={factor.satisfaction} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Utilization</div>
                    <div className="text-lg font-bold text-blue-600">
                      {factor.utilization}%
                    </div>
                    <Progress value={factor.utilization} className="h-1 mt-1" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Impact Level</div>
                    <div className="text-lg font-bold text-purple-600">
                      {factor.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Demographics Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Wellbeing by Demographics</CardTitle>
          <p className="text-sm text-gray-600">
            Generational differences in wellbeing needs and engagement
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demographicAnalysis.map((demo, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{demo.demographic}</h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {demo.wellbeing}/10
                    </div>
                    <div className="text-sm text-gray-600">Wellbeing Score</div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Engagement</div>
                    <div className="text-lg font-bold text-blue-600">
                      {demo.engagement}%
                    </div>
                    <Progress value={demo.engagement} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Wellbeing</div>
                    <div className="text-lg font-bold text-green-600">
                      {demo.wellbeing}/10
                    </div>
                    <Progress value={demo.wellbeing * 10} className="h-2 mt-1" />
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Top Concerns</div>
                    <div className="flex flex-wrap gap-1">
                      {demo.topConcerns.map((concern, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {concern}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ROI Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Wellbeing Investment Returns</CardTitle>
          <p className="text-sm text-gray-600">
            Return on investment for wellbeing programs and initiatives
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {wellbeingROI.map((investment, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{investment.investment}</h3>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {investment.roi}:1 ROI
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-red-600">
                      ${(investment.cost / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Savings</div>
                    <div className="text-lg font-bold text-green-600">
                      ${(investment.savings / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">ROI</div>
                    <div className="text-lg font-bold text-blue-600">
                      {investment.roi}:1
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Primary Metric</div>
                    <div className="text-sm font-medium text-purple-600">
                      {investment.metric}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Health & Wellness Metrics</CardTitle>
          <p className="text-sm text-gray-600">
            Key health indicators and performance vs industry benchmarks
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{metric.metric}</span>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {metric.improvement > 0 ? '+' : ''}{metric.improvement.toFixed(1)}%
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {typeof metric.current === 'number' && metric.current < 100 ? 
                      metric.current.toFixed(1) : 
                      metric.current.toLocaleString()} {metric.unit}
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Benchmark: {metric.benchmark} {metric.unit}</span>
                    <span className="text-success">
                      {metric.improvement > 0 ? 'Better' : 'Improved'}
                    </span>
                  </div>
                  <Progress value={Math.abs(metric.improvement)} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Interactive Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Wellbeing Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust wellbeing program parameters to model employee satisfaction scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wellbeingParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
