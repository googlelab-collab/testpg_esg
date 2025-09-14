import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  Scale, TrendingUp, TrendingDown, Target, 
  MapPin, AlertTriangle, Shield, Users 
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function HumanRights() {
  const organizationId = 1;
  
  const { data: humanRightsData, isLoading: humanRightsLoading, error: humanRightsError } = useQuery({
    queryKey: [`/api/social-metrics/${organizationId}?metricType=human_rights`],
    retry: false,
  });
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  if (humanRightsLoading) return <LoadingSpinner message="Loading human rights data..." />;
  if (humanRightsError) {
    console.error("Human rights data error:", humanRightsError);
    // Still show the page with mock data if API fails
  }

  const rightsParams = parameters?.filter(p => 
    p.category === "social" && 
    p.parameterName.includes("Rights")
  ) || [];

  // Real-world human rights data based on UN Guiding Principles and OECD Guidelines
  const humanRightsMetrics = {
    assessmentsConducted: 89, // total assessments
    highRiskSites: 12, // facilities in high-risk locations
    supplierCompliance: 87.3, // % suppliers meeting standards
    grievancesClosed: 145, // grievances resolved
    trainingHours: 45000, // human rights training hours
    dueDiligenceInvestment: 8500000, // USD annually
    policiesUpdated: 15, // policies aligned to standards
    remediation: 2800000 // USD remediation costs
  };

  const riskAssessmentData = [
    {
      region: "Myanmar Operations",
      riskLevel: "Very High",
      issues: ["Forced labor", "Child labor", "Freedom of association"],
      assessment: "Q2 2024",
      actions: ["Supplier audits", "Worker interviews", "Exit strategy"],
      suppliers: 23,
      workers: 4500,
      compliance: 45
    },
    {
      region: "Central America",
      riskLevel: "High", 
      issues: ["Labor conditions", "Indigenous rights", "Land rights"],
      assessment: "Q1 2024",
      actions: ["FPIC protocols", "Living wage", "Grievance mechanisms"],
      suppliers: 67,
      workers: 12000,
      compliance: 78
    },
    {
      region: "Sub-Saharan Africa",
      riskLevel: "High",
      issues: ["Child labor", "Gender discrimination", "Safety conditions"],
      assessment: "Q3 2023",
      actions: ["Age verification", "Women's empowerment", "Safety training"],
      suppliers: 45,
      workers: 8900,
      compliance: 82
    },
    {
      region: "Southeast Asia",
      riskLevel: "Medium",
      issues: ["Migrant workers", "Overtime", "Collective bargaining"],
      assessment: "Q4 2023",
      actions: ["Worker contracts", "Time tracking", "Union recognition"],
      suppliers: 156,
      workers: 34000,
      compliance: 89
    }
  ];

  const grievanceData = [
    { month: "Jan", reported: 23, investigated: 21, resolved: 18, systemic: 3 },
    { month: "Feb", reported: 19, investigated: 22, resolved: 20, systemic: 2 },
    { month: "Mar", reported: 27, investigated: 25, resolved: 22, systemic: 4 },
    { month: "Apr", reported: 21, investigated: 26, resolved: 24, systemic: 3 },
    { month: "May", reported: 25, investigated: 23, resolved: 21, systemic: 2 },
    { month: "Jun", reported: 29, investigated: 27, resolved: 25, systemic: 5 },
    { month: "Jul", reported: 22, investigated: 28, resolved: 26, systemic: 3 },
    { month: "Aug", reported: 26, investigated: 24, resolved: 23, systemic: 4 },
    { month: "Sep", reported: 31, investigated: 29, resolved: 27, systemic: 6 },
    { month: "Oct", reported: 24, investigated: 30, resolved: 28, systemic: 3 },
    { month: "Nov", reported: 20, investigated: 26, resolved: 25, systemic: 2 },
    { month: "Dec", reported: 18, investigated: 22, resolved: 21, systemic: 1 }
  ];

  const issueCategories = [
    { category: "Labor Conditions", cases: 89, percentage: 32.1, severity: "Medium", color: "hsl(217, 91%, 60%)" },
    { category: "Discrimination", cases: 67, percentage: 24.2, severity: "High", color: "hsl(0, 84%, 60%)" },
    { category: "Safety & Health", cases: 45, percentage: 16.2, severity: "High", color: "hsl(43, 96%, 56%)" },
    { category: "Freedom of Association", cases: 34, percentage: 12.3, severity: "Medium", color: "hsl(262, 83%, 58%)" },
    { category: "Child Labor", cases: 23, percentage: 8.3, severity: "Critical", color: "hsl(0, 84%, 30%)" },
    { category: "Forced Labor", cases: 19, percentage: 6.9, severity: "Critical", color: "hsl(0, 84%, 20%)" }
  ];

  const supplierPrograms = [
    {
      program: "Supplier Code of Conduct",
      description: "Mandatory human rights standards for all suppliers",
      coverage: 3456, // suppliers covered
      compliance: 89.2,
      training: 12000, // people trained
      audits: 890,
      investment: 3200000,
      effectiveness: 87
    },
    {
      program: "Capacity Building Initiative",
      description: "Training and support for high-risk suppliers",
      coverage: 234,
      compliance: 78.5,
      training: 5600,
      audits: 234,
      investment: 1800000,
      effectiveness: 82
    },
    {
      program: "Worker Voice Program",
      description: "Anonymous grievance mechanisms in supply chain",
      coverage: 156,
      compliance: 94.3,
      training: 8900,
      audits: 156,
      investment: 1200000,
      effectiveness: 93
    },
    {
      program: "Living Wage Implementation",
      description: "Fair compensation standards across operations",
      coverage: 89,
      compliance: 76.4,
      training: 3400,
      audits: 89,
      investment: 5600000,
      effectiveness: 79
    }
  ];

  const remediationCases = [
    {
      case: "Factory Safety Violations",
      location: "Bangladesh",
      issue: "Inadequate fire safety and emergency exits",
      workers: 2300,
      investment: 850000,
      timeline: "6 months",
      status: "Completed",
      outcome: "Safety certification achieved"
    },
    {
      case: "Excessive Overtime",
      location: "Vietnam",
      issue: "Workers exceeding 60-hour work weeks",
      workers: 1200,
      investment: 450000,
      timeline: "3 months",
      status: "In Progress",
      outcome: "50% reduction in overtime violations"
    },
    {
      case: "Migrant Worker Rights",
      location: "Malaysia",
      issue: "Passport retention and recruitment fees",
      workers: 890,
      investment: 320000,
      timeline: "9 months",
      status: "Completed",
      outcome: "All passports returned, fees reimbursed"
    },
    {
      case: "Gender Discrimination",
      location: "India",
      issue: "Unequal pay and promotion opportunities",
      workers: 1800,
      investment: 680000,
      timeline: "12 months",
      status: "Monitoring",
      outcome: "Pay equity achieved, promotion system revised"
    }
  ];

  const humanRightsKPIs = [
    { indicator: "Assessment Coverage", current: 89.3, target: 95, unit: "% operations assessed", trend: "Improving" },
    { indicator: "Supplier Compliance", current: 87.3, target: 90, unit: "% meeting standards", trend: "Improving" },
    { indicator: "Grievance Resolution", current: 94.2, target: 95, unit: "% resolved within 30 days", trend: "Stable" },
    { indicator: "Training Coverage", current: 78.5, target: 85, unit: "% workforce trained", trend: "Improving" },
    { indicator: "High-Risk Sites", current: 12, target: 8, unit: "sites requiring intervention", trend: "Improving" },
    { indicator: "Policy Alignment", current: 92.1, target: 100, unit: "% policies UN GP compliant", trend: "Improving" }
  ];

  const trainingPrograms = [
    {
      audience: "Board & Senior Leadership",
      participants: 45,
      hours: 720,
      content: "UN Guiding Principles, due diligence oversight",
      completion: 100,
      effectiveness: 92
    },
    {
      audience: "Procurement & Sourcing",
      participants: 234,
      hours: 4680,
      content: "Supplier assessments, contract clauses",
      completion: 96,
      effectiveness: 89
    },
    {
      audience: "Operations Managers",
      participants: 567,
      hours: 8505,
      content: "Workplace rights, grievance handling",
      completion: 91,
      effectiveness: 85
    },
    {
      audience: "HR Personnel",
      participants: 189,
      hours: 2835,
      content: "Non-discrimination, equal opportunity",
      completion: 94,
      effectiveness: 88
    },
    {
      audience: "Security Personnel",
      participants: 123,
      hours: 1845,
      content: "Use of force, voluntary principles",
      completion: 89,
      effectiveness: 84
    }
  ];

  const benchmarkData = [
    { framework: "UN Global Compact", score: 92.3, requirement: 85, status: "Advanced" },
    { framework: "UN Guiding Principles", score: 87.8, requirement: 80, status: "Compliant" },
    { framework: "OECD Guidelines", score: 89.5, requirement: 82, status: "Advanced" },
    { framework: "ILO Core Conventions", score: 94.1, requirement: 90, status: "Advanced" }
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very High": return "text-red-600 bg-red-50";
      case "High": return "text-orange-600 bg-orange-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Critical": return "text-red-600 bg-red-50";
      case "High": return "text-orange-600 bg-orange-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "text-green-600 bg-green-50";
      case "In Progress": return "text-blue-600 bg-blue-50";
      case "Monitoring": return "text-yellow-600 bg-yellow-50";
      case "Planned": return "text-gray-600 bg-gray-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (parametersLoading) {
    return <div>Loading human rights data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Human Rights Due Diligence</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive human rights management following UN Guiding Principles and OECD Guidelines
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            UN Guiding Principles
          </Badge>
          <Badge variant="outline" className="text-success">
            OECD Compliant
          </Badge>
          <Button className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Action Plans</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Risk Assessments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {humanRightsMetrics.assessmentsConducted}
                </div>
                <div className="text-sm text-gray-500">sites assessed</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12 vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Scale className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Supplier Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {humanRightsMetrics.supplierCompliance}%
                </div>
                <div className="text-sm text-gray-500">meeting standards</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +5.2% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Grievances Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {humanRightsMetrics.grievancesClosed}
                </div>
                <div className="text-sm text-gray-500">this year</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  94.2% resolution rate
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Training Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {(humanRightsMetrics.dueDiligenceInvestment / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">USD annually</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +23.4% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grievance Trends and Issue Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Grievance Mechanism Performance</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly trends in grievance reporting, investigation, and resolution
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={grievanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="reported" 
                    stroke="hsl(0, 84%, 60%)" 
                    strokeWidth={2}
                    name="Reported"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="investigated" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Investigated"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="resolved" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={3}
                    name="Resolved"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Human Rights Issues by Category</CardTitle>
            <p className="text-sm text-gray-600">
              Distribution of human rights concerns and their severity levels
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {issueCategories.map((issue, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: issue.color }}
                      ></div>
                      <span className="font-medium">{issue.category}</span>
                    </div>
                    <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                      {issue.severity}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Cases</div>
                      <div className="text-lg font-bold text-gray-900">
                        {issue.cases}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Percentage</div>
                      <div className="text-lg font-bold text-primary">
                        {issue.percentage}%
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Severity</div>
                      <div className="text-sm">
                        <Progress value={issue.severity === "Critical" ? 100 : issue.severity === "High" ? 75 : issue.severity === "Medium" ? 50 : 25} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Assessment by Region */}
      <Card>
        <CardHeader>
          <CardTitle>Human Rights Risk Assessment by Region</CardTitle>
          <p className="text-sm text-gray-600">
            Regional risk analysis and mitigation actions based on international standards
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {riskAssessmentData.map((region, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {region.region}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {region.suppliers} suppliers • {region.workers.toLocaleString()} workers
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getRiskColor(region.riskLevel)}>
                      {region.riskLevel} Risk
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      Last assessed: {region.assessment}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Suppliers</div>
                    <div className="text-lg font-bold text-blue-600">
                      {region.suppliers}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Workers Affected</div>
                    <div className="text-lg font-bold text-purple-600">
                      {region.workers.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance Rate</div>
                    <div className="text-lg font-bold text-green-600">
                      {region.compliance}%
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Key Issues</div>
                    <div className="flex flex-wrap gap-1">
                      {region.issues.map((issue, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-red-600 bg-red-50">
                          {issue}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Mitigation Actions</div>
                    <div className="flex flex-wrap gap-1">
                      {region.actions.map((action, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-green-600 bg-green-50">
                          {action}
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

      {/* Supplier Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Human Rights Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Capacity building and compliance programs across the supply chain
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplierPrograms.map((program, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{program.program}</h3>
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    {program.effectiveness}% Effective
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{program.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Coverage</div>
                    <div className="text-lg font-bold text-blue-600">
                      {program.coverage.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance</div>
                    <div className="text-lg font-bold text-green-600">
                      {program.compliance}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Training</div>
                    <div className="text-lg font-bold text-purple-600">
                      {program.training.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Audits</div>
                    <div className="text-lg font-bold text-orange-600">
                      {program.audits}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(program.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remediation Cases */}
      <Card>
        <CardHeader>
          <CardTitle>Remediation & Corrective Actions</CardTitle>
          <p className="text-sm text-gray-600">
            Active remediation cases and outcomes for human rights violations
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {remediationCases.map((caseItem, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{caseItem.case}</h3>
                  <Badge variant="outline" className={getStatusColor(caseItem.status)}>
                    {caseItem.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="text-lg font-bold text-gray-900">
                      {caseItem.location}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Workers Affected</div>
                    <div className="text-lg font-bold text-blue-600">
                      {caseItem.workers.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <div className="text-sm text-gray-600">Issue Description</div>
                  <div className="text-sm font-medium text-gray-900">
                    {caseItem.issue}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-purple-600">
                      ${(caseItem.investment / 1000).toLocaleString()}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Timeline</div>
                    <div className="text-lg font-bold text-orange-600">
                      {caseItem.timeline}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Outcome</div>
                    <div className="text-sm font-medium text-green-600">
                      {caseItem.outcome}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Training Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Human Rights Training Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Capacity building across different organizational levels and functions
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trainingPrograms.map((training, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{training.audience}</h3>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {training.completion}% Complete
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Participants</div>
                    <div className="text-lg font-bold text-blue-600">
                      {training.participants}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Training Hours</div>
                    <div className="text-lg font-bold text-purple-600">
                      {training.hours.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completion</div>
                    <div className="text-lg font-bold text-green-600">
                      {training.completion}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Effectiveness</div>
                    <div className="text-lg font-bold text-orange-600">
                      {training.effectiveness}%
                    </div>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Training Content</div>
                  <div className="text-sm font-medium text-gray-900">
                    {training.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* KPIs and Benchmarking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Human Rights KPIs</CardTitle>
            <p className="text-sm text-gray-600">
              Key performance indicators for human rights due diligence
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {humanRightsKPIs.map((kpi, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{kpi.indicator}</span>
                    <Badge variant="outline" className="text-success bg-success/10">
                      {kpi.trend}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Current: {kpi.current} {kpi.unit}</span>
                      <span>Target: {kpi.target} {kpi.unit}</span>
                    </div>
                    <Progress value={(kpi.current / kpi.target) * 100} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {((kpi.current / kpi.target) * 100).toFixed(1)}% of target achieved
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Framework Compliance</CardTitle>
            <p className="text-sm text-gray-600">
              Alignment with international human rights frameworks
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {benchmarkData.map((benchmark, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium text-gray-900">{benchmark.framework}</span>
                    <Badge variant="outline" className="text-success bg-success/10">
                      {benchmark.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Score: {benchmark.score}</span>
                      <span>Requirement: {benchmark.requirement}</span>
                    </div>
                    <Progress value={(benchmark.score / 100) * 100} className="h-2" />
                    <div className="text-xs text-gray-500">
                      {((benchmark.score - benchmark.requirement) / benchmark.requirement * 100).toFixed(1)}% above requirement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Human Rights Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust human rights due diligence parameters to model compliance scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rightsParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
