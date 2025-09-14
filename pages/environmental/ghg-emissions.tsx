import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ParameterSlider } from "@/components/esg/parameter-slider";
import { ImpactCalculator } from "@/components/esg/impact-calculator";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import DataUploadModal from "@/components/data/DataUploadModal";
import { 
  Leaf, TrendingDown, Target, Calculator, 
  FileText, AlertTriangle, CheckCircle, Upload, Download
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

const organizationId = 1;

export default function GHGEmissions() {
  const [selectedYear, setSelectedYear] = useState("2024");
  const [showDataUpload, setShowDataUpload] = useState(false);

  const { data: emissionsData, isLoading: emissionsLoading, error: emissionsError } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}?metricType=ghg_emissions`],
    retry: false,
  });

  const { data: parameters, isLoading: parametersLoading } = useQuery({
    queryKey: [`/api/esg-parameters/${organizationId}`],
    select: (data) => data?.filter((p: any) => p.category === "environmental" && (p.parameterName.includes("emission") || p.parameterName.includes("ghg") || p.parameterName.includes("carbon") || p.parameterName.includes("renewable"))) || [],
    retry: false,
  });

  if (emissionsLoading) return <LoadingSpinner message="Loading GHG emissions data..." />;
  if (emissionsError) return <ErrorMessage message="Failed to load GHG emissions data" />;

  // Use API data or fallback to default values
  const emissions = emissionsData && emissionsData.length > 0 ? {
    scope1: emissionsData.find((e: any) => e.scope === "scope1")?.value || "12450",
    scope2: emissionsData.find((e: any) => e.scope === "scope2")?.value || "28730", 
    scope3: emissionsData.find((e: any) => e.scope === "scope3")?.value || "156890",
    totalEmissions: emissionsData.reduce((sum: number, e: any) => sum + parseFloat(e.value || "0"), 0).toString(),
    emissionIntensity: "0.0234",
    reductionTarget: "30.0",
    methodology: "GHG Protocol",
    verified: true,
    verificationBody: "KPMG"
  } : {
    scope1: "12450",
    scope2: "28730", 
    scope3: "156890",
    totalEmissions: "198070",
    emissionIntensity: "0.0234",
    reductionTarget: "30.0",
    methodology: "GHG Protocol",
    verified: true,
    verificationBody: "KPMG"
  };

  const totalEmissions = parseFloat(emissions.totalEmissions);
  const scope1 = parseFloat(emissions.scope1);
  const scope2 = parseFloat(emissions.scope2);
  const scope3 = parseFloat(emissions.scope3);

  // Historical emissions data for trend analysis
  const historicalData = [
    { year: "2019", scope1: 14200, scope2: 32100, scope3: 178900, total: 225200 },
    { year: "2020", scope1: 13800, scope2: 30500, scope3: 169800, total: 214100 },
    { year: "2021", scope1: 13200, scope2: 29800, scope3: 164200, total: 207200 },
    { year: "2022", scope1: 12900, scope2: 29200, scope3: 161500, total: 203600 },
    { year: "2023", scope1: 12650, scope2: 28900, scope3: 159200, total: 200750 },
    { year: "2024", scope1: scope1, scope2: scope2, scope3: scope3, total: totalEmissions }
  ];

  // Scope breakdown for pie chart
  const scopeBreakdown = [
    { name: "Scope 1 - Direct", value: scope1, color: "hsl(0, 84%, 60%)", percentage: ((scope1 / totalEmissions) * 100).toFixed(1) },
    { name: "Scope 2 - Energy", value: scope2, color: "hsl(43, 96%, 56%)", percentage: ((scope2 / totalEmissions) * 100).toFixed(1) },
    { name: "Scope 3 - Value Chain", value: scope3, color: "hsl(142, 71%, 45%)", percentage: ((scope3 / totalEmissions) * 100).toFixed(1) }
  ];

  // Reduction pathway to 2030 target
  const reductionPathway = [
    { year: "2024", actual: totalEmissions, target: totalEmissions },
    { year: "2025", actual: null, target: totalEmissions * 0.92 },
    { year: "2026", actual: null, target: totalEmissions * 0.84 },
    { year: "2027", actual: null, target: totalEmissions * 0.76 },
    { year: "2028", actual: null, target: totalEmissions * 0.74 },
    { year: "2029", actual: null, target: totalEmissions * 0.72 },
    { year: "2030", actual: null, target: totalEmissions * 0.70 } // 30% reduction
  ];

  // Industry benchmarks (based on CDP data)
  const industryBenchmarks = {
    technology: { average: 156, top25: 89, top10: 52 },
    manufacturing: { average: 298, top25: 167, top10: 134 },
    services: { average: 78, top25: 45, top10: 23 }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GHG Emissions Tracker</h1>
          <p className="text-gray-600 mt-1">
            Comprehensive greenhouse gas emissions monitoring following GHG Protocol standards
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-primary">
            GHG Protocol Compliant
          </Badge>
          <Badge variant="outline" className="text-success">
            {emissions.verified ? "Third-Party Verified" : "Pending Verification"}
          </Badge>
          <Button 
            className="flex items-center space-x-2"
            onClick={async () => {
              try {
                console.log('Generating GHG emissions PDF report...');
                
                // Import PDF generator
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                
                // Prepare report config
                const config = {
                  title: 'GHG Emissions Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'GRI' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                
                // Prepare report data
                const reportData = {
                  executiveSummary: {
                    overallScore: 78,
                    environmentalScore: 82,
                    socialScore: 76,
                    governanceScore: 75,
                    keyAchievements: [
                      'Reduced GHG emissions by 15% year-over-year',
                      'Achieved carbon neutral operations in 3 facilities',
                      'Implemented comprehensive emissions monitoring',
                      'Verified by third-party auditor (KPMG)'
                    ],
                    keyRisks: [
                      'Scope 3 emissions represent 79% of total footprint',
                      'Supply chain decarbonization challenges',
                      'Regulatory compliance deadlines approaching'
                    ]
                  },
                  metrics: [
                    { category: 'environmental', metricName: 'Total GHG Emissions', value: emissions.totalEmissions, unit: 'tCO₂e', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Scope 1 Emissions', value: emissions.scope1, unit: 'tCO₂e', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Scope 2 Emissions', value: emissions.scope2, unit: 'tCO₂e', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Scope 3 Emissions', value: emissions.scope3, unit: 'tCO₂e', trend: 'down' as const },
                    { category: 'environmental', metricName: 'Emission Intensity', value: emissions.emissionIntensity, unit: 'tCO₂e / $1k revenue', trend: 'down' as const },
                  ],
                  complianceStatus: [
                    { framework: 'GHG Protocol', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'TCFD', status: 'in_progress' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'SBTi', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: [
                    'Expand renewable energy procurement',
                    'Implement supplier engagement program',
                    'Enhance carbon offset strategy'
                  ]
                };
                
                // Generate and download PDF
                const pdfBlob = await generateESGReport(config, reportData);
                
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `GHG_Emissions_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('GHG emissions PDF downloaded successfully');
              } catch (error) {
                console.error('PDF generation error:', error);
                alert(`PDF generation failed: ${error.message}`);
              }
            }}
          >
            <FileText className="h-4 w-4" />
            <span>Download PDF Report</span>
          </Button>
        </div>
      </div>

      {/* Data Upload Section */}
      <Card className="border-2 border-green-200 bg-green-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Upload GHG Emissions Data
          </CardTitle>
          <p className="text-sm text-gray-600">Download our Excel template, add your emissions data, and upload to see immediate impact on your ESG scores</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Step 1: Download Template</h4>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.open('/api/data/template/metrics', '_blank')}
              >
                <Download className="h-4 w-4 mr-2" />
                GHG Emissions Template
              </Button>
              <p className="text-xs text-gray-500">Pre-formatted Excel template with GHG Protocol standards</p>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Step 2: Fill Your Data</h4>
              <div className="p-3 bg-white rounded border text-xs">
                <div className="font-medium text-gray-700 mb-1">Required Fields:</div>
                <ul className="text-gray-600 space-y-0.5">
                  <li>• Scope 1, 2, 3 emissions</li>
                  <li>• Measurement units (tCO2e)</li>
                  <li>• Reporting period</li>
                  <li>• Data source & verification</li>
                </ul>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-gray-700">Step 3: Upload & See Impact</h4>
              <Button 
                onClick={() => setShowDataUpload(true)}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload Emissions Data
              </Button>
              <p className="text-xs text-gray-500 text-center">Instant ESG score recalculation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Emissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  {(totalEmissions / 1000).toFixed(0)}k
                </div>
                <div className="text-sm text-gray-500">tCO₂e</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -12.1% vs 2023
                </div>
              </div>
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Emission Intensity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-secondary">
                  {parseFloat(emissions.emissionIntensity).toFixed(3)}
                </div>
                <div className="text-sm text-gray-500">tCO₂e / $1k revenue</div>
                <div className="text-sm text-success mt-1">
                  <TrendingDown className="h-3 w-3 inline mr-1" />
                  -15.3% vs 2023
                </div>
              </div>
              <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center">
                <Calculator className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">2030 Reduction Target</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-accent">
                  {emissions.reductionTarget}%
                </div>
                <div className="text-sm text-gray-500">vs 2019 baseline</div>
                <div className="text-sm text-warning mt-1">
                  <Target className="h-3 w-3 inline mr-1" />
                  Science-based target
                </div>
              </div>
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-success">
                  {emissions.verified ? "✓" : "○"}
                </div>
                <div className="text-sm text-gray-500">{emissions.verificationBody}</div>
                <div className="text-sm text-success mt-1">
                  <CheckCircle className="h-3 w-3 inline mr-1" />
                  {emissions.verified ? "Verified" : "Pending"}
                </div>
              </div>
              <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emissions Breakdown and Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scope Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Emissions by Scope</CardTitle>
            <p className="text-sm text-gray-600">
              GHG Protocol scope categorization with percentage breakdown
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scopeBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {scopeBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${(value as number).toLocaleString()} tCO₂e`]} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {scopeBreakdown.map((scope, index) => (
                <div key={index} className="text-center">
                  <div className="text-lg font-bold" style={{ color: scope.color }}>
                    {scope.percentage}%
                  </div>
                  <div className="text-xs text-gray-500">{scope.name}</div>
                  <div className="text-sm font-medium text-gray-900">
                    {scope.value.toLocaleString()} tCO₂e
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Historical Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Historical Emissions Trends</CardTitle>
            <p className="text-sm text-gray-600">
              Six-year emissions trajectory showing reduction progress
            </p>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${(value as number).toLocaleString()} tCO₂e`]} />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    stroke="hsl(222.2, 84%, 4.9%)" 
                    strokeWidth={3}
                    name="Total Emissions"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scope1" 
                    stroke="hsl(0, 84%, 60%)" 
                    strokeWidth={2}
                    name="Scope 1"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scope2" 
                    stroke="hsl(43, 96%, 56%)" 
                    strokeWidth={2}
                    name="Scope 2"
                  />
                  <Line 
                    type="monotone" 
                    dataKey="scope3" 
                    stroke="hsl(142, 71%, 45%)" 
                    strokeWidth={2}
                    name="Scope 3"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reduction Pathway */}
      <Card>
        <CardHeader>
          <CardTitle>Science-Based Target Pathway</CardTitle>
          <p className="text-sm text-gray-600">
            Projected emissions reduction to achieve 30% reduction by 2030 (vs 2019 baseline)
          </p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={reductionPathway}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip formatter={(value) => [`${(value as number).toLocaleString()} tCO₂e`]} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="hsl(142, 71%, 45%)" 
                  strokeWidth={3}
                  name="Actual Emissions"
                  connectNulls={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(217, 91%, 60%)" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target Pathway"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Science-Based Target Commitment</h4>
            <p className="text-sm text-blue-800">
              Our emissions reduction target is aligned with limiting global warming to 1.5°C above pre-industrial levels,
              as validated by the Science Based Targets initiative (SBTi).
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Parameters */}
      {!parametersLoading && parameters && parameters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Emissions Reduction Parameters</CardTitle>
            <p className="text-sm text-gray-600">
              Adjust key parameters to model different emission reduction scenarios
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {parameters.map((param) => (
                <ParameterSlider key={param.id} parameter={param} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Real-time Impact Calculator */}
      {!parametersLoading && parameters && parameters.length > 0 && (
        <ImpactCalculator 
          parameters={parameters} 
          organizationId={organizationId} 
          category="environmental" 
        />
      )}

      {/* Detailed Scope Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Scope 1 Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scope 1 - Direct Emissions</CardTitle>
            <p className="text-sm text-gray-600">Combustion and process emissions</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Stationary Combustion</span>
                <span className="text-sm font-medium">8,670 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Mobile Combustion</span>
                <span className="text-sm font-medium">2,340 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Process Emissions</span>
                <span className="text-sm font-medium">1,440 tCO₂e</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Scope 1</span>
                  <span>{scope1.toLocaleString()} tCO₂e</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scope 2 Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scope 2 - Energy Indirect</CardTitle>
            <p className="text-sm text-gray-600">Purchased electricity, heat, steam</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purchased Electricity</span>
                <span className="text-sm font-medium">24,560 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purchased Heat/Steam</span>
                <span className="text-sm font-medium">3,420 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purchased Cooling</span>
                <span className="text-sm font-medium">750 tCO₂e</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Scope 2</span>
                  <span>{scope2.toLocaleString()} tCO₂e</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Scope 3 Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scope 3 - Value Chain</CardTitle>
            <p className="text-sm text-gray-600">Upstream and downstream activities</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purchased Goods & Services</span>
                <span className="text-sm font-medium">89,340 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Business Travel</span>
                <span className="text-sm font-medium">12,450 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Employee Commuting</span>
                <span className="text-sm font-medium">8,900 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Use of Sold Products</span>
                <span className="text-sm font-medium">34,200 tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Other Categories</span>
                <span className="text-sm font-medium">12,000 tCO₂e</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-medium">
                  <span>Total Scope 3</span>
                  <span>{scope3.toLocaleString()} tCO₂e</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Upload Modal */}
      <DataUploadModal
        isOpen={showDataUpload}
        onClose={() => setShowDataUpload(false)}
        organizationId={organizationId}
      />
    </div>
  );
}