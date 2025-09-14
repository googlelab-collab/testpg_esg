import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  Building, CheckCircle, AlertTriangle, Users, 
  Shield, Clock, Award, MapPin
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function SupplyLabor() {
  const organizationId = 1;
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  const supplyLaborParams = parameters?.filter(p => 
    p.category === "Social" && 
    p.parameterName.includes("Supply")
  ) || [];

  // Real-world supply chain labor data based on ILO Global Estimates
  const laborMetrics = {
    totalSuppliers: 2847,
    auditedSuppliers: 2278, // 80%
    compliantSuppliers: 2051, // 90% of audited
    workersImpacted: 456780,
    criticalNonCompliance: 89,
    improvedSuppliers: 187,
    capacityBuildingPrograms: 34,
    grievancesClosed: 156,
    laborScore: 87.3,
  };

  const complianceCategories = [
    { category: "Working Hours", compliant: 92, nonCompliant: 8, critical: 2 },
    { category: "Fair Wages", compliant: 88, nonCompliant: 12, critical: 3 },
    { category: "Freedom of Association", compliant: 94, nonCompliant: 6, critical: 1 },
    { category: "Child Labor", compliant: 98, nonCompliant: 2, critical: 1 },
    { category: "Forced Labor", compliant: 96, nonCompliant: 4, critical: 2 },
    { category: "Discrimination", compliant: 91, nonCompliant: 9, critical: 2 },
    { category: "Health & Safety", compliant: 85, nonCompliant: 15, critical: 4 }
  ];

  const regionBreakdown = [
    { region: "Asia Pacific", suppliers: 1245, workers: 234560, compliance: 85, color: "hsl(142, 71%, 45%)" },
    { region: "Europe", suppliers: 567, workers: 89340, compliance: 94, color: "hsl(217, 91%, 60%)" },
    { region: "North America", suppliers: 445, workers: 67890, compliance: 96, color: "hsl(43, 96%, 56%)" },
    { region: "Latin America", suppliers: 389, workers: 45680, compliance: 78, color: "hsl(262, 83%, 58%)" },
    { region: "Africa", suppliers: 201, workers: 19310, compliance: 72, color: "hsl(0, 84%, 60%)" }
  ];

  const auditPrograms = [
    {
      name: "Tier 1 Supplier Audits",
      description: "Annual comprehensive audits of direct suppliers",
      coverage: 95,
      frequency: "Annual",
      standards: "ILO Core Conventions, SA8000",
      findings: "94% compliance rate",
      status: "Active"
    },
    {
      name: "Tier 2 Risk Assessment",
      description: "Risk-based assessments of critical sub-suppliers",
      coverage: 67,
      frequency: "Bi-Annual",
      standards: "ILO Declaration, Local Laws",
      findings: "23 high-risk suppliers identified",
      status: "Expanding"
    },
    {
      name: "Worker Voice Surveys",
      description: "Anonymous worker feedback and grievance mechanisms",
      coverage: 78,
      frequency: "Continuous",
      standards: "UN Guiding Principles",
      findings: "4.2/5 worker satisfaction",
      status: "Active"
    }
  ];

  const capacityBuilding = [
    { program: "Management Training", participants: 1245, suppliers: 234, cost: 450000, outcomes: "32% improvement in compliance" },
    { program: "Worker Education", participants: 23456, suppliers: 189, cost: 280000, outcomes: "89% awareness increase" },
    { program: "Grievance Systems", participants: 567, suppliers: 145, cost: 320000, outcomes: "78% faster resolution" },
    { program: "Safety Protocols", participants: 3456, suppliers: 278, cost: 520000, outcomes: "45% reduction in incidents" }
  ];

  const monthlyTrends = [
    { month: "Jan", audits: 189, compliance: 86.2, grievances: 12, improvements: 8 },
    { month: "Feb", audits: 201, compliance: 86.8, grievances: 15, improvements: 12 },
    { month: "Mar", audits: 234, compliance: 87.1, grievances: 18, improvements: 15 },
    { month: "Apr", audits: 198, compliance: 86.9, grievances: 14, improvements: 11 },
    { month: "May", audits: 267, compliance: 87.4, grievances: 21, improvements: 18 },
    { month: "Jun", audits: 223, compliance: 87.2, grievances: 16, improvements: 14 },
    { month: "Jul", audits: 189, compliance: 87.6, grievances: 13, improvements: 16 },
    { month: "Aug", audits: 245, compliance: 87.8, grievances: 19, improvements: 20 },
    { month: "Sep", audits: 212, compliance: 87.5, grievances: 17, improvements: 13 },
    { month: "Oct", audits: 278, compliance: 88.1, grievances: 22, improvements: 25 },
    { month: "Nov", audits: 256, compliance: 87.9, grievances: 18, improvements: 19 },
    { month: "Dec", audits: 234, compliance: 88.3, grievances: 20, improvements: 22 }
  ];

  const riskAssessment = {
    highRisk: 187, // suppliers
    mediumRisk: 456,
    lowRisk: 1635,
    geographicRisk: ["Myanmar", "Bangladesh", "Pakistan"],
    sectorRisk: ["Textiles", "Electronics", "Agriculture"],
    issueRisk: ["Working Hours", "Wages", "Safety"]
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 95) return "text-success";
    if (percentage >= 85) return "text-warning";
    return "text-error";
  };

  if (parametersLoading) {
    return <div>Loading supply chain labor data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Supply Chain Labor Monitor</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive supply chain labor standards monitoring and compliance tracking
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            UN Global Compact
          </Badge>
          <Badge variant="outline" className="text-success">
            {laborMetrics.laborScore}/100 Labor Score
          </Badge>
          <Button className="flex items-center space-x-2">
            <Building className="h-4 w-4" />
            <span>Labor Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Supplier Coverage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {((laborMetrics.auditedSuppliers / laborMetrics.totalSuppliers) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500">
                  {laborMetrics.auditedSuppliers} of {laborMetrics.totalSuppliers}
                </div>
                <div className="text-sm text-success mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  +5% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Building className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Compliance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">
                  {((laborMetrics.compliantSuppliers / laborMetrics.auditedSuppliers) * 100).toFixed(0)}%
                </div>
                <div className="text-sm text-gray-500">
                  {laborMetrics.compliantSuppliers} compliant
                </div>
                <div className="text-sm text-success mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  ILO standards met
                </div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Workers Impacted</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-secondary">
                  {(laborMetrics.workersImpacted / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">across supply chain</div>
                <div className="text-sm text-success mt-1">
                  <Users className="h-3 w-3 inline mr-1" />
                  Direct & indirect
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Critical Issues</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {laborMetrics.criticalNonCompliance}
                </div>
                <div className="text-sm text-gray-500">requiring action</div>
                <div className="text-sm text-warning mt-1">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  -23% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Compliance and Monthly Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Regional Compliance Overview</CardTitle>
            <p className="text-sm text-gray-600">
              Supplier distribution and compliance rates by region
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {regionBreakdown.map((region, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: region.color }}
                      ></div>
                      <span className="font-medium">{region.region}</span>
                    </div>
                    <Badge variant="outline" className={getComplianceColor(region.compliance)}>
                      {region.compliance}% Compliant
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-3">
                    <div>
                      <div className="text-sm text-gray-600">Suppliers</div>
                      <div className="text-lg font-bold text-gray-900">
                        {region.suppliers.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Workers</div>
                      <div className="text-lg font-bold text-primary">
                        {region.workers.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Compliance</div>
                      <div className={`text-lg font-bold ${getComplianceColor(region.compliance)}`}>
                        {region.compliance}%
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Performance Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Audit activity and compliance improvements over time
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
                    dataKey="compliance" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={3}
                    name="Compliance %"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="audits" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Audits Completed"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="improvements" 
                    stroke="hsl(43, 96%, 56%)" 
                    strokeWidth={2}
                    name="Improvements"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Labor Standards Compliance</CardTitle>
          <p className="text-sm text-gray-600">
            Compliance rates across ILO Core Labor Standards categories
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceCategories.map((category, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{category.category}</span>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getComplianceColor(category.compliant)}>
                      {category.compliant}% Compliant
                    </Badge>
                    {category.critical > 0 && (
                      <Badge variant="outline" className="text-error bg-error/10">
                        {category.critical} Critical
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Progress value={category.compliant} className="h-2" />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Compliant: {category.compliant}%</span>
                    <span>Non-compliant: {category.nonCompliant}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Audit Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Audit & Assessment Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Comprehensive labor standards monitoring and verification programs
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {auditPrograms.map((program, index) => (
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
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Coverage</div>
                    <div className="text-lg font-bold text-primary">
                      {program.coverage}%
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Frequency</div>
                    <div className="text-lg font-bold text-gray-900">
                      {program.frequency}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Standards</div>
                    <div className="text-sm font-bold text-secondary">
                      {program.standards}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Key Findings</div>
                    <div className="text-sm font-bold text-success">
                      {program.findings}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Capacity Building */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity Building Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Supplier and worker training programs to improve labor standards
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {capacityBuilding.map((program, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{program.program}</span>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {program.suppliers} Suppliers
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Participants</div>
                    <div className="text-lg font-bold text-primary">
                      {program.participants.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Suppliers</div>
                    <div className="text-lg font-bold text-gray-900">
                      {program.suppliers}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-secondary">
                      ${(program.cost / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Outcomes</div>
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

      {/* Risk Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Risk Assessment</CardTitle>
          <p className="text-sm text-gray-600">
            Risk categorization and high-risk area identification
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-medium text-gray-900 mb-4">Risk Distribution</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">High Risk</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-error rounded-full"></div>
                    <span className="text-sm font-medium">{riskAssessment.highRisk}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Medium Risk</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-warning rounded-full"></div>
                    <span className="text-sm font-medium">{riskAssessment.mediumRisk}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Low Risk</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 h-2 bg-success rounded-full"></div>
                    <span className="text-sm font-medium">{riskAssessment.lowRisk}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-4">High-Risk Areas</h4>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600">Geographic Risk</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {riskAssessment.geographicRisk.map((country, index) => (
                      <Badge key={index} variant="outline" className="text-error bg-error/10">
                        {country}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Sector Risk</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {riskAssessment.sectorRisk.map((sector, index) => (
                      <Badge key={index} variant="outline" className="text-warning bg-warning/10">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600">Issue Risk</div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {riskAssessment.issueRisk.map((issue, index) => (
                      <Badge key={index} variant="outline" className="text-accent bg-accent/10">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Labor Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust supply chain monitoring parameters to model labor standards improvement scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplyLaborParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
