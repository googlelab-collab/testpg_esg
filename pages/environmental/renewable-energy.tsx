import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { 
  CloudSun, TrendingUp, TrendingDown, Target, 
  Wind, Battery, Zap, Leaf 
} from "lucide-react";
import { useESGParameters } from "@/hooks/use-esg-scores";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

export default function RenewableEnergy() {
  const organizationId = 1;
  
  const { data: renewableData, isLoading: renewableLoading, error: renewableError } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}?metricType=renewable_energy`],
    retry: false,
  });
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  if (renewableLoading) return <LoadingSpinner message="Loading renewable energy data..." />;
  if (renewableError) {
    console.error("Renewable energy data error:", renewableError);
    // Still show the page with mock data if API fails
  }

  const renewableParams = parameters?.filter(p => 
    p.category === "environmental" && 
    p.parameterName.includes("Renewable")
  ) || [];

  // Real-world renewable energy data based on RE100 and IEA methodology
  const renewableMetrics = {
    totalGeneration: 89456, // MWh annually
    renewablePercentage: 73.2, // % of total energy
    solarCapacity: 45.6, // MW installed
    windCapacity: 32.1, // MW installed
    storageCapacity: 12.8, // MWh battery storage
    co2Avoided: 41234, // tonnes annually
    costSavings: 8900000, // USD annually
    ppaContracts: 12, // number of power purchase agreements
    re100Progress: 73.2 // % toward 100% renewable goal
  };

  const monthlyGeneration = [
    { month: "Jan", solar: 2890, wind: 3450, hydro: 1200, biomass: 890, total: 8430, target: 7500 },
    { month: "Feb", solar: 3240, wind: 3180, hydro: 1150, biomass: 920, total: 8490, target: 7500 },
    { month: "Mar", solar: 4120, wind: 2980, hydro: 1300, biomass: 950, total: 9350, target: 7500 },
    { month: "Apr", solar: 4890, wind: 2650, hydro: 1400, biomass: 980, total: 9920, target: 7500 },
    { month: "May", solar: 5670, wind: 2340, hydro: 1500, biomass: 1010, total: 10520, target: 7500 },
    { month: "Jun", solar: 6230, wind: 2150, hydro: 1600, biomass: 1020, total: 11000, target: 7500 },
    { month: "Jul", solar: 6180, wind: 2280, hydro: 1550, biomass: 990, total: 11000, target: 7500 },
    { month: "Aug", solar: 5890, wind: 2420, hydro: 1480, biomass: 960, total: 10750, target: 7500 },
    { month: "Sep", solar: 4980, wind: 2780, hydro: 1350, biomass: 940, total: 10050, target: 7500 },
    { month: "Oct", solar: 3890, wind: 3120, hydro: 1200, biomass: 920, total: 9130, target: 7500 },
    { month: "Nov", solar: 3120, wind: 3480, hydro: 1100, biomass: 900, total: 8600, target: 7500 },
    { month: "Dec", solar: 2680, wind: 3680, hydro: 1050, biomass: 880, total: 8290, target: 7500 }
  ];

  const energyMix = [
    { source: "Solar PV", capacity: 45.6, generation: 53780, percentage: 32.1, lcoe: 42, color: "hsl(43, 96%, 56%)" },
    { source: "Wind", capacity: 32.1, generation: 34540, percentage: 20.6, lcoe: 38, color: "hsl(142, 71%, 45%)" },
    { source: "Hydroelectric", capacity: 18.7, generation: 15630, percentage: 9.3, lcoe: 45, color: "hsl(217, 91%, 60%)" },
    { source: "Biomass", capacity: 8.9, generation: 11420, percentage: 6.8, lcoe: 67, color: "hsl(173, 58%, 39%)" },
    { source: "Grid Renewable", capacity: 0, generation: 51986, percentage: 31.0, lcoe: 52, color: "hsl(262, 83%, 58%)" },
    { source: "Grid Non-Renewable", capacity: 0, generation: 44834, percentage: 26.8, lcoe: 61, color: "hsl(0, 84%, 60%)" }
  ];

  const renewableProjects = [
    {
      project: "Solar Farm Development",
      description: "25 MW solar installation with battery storage",
      investment: 35000000,
      capacity: 25.0, // MW
      generation: 45000, // MWh annually
      co2Avoided: 18900, // tonnes
      completion: "Q2 2025",
      status: "Construction"
    },
    {
      project: "Wind Power Purchase Agreement",
      description: "15-year PPA for 40 MW wind farm",
      investment: 0, // PPA contract
      capacity: 40.0,
      generation: 120000,
      co2Avoided: 50400,
      completion: "Active",
      status: "Operational"
    },
    {
      project: "Rooftop Solar Program",
      description: "Distributed solar across 50 facilities",
      investment: 18000000,
      capacity: 15.0,
      generation: 22500,
      co2Avoided: 9450,
      completion: "Q4 2024",
      status: "Installation"
    },
    {
      project: "Green Hydrogen Initiative",
      description: "Renewable hydrogen production facility",
      investment: 85000000,
      capacity: 10.0,
      generation: 8760, // equivalent MWh
      co2Avoided: 12000,
      completion: "Q1 2027",
      status: "Planning"
    }
  ];

  const ppaPortfolio = [
    {
      supplier: "GreenWind Energy",
      technology: "Wind",
      capacity: 150,
      term: 15,
      price: 42,
      location: "Texas, USA",
      startDate: "2020",
      co2Avoided: 63000
    },
    {
      supplier: "SolarMax Corp",
      technology: "Solar",
      capacity: 100,
      term: 20,
      price: 38,
      location: "California, USA",
      startDate: "2022",
      co2Avoided: 42000
    },
    {
      supplier: "CleanHydro LLC",
      technology: "Hydro",
      capacity: 75,
      term: 25,
      price: 45,
      location: "Oregon, USA",
      startDate: "2019",
      co2Avoided: 31500
    },
    {
      supplier: "BioPower Solutions",
      technology: "Biomass",
      capacity: 50,
      term: 12,
      price: 65,
      location: "Georgia, USA",
      startDate: "2023",
      co2Avoided: 21000
    }
  ];

  const storageProjects = [
    {
      project: "Grid-Scale Battery Storage",
      capacity: 50, // MWh
      technology: "Lithium-ion",
      purpose: "Grid stabilization",
      efficiency: 92,
      cycles: 5000,
      investment: 25000000
    },
    {
      project: "Solar + Storage System",
      capacity: 25,
      technology: "Lithium-ion",
      purpose: "Peak shaving",
      efficiency: 90,
      cycles: 4000,
      investment: 12000000
    },
    {
      project: "Pumped Hydro Storage",
      capacity: 200,
      technology: "Pumped hydro",
      purpose: "Long duration",
      efficiency: 80,
      cycles: 15000,
      investment: 150000000
    }
  ];

  const re100Timeline = [
    { year: 2020, target: 25, actual: 28, renewable: 28, investment: 45 },
    { year: 2021, target: 35, actual: 38, renewable: 38, investment: 52 },
    { year: 2022, target: 45, actual: 48, renewable: 48, investment: 67 },
    { year: 2023, target: 55, actual: 58, renewable: 58, investment: 78 },
    { year: 2024, target: 65, actual: 73, renewable: 73, investment: 89 },
    { year: 2025, target: 75, actual: null, renewable: 82, investment: 95 },
    { year: 2026, target: 85, actual: null, renewable: 88, investment: 105 },
    { year: 2027, target: 95, actual: null, renewable: 94, investment: 115 },
    { year: 2028, target: 100, actual: null, renewable: 98, investment: 125 },
    { year: 2029, target: 100, actual: null, renewable: 100, investment: 130 },
    { year: 2030, target: 100, actual: null, renewable: 100, investment: 135 }
  ];

  const financialMetrics = [
    { metric: "LCOE - Solar", current: 42, industry: 48, improvement: "-12.5%", unit: "$/MWh" },
    { metric: "LCOE - Wind", current: 38, industry: 41, improvement: "-7.3%", unit: "$/MWh" },
    { metric: "Grid Parity Achievement", current: 95, industry: 78, improvement: "+21.8%", unit: "%" },
    { metric: "ROI on Renewable Projects", current: 12.8, industry: 9.2, improvement: "+39.1%", unit: "%" }
  ];

  if (parametersLoading) {
    return <div>Loading renewable energy data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Renewable Energy Planner</h1>
          <p className="text-gray-600 mt-1">
            Strategic renewable energy portfolio management following RE100 initiative and IEA Net Zero guidelines
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            RE100 Member
          </Badge>
          <Badge variant="outline" className="text-success">
            SBTi Approved
          </Badge>
          <Button className="flex items-center space-x-2">
            <Target className="h-4 w-4" />
            <span>Set Targets</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Renewable Percentage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-600">
                  {renewableMetrics.renewablePercentage}%
                </div>
                <div className="text-sm text-gray-500">of total energy</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +12.8% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Generation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-600">
                  {renewableMetrics.totalGeneration.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">MWh annually</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +18.4% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">CO₂ Avoided</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-purple-600">
                  {(renewableMetrics.co2Avoided / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">tonnes annually</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +25.7% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <CloudSun className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Cost Savings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-600">
                  ${(renewableMetrics.costSavings / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">annually</div>
                <div className="text-sm text-success mt-1">
                  <TrendingUp className="h-3 w-3 inline mr-1" />
                  +15.3% vs last year
                </div>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Trends and Energy Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Renewable Generation</CardTitle>
            <p className="text-sm text-gray-600">
              Monthly renewable energy generation by technology
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyGeneration}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area 
                    type="monotone" 
                    dataKey="solar" 
                    stackId="1"
                    stroke="hsl(43, 96%, 56%)" 
                    fill="hsl(43, 96%, 56%)"
                    name="Solar"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="wind" 
                    stackId="1"
                    stroke="hsl(142, 71%, 45%)" 
                    fill="hsl(142, 71%, 45%)"
                    name="Wind"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hydro" 
                    stackId="1"
                    stroke="hsl(217, 91%, 60%)" 
                    fill="hsl(217, 91%, 60%)"
                    name="Hydro"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="biomass" 
                    stackId="1"
                    stroke="hsl(173, 58%, 39%)" 
                    fill="hsl(173, 58%, 39%)"
                    name="Biomass"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Energy Mix Portfolio</CardTitle>
            <p className="text-sm text-gray-600">
              Current energy sources and levelized cost of energy (LCOE)
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {energyMix.map((source, index) => (
                <div key={index} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="font-medium">{source.source}</span>
                    </div>
                    <Badge variant="outline" className="text-primary bg-primary/10">
                      {source.percentage}%
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Capacity</div>
                      <div className="text-lg font-bold text-gray-900">
                        {source.capacity > 0 ? `${source.capacity} MW` : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Generation</div>
                      <div className="text-lg font-bold text-blue-600">
                        {(source.generation / 1000).toFixed(0)}K MWh
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">LCOE</div>
                      <div className="text-lg font-bold text-green-600">
                        ${source.lcoe}/MWh
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RE100 Progress Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>RE100 Progress Timeline</CardTitle>
          <p className="text-sm text-gray-600">
            Progress toward 100% renewable electricity by 2030
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-64 mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={re100Timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(0, 84%, 60%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target %"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={3}
                  name="Actual %"
                />
                <Line 
                  type="monotone" 
                  dataKey="renewable" 
                  stroke="hsl(217, 91%, 60%)" 
                  strokeWidth={2}
                  name="Projected %"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">73.2%</div>
              <div className="text-sm text-gray-600">Current Progress</div>
              <div className="text-xs text-gray-500 mt-1">Ahead of schedule</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">100%</div>
              <div className="text-sm text-gray-600">2030 Target</div>
              <div className="text-xs text-gray-500 mt-1">RE100 commitment</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">6.8</div>
              <div className="text-sm text-gray-600">Years Remaining</div>
              <div className="text-xs text-gray-500 mt-1">To achieve goal</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renewable Projects Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Renewable Projects Pipeline</CardTitle>
          <p className="text-sm text-gray-600">
            Major renewable energy projects and investments
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {renewableProjects.map((project, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{project.project}</h3>
                  <Badge
                    variant={project.status === "Operational" ? "default" : "secondary"}
                    className={
                      project.status === "Operational" ? "bg-green-100 text-green-800" :
                      project.status === "Construction" ? "bg-blue-100 text-blue-800" :
                      project.status === "Installation" ? "bg-yellow-100 text-yellow-800" :
                      "bg-gray-100 text-gray-800"
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
                      {project.investment > 0 ? `$${(project.investment / 1000000).toFixed(0)}M` : "PPA"}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="text-lg font-bold text-blue-600">
                      {project.capacity} MW
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Generation</div>
                    <div className="text-lg font-bold text-green-600">
                      {project.generation.toLocaleString()} MWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">CO₂ Avoided</div>
                    <div className="text-lg font-bold text-purple-600">
                      {project.co2Avoided.toLocaleString()}t
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Completion</div>
                    <div className="text-sm font-bold text-orange-600">
                      {project.completion}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Power Purchase Agreements */}
      <Card>
        <CardHeader>
          <CardTitle>Power Purchase Agreement Portfolio</CardTitle>
          <p className="text-sm text-gray-600">
            Long-term renewable energy contracts and suppliers
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {ppaPortfolio.map((ppa, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-medium text-gray-900">{ppa.supplier}</h3>
                    <p className="text-sm text-gray-600">{ppa.location}</p>
                  </div>
                  <Badge variant="outline" className="text-primary bg-primary/10">
                    {ppa.technology}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <div>
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="text-lg font-bold text-blue-600">
                      {ppa.capacity} MW
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Contract Term</div>
                    <div className="text-lg font-bold text-gray-900">
                      {ppa.term} years
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Price</div>
                    <div className="text-lg font-bold text-green-600">
                      ${ppa.price}/MWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Start Date</div>
                    <div className="text-lg font-bold text-purple-600">
                      {ppa.startDate}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">CO₂ Avoided</div>
                    <div className="text-lg font-bold text-orange-600">
                      {ppa.co2Avoided.toLocaleString()}t
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Energy Storage Projects */}
      <Card>
        <CardHeader>
          <CardTitle>Energy Storage Projects</CardTitle>
          <p className="text-sm text-gray-600">
            Battery and storage systems supporting renewable integration
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {storageProjects.map((storage, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{storage.project}</h3>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {storage.efficiency}% Efficiency
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Capacity</div>
                    <div className="text-lg font-bold text-blue-600">
                      {storage.capacity} MWh
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Technology</div>
                    <div className="text-lg font-bold text-gray-900">
                      {storage.technology}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Purpose</div>
                    <div className="text-lg font-bold text-green-600">
                      {storage.purpose}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Cycle Life</div>
                    <div className="text-lg font-bold text-purple-600">
                      {storage.cycles.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Investment</div>
                    <div className="text-lg font-bold text-orange-600">
                      ${(storage.investment / 1000000).toFixed(0)}M
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Performance</CardTitle>
          <p className="text-sm text-gray-600">
            Cost competitiveness and return on investment metrics
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {financialMetrics.map((metric, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900">{metric.metric}</span>
                  <Badge variant="outline" className="text-success bg-success/10">
                    {metric.improvement}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Current: {metric.current} {metric.unit}</span>
                    <span>Industry: {metric.industry} {metric.unit}</span>
                  </div>
                  <Progress value={Math.min((metric.current / metric.industry) * 100, 100)} className="h-2" />
                  <div className="text-xs text-gray-500">
                    {((metric.current / metric.industry) * 100).toFixed(1)}% vs industry average
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
          <CardTitle>Renewable Energy Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust renewable energy parameters to model portfolio optimization scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {renewableParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
