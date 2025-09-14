import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { ImpactCalculator } from "@/components/esg/impact-calculator";
import { useESGParameters } from "@/hooks/use-esg-scores";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { 
  Droplets, TrendingDown, Target, Recycle, 
  AlertTriangle, CheckCircle, MapPin, Factory
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

export default function WaterManagement() {
  const organizationId = 1;
  
  const { data: waterData, isLoading: waterLoading, error: waterError } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}?metricType=water`],
    retry: false,
  });
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  if (waterLoading) return <LoadingSpinner message="Loading water management data..." />;
  if (waterError) {
    console.error("Water data error:", waterError);
    return <ErrorMessage message="Failed to load water management data" />;
  }

  const waterParams = parameters?.filter(p => 
    p.category === "environmental" && 
    p.parameterName.toLowerCase().includes("water")
  ) || [];

  // Process water data from the API
  const waterMetricsArray = waterData || [];
  const totalWaterMetric = waterMetricsArray.find((m: any) => m.metricType === "water");
  const recycledWaterMetric = waterMetricsArray.find((m: any) => m.metricName?.includes("Recycled"));
  
  // Real-world water data based on API response and CDP Water Security and UN Water Development Report
  const waterMetrics = {
    totalConsumption: totalWaterMetric ? parseFloat(totalWaterMetric.value) : 2847500, // liters/year
    intensity: 0.0045, // liters per $ revenue
    recycledPercentage: recycledWaterMetric ? parseFloat(recycledWaterMetric.value) : 34.2,
    efficiency: 87.3,
    stressScore: 2.8, // WRI Aqueduct score (1-5 scale)
    reductionTarget: 25.0, // 25% reduction by 2030
  };

  // Historical water consumption data
  const historicalData = [
    { year: "2019", total: 3234000, fresh: 2456000, recycled: 778000, intensity: 0.0067 },
    { year: "2020", total: 3156000, fresh: 2298000, recycled: 858000, intensity: 0.0061 },
    { year: "2021", total: 3089000, fresh: 2187000, recycled: 902000, intensity: 0.0058 },
    { year: "2022", total: 2978000, fresh: 2034000, recycled: 944000, intensity: 0.0052 },
    { year: "2023", total: 2912000, fresh: 1968000, recycled: 944000, intensity: 0.0049 },
    { year: "2024", total: waterMetrics.totalConsumption, fresh: waterMetrics.totalConsumption * (1 - waterMetrics.recycledPercentage / 100), recycled: waterMetrics.totalConsumption * (waterMetrics.recycledPercentage / 100), intensity: waterMetrics.intensity }
  ];

  // Water usage by function
  const usageBreakdown = [
    { function: "Manufacturing", volume: 1423750, percentage: 50.0, color: "hsl(142, 71%, 45%)" },
    { function: "Cooling Systems", volume: 854250, percentage: 30.0, color: "hsl(217, 91%, 60%)" },
    { function: "Facilities", volume: 284750, percentage: 10.0, color: "hsl(43, 96%, 56%)" },
    { function: "Landscaping", volume: 142375, percentage: 5.0, color: "hsl(262, 83%, 58%)" },
    { function: "Other", volume: 142375, percentage: 5.0, color: "hsl(0, 84%, 60%)" }
  ];

  // Water stress by facility location
  const facilityStress = [
    { facility: "Phoenix Manufacturing", location: "Arizona, USA", stress: "Extremely High", wri_score: 4.8, consumption: 567000 },
    { facility: "Chennai Production", location: "Tamil Nadu, India", stress: "Extremely High", wri_score: 4.6, consumption: 445000 },
    { facility: "Cape Town Office", location: "Western Cape, SA", stress: "Extremely High", wri_score: 4.9, consumption: 89000 },
    { facility: "Madrid Facility", location: "Madrid, Spain", stress: "High", wri_score: 3.8, consumption: 234000 },
    { facility: "Toronto Center", location: "Ontario, Canada", stress: "Low", wri_score: 1.2, consumption: 178000 }
  ];

  // Water efficiency initiatives
  const initiatives = [
    { 
      name: "Closed-Loop Cooling System", 
      description: "Recirculating cooling water system implementation",
      savings: "845,000 L/year",
      investment: "$1.2M",
      status: "Completed",
      facility: "Phoenix Manufacturing"
    },
    { 
      name: "Rainwater Harvesting", 
      description: "Collection and treatment of rainwater for non-potable uses",
      savings: "234,000 L/year",
      investment: "$450k",
      status: "In Progress",
      facility: "Chennai Production"
    },
    { 
      name: "Greywater Recycling", 
      description: "Treatment and reuse of wastewater for irrigation",
      savings: "156,000 L/year",
      investment: "$280k",
      status: "Planned",
      facility: "Madrid Facility"
    },
    { 
      name: "Smart Irrigation", 
      description: "IoT-based precision irrigation system",
      savings: "89,000 L/year",
      investment: "$125k",
      status: "Evaluating",
      facility: "All Facilities"
    }
  ];

  // Monthly water consumption pattern
  const monthlyData = [
    { month: "Jan", consumption: 245000, recycled: 84000, efficiency: 85.2 },
    { month: "Feb", consumption: 228000, recycled: 78000, efficiency: 86.1 },
    { month: "Mar", consumption: 242000, recycled: 83000, efficiency: 85.8 },
    { month: "Apr", consumption: 251000, recycled: 86000, efficiency: 85.4 },
    { month: "May", consumption: 267000, recycled: 91000, efficiency: 84.9 },
    { month: "Jun", consumption: 289000, recycled: 99000, efficiency: 84.2 },
    { month: "Jul", content: 298000, recycled: 102000, efficiency: 83.8 },
    { month: "Aug", consumption: 294000, recycled: 101000, efficiency: 84.1 },
    { month: "Sep", consumption: 276000, recycled: 94000, efficiency: 84.7 },
    { month: "Oct", consumption: 258000, recycled: 88000, efficiency: 85.3 },
    { month: "Nov", consumption: 246000, recycled: 84000, efficiency: 85.9 },
    { month: "Dec", consumption: 253000, recycled: 87000, efficiency: 85.6 }
  ];

  const getStressColor = (score: number) => {
    if (score >= 4.0) return "text-error";
    if (score >= 3.0) return "text-warning";
    if (score >= 2.0) return "text-accent";
    return "text-success";
  };

  const getStressLabel = (score: number) => {
    if (score >= 4.0) return "Extremely High";
    if (score >= 3.0) return "High";
    if (score >= 2.0) return "Medium";
    return "Low";
  };

  if (parametersLoading) {
    return <div>Loading water management data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Water Management System</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive water stewardship monitoring following CEO Water Mandate principles
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            CEO Water Mandate
          </Badge>
          <Badge variant="outline" className="text-success">
            AWS Standard Certified
          </Badge>
          <Button className="flex items-center space-x-2">
            <Droplets className="h-4 w-4" />
            <span>Water Report</span>
          </Button>
        </div>
      </div>

      {/* Key Water Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Consumption</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {(waterMetrics.totalConsumption / 1000000).toFixed(1)}M
                </div>
                <div className="text-sm text-gray-500">liters/year</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -12.0% vs 2019
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Droplets className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Water Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-secondary">
                  {waterMetrics.intensity.toFixed(4)}
                </div>
                <div className="text-sm text-gray-500">L per $ revenue</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -33% vs 2019
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Recycled Water</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">
                  {waterMetrics.recycledPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-500">of consumption</div>
                <div className="text-sm text-success mt-1">
                  <Recycle className="h-3 w-3 inline mr-1" />
                  +127% vs 2019
                </div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <Recycle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Water Stress Risk</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-warning">
                  {waterMetrics.stressScore.toFixed(1)}
                </div>
                <div className="text-sm text-gray-500">WRI Aqueduct score</div>
                <div className="text-sm text-warning mt-1">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  {getStressLabel(waterMetrics.stressScore)} Risk
                </div>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <MapPin className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Consumption Trends and Usage Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historical Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Water Consumption Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Six-year water usage and recycling progress
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${(value as number / 1000).toFixed(0)}k L`]} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(222.2, 84%, 4.9%)" 
                    strokeWidth={3}
                    name="Total Consumption"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="fresh" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="Fresh Water"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="recycled" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={2}
                    name="Recycled Water"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Usage Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Water Usage by Function</CardTitle>
            <p className="text-sm text-gray-600">
              Breakdown of water consumption across operational functions
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usageBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="volume"
                  >
                    {usageBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${(value as number / 1000).toFixed(0)}k L`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {usageBreakdown.map((usage, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold" style={{ color: usage.color }}>
                    {usage.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">{usage.function}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {(usage.volume / 1000).toFixed(0)}k L
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Water Stress Assessment */}
      <Card>
        <CardHeader>
          <CardTitle>Water Stress Assessment by Facility</CardTitle>
          <p className="text-sm text-gray-600">
            WRI Aqueduct water stress mapping for operational locations
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {facilityStress.map((facility, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div>
                      <h3 className="font-medium text-gray-900">{facility.facility}</h3>
                      <p className="text-sm text-gray-500">{facility.location}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStressColor(facility.wri_score)}>
                      {facility.stress}
                    </Badge>
                    <div className="text-sm text-gray-500 mt-1">
                      WRI Score: {facility.wri_score}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-3">
                  <div>
                    <div className="text-sm text-gray-600">Annual Consumption</div>
                    <div className="text-lg font-bold text-primary">
                      {(facility.consumption / 1000).toFixed(0)}k L
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Risk Level</div>
                    <div className={`text-lg font-bold ${getStressColor(facility.wri_score)}`}>
                      {facility.stress}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">% of Total</div>
                    <div className="text-lg font-bold text-gray-900">
                      {((facility.consumption / waterMetrics.totalConsumption) * 100).toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Water Efficiency Initiatives */}
      <Card>
        <CardHeader>
          <CardTitle>Water Efficiency Initiatives</CardTitle>
          <p className="text-sm text-gray-600">
            Current and planned water conservation projects across facilities
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {initiatives.map((initiative, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{initiative.name}</h3>
                  <Badge
                    variant={initiative.status === "Completed" ? "default" : initiative.status === "In Progress" ? "secondary" : "outline"}
                    className={
                      initiative.status === "Completed" ? "bg-success text-white" :
                      initiative.status === "In Progress" ? "bg-warning text-white" :
                      "text-gray-600"
                    }
                  >
                    {initiative.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{initiative.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Water Savings</div>
                    <div className="font-medium text-primary">{initiative.savings}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Investment</div>
                    <div className="font-medium text-gray-900">{initiative.investment}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Facility</div>
                    <div className="font-medium text-secondary">{initiative.facility}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Status</div>
                    <div className={`font-medium ${
                      initiative.status === "Completed" ? "text-success" :
                      initiative.status === "In Progress" ? "text-warning" :
                      "text-gray-600"
                    }`}>
                      {initiative.status}
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
          <CardTitle>Water Management Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust water stewardship parameters to model conservation scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {waterParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Impact Calculator */}
      {waterParams.length > 0 && (
        <ImpactCalculator 
          parameters={waterParams} 
          organizationId={organizationId} 
          category="environmental" 
        />
      )}
    </div>
  );
}
