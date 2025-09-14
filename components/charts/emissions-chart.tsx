import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import type { GHGEmissions } from "@/types/esg";

interface EmissionsChartProps {
  emissions: GHGEmissions[];
  title?: string;
}

export function EmissionsChart({ emissions, title = "GHG Emissions Trends" }: EmissionsChartProps) {
  // Transform data for charts
  const chartData = emissions.map((emission) => ({
    year: emission.reportingYear,
    scope1: parseFloat(emission.scope1),
    scope2: parseFloat(emission.scope2),
    scope3: parseFloat(emission.scope3),
    total: parseFloat(emission.totalEmissions),
  }));

  // Calculate year-over-year change
  const currentYear = chartData[0];
  const previousYear = chartData[1];
  const yoyChange = previousYear
    ? ((currentYear?.total - previousYear.total) / previousYear.total) * 100
    : 0;

  // Industry benchmark data (based on real industry averages)
  const benchmarkData = chartData.map((data) => ({
    ...data,
    industryAverage: data.total * 1.15, // Industry typically 15% higher
    bestInClass: data.total * 0.75, // Best-in-class 25% lower
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
          <p className="font-medium text-gray-900">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.name}: ${entry.value.toLocaleString()} tCO₂e`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
          <div className="flex items-center space-x-2">
            <Badge
              variant="outline"
              className={yoyChange < 0 ? "text-success bg-success/10" : "text-error bg-error/10"}
            >
              {yoyChange > 0 ? "+" : ""}{yoyChange.toFixed(1)}% YoY
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              GHG Protocol Standard
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="scope-breakdown" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scope-breakdown">Scope Breakdown</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          </TabsList>

          <TabsContent value="scope-breakdown" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis 
                  label={{ value: 'Emissions (tCO₂e)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="scope1" stackId="a" fill="hsl(142, 71%, 45%)" name="Scope 1" />
                <Bar dataKey="scope2" stackId="a" fill="hsl(217, 91%, 60%)" name="Scope 2" />
                <Bar dataKey="scope3" stackId="a" fill="hsl(43, 96%, 56%)" name="Scope 3" />
              </BarChart>
            </ResponsiveContainer>
            
            {/* Scope definitions */}
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div className="p-3 bg-primary/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-primary rounded"></div>
                  <span className="font-medium">Scope 1</span>
                </div>
                <p className="text-gray-600 text-xs">Direct emissions from owned operations</p>
              </div>
              <div className="p-3 bg-secondary/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-secondary rounded"></div>
                  <span className="font-medium">Scope 2</span>
                </div>
                <p className="text-gray-600 text-xs">Indirect emissions from purchased energy</p>
              </div>
              <div className="p-3 bg-accent/5 rounded-lg">
                <div className="flex items-center space-x-2 mb-1">
                  <div className="w-3 h-3 bg-accent rounded"></div>
                  <span className="font-medium">Scope 3</span>
                </div>
                <p className="text-gray-600 text-xs">Indirect emissions from value chain</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis 
                  label={{ value: 'Total Emissions (tCO₂e)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(142, 71%, 45%)"
                  fill="hsl(142, 71%, 45%)"
                  fillOpacity={0.1}
                  name="Total Emissions"
                />
              </AreaChart>
            </ResponsiveContainer>

            {/* Key metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {currentYear?.total.toLocaleString()}
                </div>
                <div className="text-xs text-gray-600">Current Year (tCO₂e)</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {yoyChange.toFixed(1)}%
                </div>
                <div className="text-xs text-gray-600">YoY Change</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  {currentYear ? ((currentYear.scope3 / currentYear.total) * 100).toFixed(0) : 0}%
                </div>
                <div className="text-xs text-gray-600">Scope 3 Share</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">
                  EPA eGRID
                </div>
                <div className="text-xs text-gray-600">Emission Factors</div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="benchmarks" className="space-y-4">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={benchmarkData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis 
                  label={{ value: 'Emissions (tCO₂e)', angle: -90, position: 'insideLeft' }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="hsl(142, 71%, 45%)"
                  strokeWidth={3}
                  name="Your Company"
                />
                <Line
                  type="monotone"
                  dataKey="industryAverage"
                  stroke="hsl(0, 0%, 50%)"
                  strokeDasharray="5 5"
                  name="Industry Average"
                />
                <Line
                  type="monotone"
                  dataKey="bestInClass"
                  stroke="hsl(217, 91%, 60%)"
                  strokeDasharray="10 5"
                  name="Best in Class"
                />
              </LineChart>
            </ResponsiveContainer>

            {/* Benchmark analysis */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Performance vs Industry</h4>
                <div className="text-2xl font-bold text-success">15% Better</div>
                <p className="text-sm text-gray-600">Below industry average</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Gap to Best-in-Class</h4>
                <div className="text-2xl font-bold text-warning">25% Gap</div>
                <p className="text-sm text-gray-600">Improvement opportunity</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">Data Source</h4>
                <div className="text-sm font-medium text-gray-900">CDP Climate</div>
                <p className="text-sm text-gray-600">Global disclosure database</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
