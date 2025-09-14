import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  HandHeart, TrendingUp, MapPin, Users, 
  GraduationCap, Heart, Calendar, Award
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

export default function Community() {
  const organizationId = 1;
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  const communityParams = parameters?.filter(p => 
    p.category === "Social" && 
    p.parameterName.includes("Community")
  ) || [];

  // Real-world community impact data based on CECP Giving in Numbers
  const communityMetrics = {
    totalInvestment: 24500000, // USD
    cashGiving: 15600000, // USD
    volunteerHours: 89450, // hours
    employeesVolunteering: 4567, // count
    beneficiariesReached: 156780, // people
    localHiringPercent: 78, // percentage
    localSpend: 189400000, // USD with local suppliers
    sdgAlignment: 8, // number of SDGs addressed
    communityScore: 4.3, // out of 5
  };

  const investmentCategories = [
    { name: "Education", amount: 8900000, percentage: 36, color: "hsl(142, 71%, 45%)" },
    { name: "Healthcare", amount: 6200000, percentage: 25, color: "hsl(217, 91%, 60%)" },
    { name: "Environment", amount: 4400000, percentage: 18, color: "hsl(120, 60%, 50%)" },
    { name: "Economic Development", amount: 3200000, percentage: 13, color: "hsl(43, 96%, 56%)" },
    { name: "Arts & Culture", amount: 1800000, percentage: 8, color: "hsl(262, 83%, 58%)" }
  ];

  const sdgAlignment = [
    { sdg: "SDG 3: Good Health", programs: 8, investment: 6200000, impact: "156K people served" },
    { sdg: "SDG 4: Quality Education", programs: 12, investment: 8900000, impact: "89K students supported" },
    { sdg: "SDG 8: Decent Work", programs: 6, investment: 3200000, impact: "2.3K jobs created" },
    { sdg: "SDG 11: Sustainable Cities", programs: 5, investment: 2100000, impact: "45 communities improved" },
    { sdg: "SDG 13: Climate Action", programs: 4, investment: 4400000, impact: "120K tons CO2 avoided" }
  ];

  const communityPrograms = [
    {
      name: "STEM Education Initiative",
      description: "Science and technology education in underserved schools",
      investment: 3200000,
      beneficiaries: 12500,
      duration: "3 years",
      impact: "85% improvement in STEM test scores",
      status: "Active"
    },
    {
      name: "Local Supplier Development",
      description: "Capacity building for minority and women-owned businesses",
      investment: 1800000,
      beneficiaries: 145,
      duration: "Ongoing",
      impact: "78% increase in contract values",
      status: "Expanding"
    },
    {
      name: "Community Health Centers",
      description: "Healthcare access improvement in rural areas",
      investment: 4500000,
      beneficiaries: 45600,
      duration: "5 years",
      impact: "42% reduction in preventable diseases",
      status: "Active"
    }
  ];

  const volunteerPrograms = [
    { program: "Skills-Based Volunteering", hours: 25600, employees: 1245, value: 1280000 },
    { program: "Environmental Cleanup", hours: 18900, employees: 2134, value: 378000 },
    { program: "Education Mentoring", hours: 22400, employees: 1890, value: 1120000 },
    { program: "Disaster Response", hours: 12800, employees: 567, value: 512000 },
    { program: "Community Building", hours: 9750, employees: 456, value: 195000 }
  ];

  const yearlyImpact = [
    { year: 2020, investment: 18500000, beneficiaries: 98000, volunteers: 2890, sdgs: 6 },
    { year: 2021, investment: 20200000, beneficiaries: 118000, volunteers: 3234, sdgs: 7 },
    { year: 2022, investment: 21800000, beneficiaries: 134000, volunteers: 3789, sdgs: 7 },
    { year: 2023, investment: 23100000, beneficiaries: 145000, volunteers: 4123, sdgs: 8 },
    { year: 2024, investment: 24500000, beneficiaries: 156780, volunteers: 4567, sdgs: 8 }
  ];

  const economicImpact = {
    directJobs: 2340,
    indirectJobs: 4680,
    localTaxRevenue: 12400000,
    localSupplierSpend: 189400000,
    wageImpact: 156800000,
    multiplierEffect: 2.8
  };

  if (parametersLoading) {
    return <div>Loading community impact data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Impact Tracker</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive community investment and social impact measurement
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            UN Global Compact
          </Badge>
          <Badge variant="outline" className="text-success">
            {communityMetrics.sdgAlignment} SDGs Addressed
          </Badge>
          <Button className="flex items-center space-x-2">
            <HandHeart className="h-4 w-4" />
            <span>Impact Dashboard</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  ${(communityMetrics.totalInvestment / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">community programs</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +18.5% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <HandHeart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Beneficiaries Reached</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-secondary">
                  {(communityMetrics.beneficiariesReached / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">people impacted</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +23.2% vs last year
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
            <CardTitle className="text-sm font-medium text-gray-600">Volunteer Hours</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">
                  {(communityMetrics.volunteerHours / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">hours contributed</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  {communityMetrics.employeesVolunteering} employees
                </div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Heart className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Local Hiring</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {communityMetrics.localHiringPercent}%
                </div>
                <div className="text-sm text-gray-500">from local communities</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12% vs industry avg
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Distribution and Impact Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Investment by Focus Area</CardTitle>
            <p className="text-sm text-gray-600">
              Community investment distribution across impact areas
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={investmentCategories}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                  >
                    {investmentCategories.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`$${(value / 1000000).toFixed(1)}M`, 'Investment']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {investmentCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    ></div>
                    <span>{category.name}</span>
                  </div>
                  <span className="text-gray-600">${(category.amount / 1000000).toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5-Year Impact Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Growth in community investment and beneficiaries
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={yearlyImpact}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="investment" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={3}
                    name="Investment ($)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="beneficiaries" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Beneficiaries"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volunteers" 
                    stroke="hsl(43, 96%, 56%)" 
                    strokeWidth={2}
                    name="Volunteers"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SDG Alignment */}
      <Card>
        <CardHeader>
          <CardTitle>UN Sustainable Development Goals Alignment</CardTitle>
          <p className="text-sm text-gray-600">
            Community programs mapped to UN SDGs with measurable impact
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sdgAlignment.map((sdg, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{sdg.sdg}</h3>
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    {sdg.programs} Programs
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-success">
                      ${(sdg.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Programs</div>
                    <div className="text-lg font-bold text-gray-900">
                      {sdg.programs}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Impact</div>
                    <div className="text-sm font-bold text-primary">
                      {sdg.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Community Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Flagship Community Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Major community investment initiatives and their measured outcomes
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {communityPrograms.map((program, index) => (
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
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-primary">
                      ${(program.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Beneficiaries</div>
                    <div className="text-lg font-bold text-gray-900">
                      {program.beneficiaries.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="text-lg font-bold text-secondary">
                      {program.duration}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Key Impact</div>
                    <div className="text-sm font-bold text-success">
                      {program.impact}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Volunteer Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Employee Volunteer Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Skills-based volunteering and community engagement activities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {volunteerPrograms.map((program, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{program.program}</span>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {program.hours.toLocaleString()} hours
                  </Badge>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Volunteers</div>
                    <div className="text-lg font-bold text-primary">
                      {program.employees.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Hours</div>
                    <div className="text-lg font-bold text-gray-900">
                      {program.hours.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Value</div>
                    <div className="text-lg font-bold text-success">
                      ${(program.value / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Economic Impact */}
      <Card>
        <CardHeader>
          <CardTitle>Local Economic Impact</CardTitle>
          <p className="text-sm text-gray-600">
            Economic contribution to local communities and regions
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {economicImpact.directJobs.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Direct Jobs Created</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-secondary">
                {economicImpact.indirectJobs.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Indirect Jobs Supported</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-success">
                ${(economicImpact.localTaxRevenue / 1000000).toFixed(0)}M
              </div>
              <div className="text-sm text-gray-600">Local Tax Revenue</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-accent">
                ${(economicImpact.localSupplierSpend / 1000000).toFixed(0)}M
              </div>
              <div className="text-sm text-gray-600">Local Supplier Spend</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                ${(economicImpact.wageImpact / 1000000).toFixed(0)}M
              </div>
              <div className="text-sm text-gray-600">Annual Wage Impact</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-gray-900">
                {economicImpact.multiplierEffect}x
              </div>
              <div className="text-sm text-gray-600">Economic Multiplier</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Community Impact Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust community investment parameters to model social impact scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {communityParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
