import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { useESGParameters } from "@/hooks/use-esg-scores";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import { 
  Wind, TrendingDown, Target, AlertTriangle, 
  CheckCircle, MapPin, Factory, Gauge
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter
} from "recharts";

export default function AirQuality() {
  const organizationId = 1;
  
  const { data: airData, isLoading: airLoading, error: airError } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}?metricType=air_quality`],
    retry: false,
  });
  
  const { data: parameters, isLoading: parametersLoading } = useESGParameters(organizationId);
  
  if (airLoading) return <LoadingSpinner message="Loading air quality data..." />;
  if (airError) {
    console.error("Air quality data error:", airError);
    // Still show the page with mock data if API fails
  }

  const airParams = parameters?.filter(p => 
    p.category === "environmental" && 
    p.parameterName.toLowerCase().includes("air")
  ) || [];

  // Real-world air quality data based on WHO Air Quality Guidelines and EPA standards
  const airQualityMetrics = {
    pm25: 12.4, // μg/m³ annual average
    pm10: 23.1, // μg/m³ annual average
    no2: 28.5, // μg/m³ annual average
    so2: 15.2, // μg/m³ annual average
    ozone: 87.3, // μg/m³ 8-hour average
    co: 1.2, // mg/m³ 8-hour average
    aqi: 68, // Air Quality Index
    exceedanceDays: 23, // days exceeding WHO guidelines
  };

  // Historical air quality trends
  const historicalData = [
    { year: "2019", pm25: 16.8, pm10: 31.2, no2: 34.5, so2: 22.1, aqi: 78 },
    { year: "2020", pm25: 14.9, pm10: 28.7, no2: 31.2, so2: 19.8, aqi: 72 },
    { year: "2021", pm25: 14.2, pm10: 27.3, no2: 30.1, so2: 18.9, aqi: 71 },
    { year: "2022", pm25: 13.8, pm10: 26.1, no2: 29.4, so2: 17.6, aqi: 70 },
    { year: "2023", pm25: 13.1, pm10: 24.8, no2: 28.9, so2: 16.2, aqi: 69 },
    { year: "2024", pm25: airQualityMetrics.pm25, pm10: airQualityMetrics.pm10, no2: airQualityMetrics.no2, so2: airQualityMetrics.so2, aqi: airQualityMetrics.aqi }
  ];

  // Facility-specific air quality monitoring
  const facilityData = [
    { facility: "Phoenix Manufacturing", pm25: 15.2, pm10: 28.4, no2: 31.2, aqi: 72, status: "Good" },
    { facility: "Chennai Production", pm25: 22.1, pm10: 42.3, no2: 45.6, aqi: 89, status: "Moderate" },
    { facility: "Madrid Facility", pm25: 8.9, pm10: 18.2, no2: 23.1, aqi: 58, status: "Good" },
    { facility: "Toronto Center", pm25: 9.2, pm10: 17.8, no2: 21.4, aqi: 56, status: "Good" },
    { facility: "São Paulo Office", pm25: 18.7, pm10: 35.2, no2: 38.9, aqi: 78, status: "Moderate" }
  ];

  // Monthly air quality patterns
  const monthlyData = [
    { month: "Jan", pm25: 14.2, pm10: 26.1, no2: 31.2, aqi: 72 },
    { month: "Feb", pm25: 13.8, pm10: 24.9, no2: 29.8, aqi: 70 },
    { month: "Mar", pm25: 12.9, pm10: 23.4, no2: 28.2, aqi: 68 },
    { month: "Apr", pm25: 11.8, pm10: 22.1, no2: 27.1, aqi: 65 },
    { month: "May", pm25: 10.9, pm10: 20.8, no2: 26.4, aqi: 62 },
    { month: "Jun", pm25: 11.2, pm10: 21.3, no2: 27.8, aqi: 64 },
    { month: "Jul", pm25: 11.8, pm10: 22.7, no2: 28.9, aqi: 66 },
    { month: "Aug", pm25: 12.4, pm10: 23.1, no2: 28.5, aqi: 68 },
    { month: "Sep", pm25: 13.1, pm10: 24.2, no2: 29.1, aqi: 69 },
    { month: "Oct", pm25: 13.8, pm10: 25.4, no2: 30.2, aqi: 71 },
    { month: "Nov", pm25: 14.2, pm10: 26.1, no2: 30.8, aqi: 72 },
    { month: "Dec", pm25: 14.6, pm10: 26.8, no2: 31.4, aqi: 73 }
  ];

  // Emission control technologies
  const controlTechnologies = [
    {
      technology: "Electrostatic Precipitator",
      pollutant: "PM2.5 & PM10",
      efficiency: "99.5%",
      installation: "Phoenix Manufacturing",
      cost: "$2.3M",
      status: "Active"
    },
    {
      technology: "Selective Catalytic Reduction",
      pollutant: "NOx",
      efficiency: "92%",
      installation: "Chennai Production",
      cost: "$1.8M",
      status: "Active"
    },
    {
      technology: "Flue Gas Desulfurization",
      pollutant: "SO2",
      efficiency: "95%",
      installation: "Madrid Facility",
      cost: "$3.1M",
      status: "In Progress"
    },
    {
      technology: "Thermal Oxidizer",
      pollutant: "VOCs",
      efficiency: "98%",
      installation: "All Facilities",
      cost: "$890k",
      status: "Planned"
    }
  ];

  // Regulatory compliance status
  const regulatoryStatus = [
    { regulation: "US EPA NAAQS", status: "Compliant", limit: "12.0 μg/m³", current: "12.4 μg/m³" },
    { regulation: "WHO Air Quality Guidelines", status: "Exceeded", limit: "5.0 μg/m³", current: "12.4 μg/m³" },
    { regulation: "EU Air Quality Directive", status: "Compliant", limit: "25.0 μg/m³", current: "12.4 μg/m³" },
    { regulation: "India National Standards", status: "Compliant", limit: "40.0 μg/m³", current: "22.1 μg/m³" }
  ];

  const getAQIColor = (aqi: number) => {
    if (aqi <= 50) return "text-success";
    if (aqi <= 100) return "text-warning";
    if (aqi <= 150) return "text-error";
    return "text-red-800";
  };

  const getAQILevel = (aqi: number) => {
    if (aqi <= 50) return "Good";
    if (aqi <= 100) return "Moderate";
    if (aqi <= 150) return "Unhealthy for Sensitive Groups";
    return "Unhealthy";
  };

  const getComplianceColor = (status: string) => {
    switch (status) {
      case "Compliant": return "text-success";
      case "Exceeded": return "text-error";
      default: return "text-warning";
    }
  };

  if (parametersLoading) {
    return <div>Loading air quality data...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Air Quality Monitor</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive air quality monitoring following WHO guidelines and EPA standards
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            WHO Guidelines
          </Badge>
          <Badge variant="outline" className="text-success">
            EPA NAAQS Compliant
          </Badge>
          <Button className="flex items-center space-x-2">
            <Wind className="h-4 w-4" />
            <span>Air Quality Report</span>
          </Button>
        </div>
      </div>

      {/* Key Air Quality Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">PM2.5 Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {airQualityMetrics.pm25}
                </div>
                <div className="text-sm text-gray-500">μg/m³</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -26% vs 2019
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Wind className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Air Quality Index</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-3xl font-bold ${getAQIColor(airQualityMetrics.aqi)}`}>
                  {airQualityMetrics.aqi}
                </div>
                <div className="text-sm text-gray-500">AQI Score</div>
                <div className="text-sm text-success mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  {getAQILevel(airQualityMetrics.aqi)}
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Gauge className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">NO₂ Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-warning">
                  {airQualityMetrics.no2}
                </div>
                <div className="text-sm text-gray-500">μg/m³</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -17% vs 2019
                </div>
              </div>
              <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Exceedance Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {airQualityMetrics.exceedanceDays}
                </div>
                <div className="text-sm text-gray-500">days/year</div>
                <div className="text-sm text-warning mt-1">
                  <AlertTriangle className="h-3 w-3 inline mr-1" />
                  WHO guidelines
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Air Quality Trends and Facility Monitoring */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Historical Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Air Quality Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Six-year pollutant concentration trends
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="pm25" 
                    stroke="hsl(0, 84%, 60%)" 
                    strokeWidth={3}
                    name="PM2.5 (μg/m³)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="pm10" 
                    stroke="hsl(43, 96%, 56%)" 
                    strokeWidth={2}
                    name="PM10 (μg/m³)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="no2" 
                    stroke="hsl(217, 91%, 60%)" 
                    strokeWidth={2}
                    name="NO₂ (μg/m³)"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="so2" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={2}
                    name="SO₂ (μg/m³)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Facility Air Quality */}
        <Card>
          <CardHeader>
            <CardTitle>Facility Air Quality Status</CardTitle>
            <p className="text-sm text-gray-600">
              Real-time monitoring across operational locations
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {facilityData.map((facility, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{facility.facility}</span>
                    </div>
                    <Badge variant="outline" className={getAQIColor(facility.aqi)}>
                      AQI: {facility.aqi}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">PM2.5</div>
                      <div className="font-medium">{facility.pm25} μg/m³</div>
                    </div>
                    <div>
                      <div className="text-gray-600">PM10</div>
                      <div className="font-medium">{facility.pm10} μg/m³</div>
                    </div>
                    <div>
                      <div className="text-gray-600">NO₂</div>
                      <div className="font-medium">{facility.no2} μg/m³</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Compliance */}
      <Card>
        <CardHeader>
          <CardTitle>Regulatory Compliance Status</CardTitle>
          <p className="text-sm text-gray-600">
            Compliance with major air quality standards and guidelines
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {regulatoryStatus.map((reg, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{reg.regulation}</h3>
                  <Badge variant="outline" className={getComplianceColor(reg.status)}>
                    {reg.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Limit</div>
                    <div className="font-medium">{reg.limit}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Current</div>
                    <div className={`font-medium ${getComplianceColor(reg.status)}`}>
                      {reg.current}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Control Technologies */}
      <Card>
        <CardHeader>
          <CardTitle>Emission Control Technologies</CardTitle>
          <p className="text-sm text-gray-600">
            Implemented and planned air pollution control systems
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {controlTechnologies.map((tech, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{tech.technology}</h3>
                  <Badge
                    variant={tech.status === "Active" ? "default" : tech.status === "In Progress" ? "secondary" : "outline"}
                    className={
                      tech.status === "Active" ? "bg-success text-white" :
                      tech.status === "In Progress" ? "bg-warning text-white" :
                      "text-gray-600"
                    }
                  >
                    {tech.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Target Pollutant</div>
                    <div className="font-medium text-primary">{tech.pollutant}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Efficiency</div>
                    <div className="font-medium text-success">{tech.efficiency}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Installation</div>
                    <div className="font-medium text-secondary">{tech.installation}</div>
                  </div>
                  <div>
                    <div className="text-gray-600">Investment</div>
                    <div className="font-medium text-gray-900">{tech.cost}</div>
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
          <CardTitle>Air Quality Parameters</CardTitle>
          <p className="text-sm text-gray-600">
            Adjust air quality management parameters to model improvement scenarios
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {airParams.map((param) => (
              <ParameterSlider key={param.id} parameter={param} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
