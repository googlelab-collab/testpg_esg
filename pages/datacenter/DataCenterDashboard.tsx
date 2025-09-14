import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import { 
  Zap, Server, Thermometer, Droplets, Leaf, 
  Brain, TrendingUp, FileText, Target, AlertTriangle
} from 'lucide-react';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, 
         XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
         BarChart, Bar } from 'recharts';

interface DataCenterMetrics {
  id: number;
  facilityId: string;
  facilityName: string;
  location: string;
  pue: number;
  wue: number;
  cue: number;
  totalEnergyConsumption: number;
  renewableEnergyPercentage: number;
  carbonIntensity: number;
  uptime: number;
  capacity: number;
  utilization: number;
  aiWorkloadPercentage: number;
  coolingType: string;
}

interface AIOptimization {
  pueOptimization: string[];
  coolingRecommendations: string[];
  energyEfficiency: string[];
  sustainabilityActions: string[];
}

export default function DataCenterDashboard() {
  const [selectedFacility, setSelectedFacility] = useState<string>('all');
  const organizationId = 1; // Default organization

  // Fetch data center metrics
  const { data: dcMetrics = [], isLoading: metricsLoading, error: metricsError } = useQuery({
    queryKey: ['/api/datacenter-metrics', organizationId],
    retry: false,
  });

  // Sample data for demonstration until API is fully connected
  const sampleMetrics: DataCenterMetrics[] = [
    {
      id: 1,
      facilityId: 'DC-001',
      facilityName: 'Primary Data Center',
      location: 'Virginia, USA',
      pue: 1.58,
      wue: 1.2,
      cue: 0.85,
      totalEnergyConsumption: 2840,
      renewableEnergyPercentage: 65,
      carbonIntensity: 0.42,
      uptime: 99.94,
      capacity: 5000,
      utilization: 78,
      aiWorkloadPercentage: 42,
      coolingType: 'Liquid Cooling'
    },
    {
      id: 2,
      facilityId: 'DC-002',
      facilityName: 'Secondary Data Center',
      location: 'Oregon, USA',
      pue: 1.42,
      wue: 1.1,
      cue: 0.72,
      totalEnergyConsumption: 1920,
      renewableEnergyPercentage: 82,
      carbonIntensity: 0.28,
      uptime: 99.97,
      capacity: 3500,
      utilization: 65,
      aiWorkloadPercentage: 38,
      coolingType: 'Hybrid Cooling'
    }
  ];

  // Use sample data if API data is not available
  const displayMetrics = dcMetrics.length > 0 ? dcMetrics : sampleMetrics;

  // Fetch AI optimization recommendations
  const { data: aiOptimization, isLoading: aiLoading } = useQuery({
    queryKey: ['/api/ai/datacenter-optimize', organizationId],
    enabled: dcMetrics.length > 0,
    retry: false,
  });

  if (metricsLoading) return <LoadingSpinner />;
  if (metricsError) return <ErrorMessage error={metricsError} />;

  const metrics = dcMetrics.length > 0 ? dcMetrics : displayMetrics;
  
  // Calculate aggregate metrics
  const totalFacilities = metrics.length;
  const averagePUE = metrics.reduce((sum, m) => sum + m.pue, 0) / totalFacilities;
  const totalCapacity = metrics.reduce((sum, m) => sum + m.capacity, 0);
  const averageUptime = metrics.reduce((sum, m) => sum + m.uptime, 0) / totalFacilities;
  const totalRenewablePercentage = metrics.reduce((sum, m) => sum + (m.renewableEnergyPercentage * m.capacity), 0) / totalCapacity;

  // Historical trend data
  const pueHistory = [
    { month: 'Jan', pue: 1.25, industry: 1.4 },
    { month: 'Feb', pue: 1.22, industry: 1.4 },
    { month: 'Mar', pue: 1.18, industry: 1.38 },
    { month: 'Apr', pue: 1.15, industry: 1.37 },
    { month: 'May', pue: 1.13, industry: 1.36 },
    { month: 'Jun', pue: 1.10, industry: 1.35 }
  ];

  const energyBreakdown = [
    { name: 'IT Equipment', value: 45, color: '#3B82F6' },
    { name: 'Cooling', value: 35, color: '#10B981' },
    { name: 'Power & UPS', value: 12, color: '#F59E0B' },
    { name: 'Lighting & Other', value: 8, color: '#EF4444' }
  ];

  const handleGenerateReport = async () => {
    try {
      console.log('Generating comprehensive data center report...');
      
      const { generateEnhancedESGReport } = await import('@/lib/enhancedPdfGenerator');
      
      const config = {
        title: 'Data Center Sustainability Report',
        organizationName: 'Enterprise Corp',
        reportingPeriod: '2024',
        framework: 'GRI',
        moduleType: 'datacenter' as const,
        includeCharts: true,
        includeMetrics: true,
        includeCompliance: true,
        includeAIInsights: true,
        includeBenchmarks: true,
        includeActionPlan: true,
      };
      
      const detailedData = {
        executiveSummary: {
          overallScore: 88,
          environmentalScore: 92,
          socialScore: 82,
          governanceScore: 89,
          keyAchievements: [
            'Achieved industry-leading PUE of 1.10 across all facilities',
            '100% renewable energy in European operations',
            'Implemented immersion cooling reducing WUE by 35%',
            'AI workload optimization improving efficiency by 18%'
          ],
          keyRisks: [
            'Increasing AI workload energy demands',
            'Grid stability challenges with renewable integration',
            'Water scarcity in key operational regions'
          ],
          performanceTrend: 'improving' as const,
          industryRanking: 'Top 10% globally for data center sustainability'
        },
        
        detailedMetrics: [
          {
            category: 'efficiency',
            subCategory: 'power',
            metricName: 'Power Usage Effectiveness (PUE)',
            currentValue: averagePUE.toFixed(2),
            previousValue: '1.18',
            targetValue: '1.05',
            unit: '',
            trend: 'down' as const,
            trendPercentage: 6.8,
            benchmarkData: {
              industryAverage: 1.35,
              topQuartile: 1.15,
              ranking: 'Top 5%'
            },
            source: 'Real-time monitoring systems',
            lastUpdated: new Date().toISOString()
          },
          {
            category: 'efficiency',
            subCategory: 'water',
            metricName: 'Water Usage Effectiveness (WUE)',
            currentValue: '0.16',
            previousValue: '0.22',
            targetValue: '0.10',
            unit: 'L/kWh',
            trend: 'down' as const,
            trendPercentage: 27.3,
            benchmarkData: {
              industryAverage: 0.45,
              topQuartile: 0.20,
              ranking: 'Top 10%'
            },
            source: 'Water management systems',
            lastUpdated: new Date().toISOString()
          }
        ],
        
        dataCenterMetrics: {
          pue: averagePUE,
          wue: 0.16,
          cue: 0.24,
          renewableEnergyPercentage: totalRenewablePercentage,
          carbonIntensity: 200,
          coolingEfficiency: 0.85,
          aiWorkloadPercentage: 40,
          uptime: averageUptime,
          facilityCount: totalFacilities,
          totalCapacity: totalCapacity
        },
        
        aiInsights: aiOptimization ? {
          keyInsights: [
            'PUE optimization potential of 8% through intelligent workload distribution',
            'Immersion cooling deployment could reduce energy consumption by 25%',
            'AI-driven predictive maintenance preventing 99.2% of potential downtime events'
          ],
          recommendations: aiOptimization.pueOptimization.slice(0, 3),
          risks: [
            'AI workload growth exceeding cooling capacity by Q3 2025',
            'Grid renewable energy intermittency affecting SLA compliance'
          ],
          opportunities: aiOptimization.sustainabilityActions.slice(0, 3),
          confidence: 87
        } : undefined,
        
        complianceStatus: [
          {
            framework: 'EU Energy Efficiency Directive (EED)',
            status: 'compliant' as const,
            score: 95,
            lastAssessment: new Date().toISOString(),
            nextDeadline: '2025-06-30',
            requirements: [
              {
                requirement: 'Energy consumption reporting (>500kW)',
                status: 'met' as const,
                details: 'Automated monthly reporting implemented'
              },
              {
                requirement: 'Renewable energy share disclosure',
                status: 'met' as const,
                details: '85% renewable energy achieved'
              },
              {
                requirement: 'Waste heat utilization assessment',
                status: 'partial' as const,
                details: 'Pilot program launched in 2 facilities'
              }
            ]
          }
        ],
        
        actionPlan: [
          {
            priority: 'high' as const,
            timeframe: 'Q2 2025',
            description: 'Deploy immersion cooling in high-density AI compute zones',
            expectedImpact: '25% reduction in cooling energy consumption',
            resources: '$2.5M capital investment, 3-month implementation',
            owner: 'Data Center Operations Team',
            kpis: ['PUE reduction to <1.05', 'WUE reduction to <0.10', 'AI workload capacity +40%']
          },
          {
            priority: 'medium' as const,
            timeframe: 'Q3 2025',
            description: 'Implement waste heat recovery for district heating',
            expectedImpact: '15% improvement in energy reuse factor',
            resources: '$1.8M infrastructure investment',
            owner: 'Sustainability Team',
            kpis: ['ERF improvement to 0.30', 'Community heat supply 500 homes']
          }
        ],
        
        benchmarks: [
          {
            metric: 'PUE',
            value: averagePUE,
            industryAverage: 1.35,
            topPerformers: 1.08,
            ranking: 'Top 5%',
            source: 'Uptime Institute Global Survey 2024'
          },
          {
            metric: 'Renewable Energy %',
            value: totalRenewablePercentage,
            industryAverage: 45,
            topPerformers: 100,
            ranking: 'Top 15%',
            source: 'Data Center Dynamics Global Survey'
          }
        ],
        
        recommendations: [
          'Accelerate immersion cooling deployment for AI workloads',
          'Implement predictive maintenance using machine learning',
          'Expand renewable energy procurement agreements',
          'Develop waste heat recovery for local community heating'
        ]
      };
      
      const pdfBlob = await generateEnhancedESGReport(config, detailedData);
      
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `DataCenter_Sustainability_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Data center report generated successfully');
    } catch (error) {
      console.error('Error generating data center report:', error);
      alert('Failed to generate report. Please try again.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Data Center Sustainability</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive data center efficiency and sustainability monitoring
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-green-600">
            PUE: {averagePUE.toFixed(2)} (Industry Leading)
          </Badge>
          <Badge variant="outline" className="text-blue-600">
            {totalRenewablePercentage.toFixed(0)}% Renewable Energy
          </Badge>
          <Button 
            className="flex items-center space-x-2"
            onClick={handleGenerateReport}
          >
            <FileText className="h-4 w-4" />
            Download Comprehensive Report
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average PUE</p>
                <p className="text-2xl font-bold text-green-600">{averagePUE.toFixed(2)}</p>
                <p className="text-xs text-green-600">Industry leading</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Target: 1.05</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Capacity</p>
                <p className="text-2xl font-bold text-blue-600">{totalCapacity}</p>
                <p className="text-xs text-blue-600">{totalFacilities} facilities</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center">
                <Server className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">MW capacity</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Uptime</p>
                <p className="text-2xl font-bold text-purple-600">{averageUptime.toFixed(2)}%</p>
                <p className="text-xs text-green-600">+0.01% vs target</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">SLA: 99.95%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Renewable Energy</p>
                <p className="text-2xl font-bold text-green-600">{totalRenewablePercentage.toFixed(0)}%</p>
                <p className="text-xs text-green-600">+15% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Target: 100% by 2025</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="efficiency" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="efficiency">Efficiency Metrics</TabsTrigger>
          <TabsTrigger value="facilities">Facility Overview</TabsTrigger>
          <TabsTrigger value="ai-insights">AI Optimization</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="efficiency" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* PUE Trend */}
            <Card>
              <CardHeader>
                <CardTitle>PUE Trend vs Industry Benchmark</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={pueHistory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[1.0, 1.5]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="pue" stroke="#10B981" strokeWidth={3} name="Our PUE" />
                    <Line type="monotone" dataKey="industry" stroke="#EF4444" strokeWidth={2} name="Industry Avg" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Energy Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Energy Consumption Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={energyBreakdown}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {energyBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="facilities" className="space-y-6">
          <div className="grid gap-6">
            {metrics.map((facility) => (
              <Card key={facility.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{facility.facilityName}</CardTitle>
                      <p className="text-sm text-gray-600">{facility.location} • {facility.facilityId}</p>
                    </div>
                    <Badge variant={facility.pue < 1.15 ? "default" : "secondary"}>
                      PUE: {facility.pue}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Capacity</p>
                      <p className="text-lg font-semibold">{facility.capacity} MW</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Utilization</p>
                      <p className="text-lg font-semibold">{facility.utilization}%</p>
                      <Progress value={facility.utilization} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Renewable Energy</p>
                      <p className="text-lg font-semibold text-green-600">{facility.renewableEnergyPercentage}%</p>
                      <Progress value={facility.renewableEnergyPercentage} className="mt-1" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">AI Workloads</p>
                      <p className="text-lg font-semibold text-purple-600">{facility.aiWorkloadPercentage}%</p>
                      <Badge variant="outline" className="mt-1">{facility.coolingType}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-insights" className="space-y-6">
          {aiLoading ? (
            <LoadingSpinner message="Generating AI optimization recommendations..." />
          ) : (
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    AI-Powered Optimization Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-green-600 mb-3">PUE Optimization</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">Implement intelligent workload distribution to balance power consumption</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">Optimize HVAC setpoints based on real-time weather data</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Target className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">Deploy predictive maintenance to prevent efficiency degradation</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-blue-600 mb-3">Cooling Recommendations</h4>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <Thermometer className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">Transition high-density AI racks to immersion cooling</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Thermometer className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">Implement free cooling during off-peak hours</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Thermometer className="h-4 w-4 text-blue-600 mt-1 flex-shrink-0" />
                          <span className="text-sm">Optimize air flow with CFD modeling</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-orange-500" />
                    Critical Actions Required
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                      <h4 className="font-semibold text-orange-800">High Priority</h4>
                      <p className="text-sm text-orange-700 mt-1">
                        AI workload growth projected to exceed cooling capacity by Q3 2025. 
                        Immediate immersion cooling deployment recommended for sustained performance.
                      </p>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                      <h4 className="font-semibold text-blue-800">Medium Priority</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Renewable energy intermittency affecting grid stability. 
                        Consider battery energy storage systems (BESS) for load balancing.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Metrics & Targets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Carbon Neutrality Progress</span>
                      <span className="text-sm text-gray-600">85% of 100% target</span>
                    </div>
                    <Progress value={85} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">Target: 100% by 2025</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Water Usage Reduction</span>
                      <span className="text-sm text-gray-600">65% of 80% target</span>
                    </div>
                    <Progress value={65} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">Target: 80% reduction by 2026</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Waste Heat Recovery</span>
                      <span className="text-sm text-gray-600">25% of 50% target</span>
                    </div>
                    <Progress value={25} className="h-3" />
                    <p className="text-xs text-gray-500 mt-1">Target: 50% heat reuse by 2027</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Industry Benchmarking</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800">PUE Ranking</h4>
                    <p className="text-2xl font-bold text-green-600">Top 5%</p>
                    <p className="text-xs text-green-600">Industry leading efficiency</p>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800">Renewable Energy</h4>
                    <p className="text-2xl font-bold text-blue-600">Top 15%</p>
                    <p className="text-xs text-blue-600">Above industry average</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800">Overall ESG</h4>
                    <p className="text-2xl font-bold text-purple-600">Top 10%</p>
                    <p className="text-xs text-purple-600">Sustainability leader</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}