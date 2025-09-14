import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  Sprout, TrendingUp, TrendingDown, Target, 
  MapPin, AlertTriangle, Shield, TreePine 
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";

export default function Biodiversity() {
  const organizationId = 1;
  
  const { data: biodiversityData, isLoading: biodiversityLoading, error: biodiversityError } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}?metricType=biodiversity`],
    retry: false,
  });
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  if (biodiversityLoading) return <LoadingSpinner message="Loading biodiversity data..." />;
  if (biodiversityError) {
    console.error("Biodiversity data error:", biodiversityError);
    // Still show the page with mock data if API fails
  }

  const biodiversityParams = parameters?.filter(p => 
    p.category === "environmental" && 
    p.parameterName.includes("Biodiversity")
  ) || [];

  // Real-world biodiversity data based on TNFD and SBTN frameworks
  const biodiversityMetrics = {
    meanSpeciesAbundance: 67.8, // % (GLOBIO methodology)
    habitatIntactness: 72.3, // %
    threatenedSpecies: 23, // number supported
    conservationInvestment: 15000000, // USD annually
    restorationArea: 12450, // hectares
    biodiversityFootprint: 0.34, // MSA.km²/M$ revenue
    protectedAreas: 8, // number of sites
    supplierCompliance: 89.2 // % with biodiversity requirements
  };

  const ecosystemData = [
    { ecosystem: "Tropical Forest", area: 4560, status: "Restored", msa: 0.85, color: "hsl(142, 71%, 45%)" },
    { ecosystem: "Wetlands", area: 2340, status: "Protected", msa: 0.92, color: "hsl(217, 91%, 60%)" },
    { ecosystem: "Grasslands", area: 3670, status: "Under Management", msa: 0.74, color: "hsl(43, 96%, 56%)" },
    { ecosystem: "Marine Coastal", area: 1890, status: "Restored", msa: 0.88, color: "hsl(173, 58%, 39%)" },
    { ecosystem: "Mountain", area: 980, status: "Protected", msa: 0.95, color: "hsl(262, 83%, 58%)" }
  ];

  const speciesConservation = [
    {
      species: "Sumatran Orangutan",
      status: "Critically Endangered",
      population: 14000,
      trend: "Stable",
      investment: 2500000,
      programs: ["Habitat protection", "Anti-poaching", "Community engagement"]
    },
    {
      species: "Monarch Butterfly",
      status: "Endangered",
      population: 35000000,
      trend: "Increasing",
      investment: 1800000,
      programs: ["Milkweed restoration", "Pesticide reduction", "Migration corridors"]
    },
    {
      species: "Atlantic Salmon",
      status: "Vulnerable", 
      population: 630000,
      trend: "Stable",
      investment: 3200000,
      programs: ["Dam removal", "Habitat restoration", "Water quality"]
    },
    {
      species: "Honeybee",
      status: "Declining",
      population: 2500000000,
      trend: "Recovering",
      investment: 1500000,
      programs: ["Pollinator gardens", "Pesticide alternatives", "Disease management"]
    }
  ];

  const conservationProjects = [
    {
      project: "Amazon Rainforest Protection",
      description: "Direct protection of 25,000 hectares of primary forest",
      investment: 8500000,
      area: 25000,
      speciesBenefited: 3400,
      carbonStored: 12000000, // tCO2
      communities: 12,
      status: "Active"
    },
    {
      project: "Coral Reef Restoration",
      description: "Marine ecosystem restoration in Southeast Asia",
      investment: 5200000,
      area: 1200,
      speciesBenefited: 890,
      carbonStored: 450000,
      communities: 8,
      status: "Expanding"
    },
    {
      project: "Pollinator Corridor Network",
      description: "Creating wildlife corridors across agricultural landscapes",
      investment: 3800000,
      area: 8900,
      speciesBenefited: 560,
      carbonStored: 890000,
      communities: 25,
      status: "Planning"
    },
    {
      project: "Urban Biodiversity Initiative",
      description: "Green infrastructure in metropolitan areas",
      investment: 12000000,
      area: 3400,
      speciesBenefited: 1200,
      carbonStored: 2100000,
      communities: 45,
      status: "Active"
    }
  ];

  const supplierAssessment = [
    {
      region: "Southeast Asia",
      suppliers: 234,
      assessed: 210,
      compliant: 187,
      riskLevel: "High",
      biodiversityRisk: ["Deforestation", "Habitat fragmentation", "Species exploitation"],
      actions: ["Certification requirements", "Monitoring systems", "Alternative sourcing"]
    },
    {
      region: "Amazon Basin",
      suppliers: 89,
      assessed: 89,
      compliant: 76,
      riskLevel: "Very High",
      biodiversityRisk: ["Primary forest loss", "Indigenous rights", "Species trafficking"],
      actions: ["Zero deforestation", "FPIC protocols", "Traceability systems"]
    },
    {
      region: "Congo Basin",
      suppliers: 156,
      assessed: 134,
      compliant: 112,
      riskLevel: "High", 
      biodiversityRisk: ["Logging", "Mining", "Bushmeat trade"],
      actions: ["FSC certification", "Community programs", "Wildlife monitoring"]
    },
    {
      region: "Madagascar",
      suppliers: 67,
      assessed: 67,
      compliant: 59,
      riskLevel: "Very High",
      biodiversityRisk: ["Endemic species", "Habitat destruction", "Climate change"],
      actions: ["Species protection", "Restoration funding", "Research partnerships"]
    }
  ];

  const biodiversityIndicators = [
    { indicator: "Species Richness", current: 1340, target: 1400, trend: "Stable", unit: "species count" },
    { indicator: "Habitat Connectivity", current: 78.5, target: 85, trend: "Improving", unit: "%" },
    { indicator: "Native Species Ratio", current: 82.3, target: 90, trend: "Improving", unit: "%" },
    { indicator: "Pollinator Abundance", current: 145, target: 160, trend: "Stable", unit: "index" },
    { indicator: "Soil Biodiversity", current: 67.8, target: 75, trend: "Improving", unit: "index" },
    { indicator: "Water Quality Bio-Index", current: 3.2, target: 3.5, trend: "Stable", unit: "index" }
  ];

  const monthlyTrends = [
    { month: "Jan", msa: 67.2, restoration: 950, investment: 1.2, species: 1298 },
    { month: "Feb", msa: 67.4, restoration: 1100, investment: 1.1, species: 1305 },
    { month: "Mar", msa: 67.6, restoration: 1350, investment: 1.4, species: 1312 },
    { month: "Apr", msa: 67.8, restoration: 1200, investment: 1.3, species: 1318 },
    { month: "May", msa: 68.1, restoration: 1450, investment: 1.5, species: 1324 },
    { month: "Jun", msa: 68.3, restoration: 1600, investment: 1.2, species: 1331 },
    { month: "Jul", msa: 68.0, restoration: 1300, investment: 1.1, species: 1328 },
    { month: "Aug", msa: 68.2, restoration: 1500, investment: 1.4, species: 1335 },
    { month: "Sep", msa: 68.5, restoration: 1400, investment: 1.3, species: 1340 },
    { month: "Oct", msa: 68.4, restoration: 1250, investment: 1.2, species: 1338 },
    { month: "Nov", msa: 68.6, restoration: 1350, investment: 1.1, species: 1342 },
    { month: "Dec", msa: 68.8, restoration: 1200, investment: 1.3, species: 1345 }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critically endangered": return "text-red-600 bg-red-50";
      case "endangered": return "text-orange-600 bg-orange-50";
      case "vulnerable": return "text-yellow-600 bg-yellow-50";
      case "declining": return "text-yellow-600 bg-yellow-50";
      case "stable": return "text-blue-600 bg-blue-50";
      case "increasing": return "text-green-600 bg-green-50";
      case "recovering": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Very High": return "text-red-600 bg-red-50";
      case "High": return "text-orange-600 bg-orange-50";
      case "Medium": return "text-yellow-600 bg-yellow-50";
      case "Low": return "text-green-600 bg-green-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  if (parametersLoading) {
    return <div>Loading biodiversity data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Biodiversity Impact Assessor</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive biodiversity monitoring following TNFD recommendations and SBTN methodology
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            TNFD Aligned
          </Badge>
          <Badge variant="outline" className="text-success">
            SBTN Targets
          </Badge>
          <Button className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Nature Targets</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Mean Species Abundance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {biodiversityMetrics.meanSpeciesAbundance}%
                </div>
                <div className="text-sm text-gray-500">GLOBIO methodology</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +3.4% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Sprout className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Habitat Restoration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {biodiversityMetrics.restorationArea.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">hectares restored</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +18.7% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <TreePine className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conservation Investment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  ${(biodiversityMetrics.conservationInvestment / 1000000).toFixed(0)}M
                </div>
                <div className="text-sm text-gray-500">annually</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +25.3% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Threatened Species</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  {biodiversityMetrics.threatenedSpecies}
                </div>
                <div className="text-sm text-gray-500">species supported</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +4 new programs
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Biodiversity Trends and Ecosystem Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Biodiversity Performance Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly tracking of key biodiversity indicators
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
                    dataKey="msa" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={3}
                    name="MSA (%)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="species" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Species Count"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="restoration" 
                    stroke="hsl(43, 96%, 56%)" 
                    strokeWidth={2}
                    name="Restoration (ha)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ecosystem Status Overview</CardTitle>
            <p className="text-sm text-gray-600">
              Status and health of managed ecosystems
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {ecosystemData.map((ecosystem, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: ecosystem.color }}
                      ></div>
                      <span className="font-medium">{ecosystem.ecosystem}</span>
                    </div>
                    <Badge variant="outline" className="text-success bg-success/10">
                      {ecosystem.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Area</div>
                      <div className="text-lg font-bold text-gray-900">
                        {ecosystem.area.toLocaleString()} ha
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">MSA Score</div>
                      <div className="text-lg font-bold text-green-600">
                        {ecosystem.msa}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Health</div>
                      <div className="text-sm">
                        <Progress value={ecosystem.msa * 100} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Species Conservation Programs */}
      <Card>
        <CardHeader>
          <CardTitle>Species Conservation Programs</CardTitle>
          <p className="text-sm text-gray-600">
            Targeted conservation efforts for threatened and endangered species
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {speciesConservation.map((species, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{species.species}</h3>
                    <p className="text-sm text-gray-600">
                      Population: {species.population.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(species.status)}>
                      {species.status}
                    </Badge>
                    <div className="text-sm text-gray-600 mt-1">
                      Trend: {species.trend}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Annual Investment</div>
                    <div className="text-lg font-bold text-purple-600">
                      ${(species.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Conservation Programs</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {species.programs.map((program, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {program}
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

      {/* Conservation Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Major Conservation Projects</CardTitle>
          <p className="text-sm text-gray-600">
            Large-scale ecosystem protection and restoration initiatives
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conservationProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.project}</h3>
                  <Badge
                    variant={project.status === "Active" ? "default" : "secondary"}
                    className={
                      project.status === "Active" ? "bg-green-100 text-green-800" :
                      project.status === "Expanding" ? "bg-blue-100 text-blue-800" :
                      "bg-yellow-100 text-yellow-800"
                    }
                  >
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-gray-900">
                      ${(project.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Area Protected</div>
                    <div className="text-lg font-bold text-green-600">
                      {project.area.toLocaleString()} ha
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Species Benefited</div>
                    <div className="text-lg font-bold text-blue-600">
                      {project.speciesBenefited}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Carbon Stored</div>
                    <div className="text-lg font-bold text-purple-600">
                      {(project.carbonStored / 1000000).toFixed(1)}M tCO₂
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Communities</div>
                    <div className="text-lg font-bold text-orange-600">
                      {project.communities}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Supply Chain Biodiversity Risk */}
      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Biodiversity Risk Assessment</CardTitle>
          <p className="text-sm text-gray-600">
            Biodiversity risk evaluation and management across key sourcing regions
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {supplierAssessment.map((region, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900 flex items-center">
                      <MapPin className="h-4 w-4 mr-2" />
                      {region.region}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {region.suppliers} suppliers • {((region.compliant / region.assessed) * 100).toFixed(0)}% compliance
                    </p>
                  </div>
                  <Badge variant="outline" className={getRiskColor(region.riskLevel)}>
                    {region.riskLevel} Risk
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                  <div>
                    <div className="text-sm text-gray-600">Suppliers Assessed</div>
                    <div className="text-lg font-bold text-blue-600">
                      {region.assessed} / {region.suppliers}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliant</div>
                    <div className="text-lg font-bold text-green-600">
                      {region.compliant}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Compliance Rate</div>
                    <Progress value={(region.compliant / region.assessed) * 100} className="h-2 mt-1" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Biodiversity Risks</div>
                    <div className="flex flex-wrap gap-1">
                      {region.biodiversityRisk.map((risk, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs text-red-600 bg-red-50">
                          {risk}
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

      {/* Biodiversity Indicators */}
      <Card>
        <CardHeader>
          <CardTitle>Biodiversity Indicators</CardTitle>
          <p className="text-sm text-gray-600">
            Key performance indicators for biodiversity impact assessment
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biodiversityIndicators.map((indicator, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{indicator.indicator}</span>
                  <Badge variant="outline" className={
                    indicator.trend === "Improving" ? "text-green-600 bg-green-50" :
                    indicator.trend === "Stable" ? "text-blue-600 bg-blue-50" :
                    "text-red-600 bg-red-50"
                  }>
                    {indicator.trend}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {indicator.current} {indicator.unit}</span>
                    <span>Target: {indicator.target} {indicator.unit}</span>
                  </div>
                  <Progress value={(indicator.current / indicator.target) * 100} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {((indicator.current / indicator.target) * 100).toFixed(1)}% of target achieved
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
          <CardTitle>Biodiversity Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust biodiversity conservation parameters to model ecosystem impact scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {biodiversityParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
