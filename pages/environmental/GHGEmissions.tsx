import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";
import ReportGenerator from "@/components/reports/ReportGenerator";

import { 
  Leaf, 
  TrendingDown, 
  Factory, 
  Zap, 
  Truck,
  Settings,
  FileText,
  Target,
  AlertTriangle
} from "lucide-react";

const organizationId = 1;

export default function GHGEmissions() {
  const [parameters, setParameters] = useState({
    energyMix: 45,
    fleetEfficiency: 75,
    businessTravel: 40,
    supplierEngagement: 60,
  });
  
  const [showReportGenerator, setShowReportGenerator] = useState(false);

  const { data: environmentalData, isLoading, error } = useQuery({
    queryKey: [`/api/environmental-metrics/${organizationId}`],
    select: (data) => data?.filter((metric: any) => metric.metricType === "ghg_emissions") || [],
    retry: false,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message="Failed to load GHG emissions data" />;

  const handleParameterChange = (parameter: string, value: number) => {
    setParameters(prev => ({ ...prev, [parameter]: value }));
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">GHG Emissions Tracker</h1>
          <p className="text-gray-600 mt-1">
            Scope 1-3 emissions tracking following GHG Protocol Corporate Accounting Standards
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                console.log('Simple PDF test starting...');
                
                // Create simple PDF content as text
                const content = `ESG Report Test
Generated: ${new Date().toLocaleString()}

Sample ESG Data:
- Total GHG Emissions: 45,230 tCO2e
- Renewable Energy: 45%
- Water Usage: 125,000 m³
- Employee Safety Rate: 99.2%
- Board Diversity: 40%

This is a test to verify PDF generation works.`;
                
                // Create blob and download as text first
                const blob = new Blob([content], { type: 'text/plain' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'ESG_Report_Test.txt';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                
                console.log('Simple download test completed');
                alert('Test file downloaded! This confirms download works. Now trying PDF...');
                
                // Now try PDF
                const { jsPDF } = await import('jspdf');
                const pdf = new jsPDF();
                pdf.text('ESG Report Test', 20, 20);
                pdf.text('Generated: ' + new Date().toLocaleString(), 20, 40);
                pdf.text('Sample ESG Data:', 20, 60);
                pdf.text('• GHG Emissions: 45,230 tCO2e', 25, 80);
                pdf.text('• Renewable Energy: 45%', 25, 95);
                pdf.save('ESG_Report.pdf');
                
                alert('PDF generated successfully!');
              } catch (error) {
                console.error('Error:', error);
                alert('Error: ' + error.message);
              }
            }}
          >
            <FileText className="h-4 w-4" />
            TEST PDF NOW
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => {
              console.log('Report button clicked, setting showReportGenerator to true');
              setShowReportGenerator(true);
            }}
          >
            <FileText className="h-4 w-4" />
            Export Report
          </Button>
          <Button className="flex items-center gap-2 esg-primary">
            <Target className="h-4 w-4" />
            Set SBT Target
          </Button>
        </div>
      </div>

      {/* Emissions Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Emissions</p>
                <p className="text-2xl font-bold text-gray-900">198,070</p>
                <p className="text-xs text-green-600">-18.5% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                <Leaf className="h-6 w-6 text-gray-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">tCO₂e</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scope 1</p>
                <p className="text-2xl font-bold text-red-600">12,450</p>
                <p className="text-xs text-red-600">+2.3% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center">
                <Factory className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Direct emissions</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scope 2</p>
                <p className="text-2xl font-bold text-orange-600">28,730</p>
                <p className="text-xs text-green-600">-12.4% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Indirect energy</p>
            </div>
          </CardContent>
        </Card>

        <Card className="esg-score-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Scope 3</p>
                <p className="text-2xl font-bold text-purple-600">156,890</p>
                <p className="text-xs text-green-600">-21.2% vs last year</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
            </div>
            <div className="mt-2">
              <p className="text-xs text-gray-500">Value chain</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Emissions Breakdown */}
        <div className="lg:col-span-2">
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Emissions Breakdown by Scope
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="scope1" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="scope1">Scope 1</TabsTrigger>
                  <TabsTrigger value="scope2">Scope 2</TabsTrigger>
                  <TabsTrigger value="scope3">Scope 3</TabsTrigger>
                </TabsList>
                
                <TabsContent value="scope1" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Natural Gas</span>
                      <span className="text-sm text-gray-600">7,890 tCO₂e</span>
                    </div>
                    <Progress value={63} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Diesel Fuel</span>
                      <span className="text-sm text-gray-600">3,240 tCO₂e</span>
                    </div>
                    <Progress value={26} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Refrigerants</span>
                      <span className="text-sm text-gray-600">1,320 tCO₂e</span>
                    </div>
                    <Progress value={11} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="scope2" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Grid Electricity</span>
                      <span className="text-sm text-gray-600">25,840 tCO₂e</span>
                    </div>
                    <Progress value={90} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Steam</span>
                      <span className="text-sm text-gray-600">2,890 tCO₂e</span>
                    </div>
                    <Progress value={10} className="h-2" />
                  </div>
                </TabsContent>
                
                <TabsContent value="scope3" className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Purchased Goods</span>
                      <span className="text-sm text-gray-600">89,340 tCO₂e</span>
                    </div>
                    <Progress value={57} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Transportation</span>
                      <span className="text-sm text-gray-600">34,560 tCO₂e</span>
                    </div>
                    <Progress value={22} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Business Travel</span>
                      <span className="text-sm text-gray-600">18,750 tCO₂e</span>
                    </div>
                    <Progress value={12} className="h-2" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Employee Commuting</span>
                      <span className="text-sm text-gray-600">14,240 tCO₂e</span>
                    </div>
                    <Progress value={9} className="h-2" />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Reduction Parameters */}
        <div>
          <Card className="esg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Reduction Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Energy Mix (% Renewable)</label>
                  <Badge variant="outline">{parameters.energyMix}%</Badge>
                </div>
                <Slider
                  value={[parameters.energyMix]}
                  onValueChange={(value) => handleParameterChange('energyMix', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Solar, wind, and other renewables
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Fleet Efficiency</label>
                  <Badge variant="outline">{parameters.fleetEfficiency}%</Badge>
                </div>
                <Slider
                  value={[parameters.fleetEfficiency]}
                  onValueChange={(value) => handleParameterChange('fleetEfficiency', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Electric vehicles and efficiency upgrades
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Travel Reduction</label>
                  <Badge variant="outline">{parameters.businessTravel}%</Badge>
                </div>
                <Slider
                  value={[parameters.businessTravel]}
                  onValueChange={(value) => handleParameterChange('businessTravel', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Remote meetings and policy changes
                </p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium">Supplier Engagement</label>
                  <Badge variant="outline">{parameters.supplierEngagement}%</Badge>
                </div>
                <Slider
                  value={[parameters.supplierEngagement]}
                  onValueChange={(value) => handleParameterChange('supplierEngagement', value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Suppliers with SBT commitments
                </p>
              </div>

              <Button className="w-full esg-primary">
                Apply Changes
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Science-Based Targets */}
      <Card className="esg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Science-Based Targets Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="font-medium">2030 Absolute Target</span>
              </div>
              <p className="text-sm text-gray-600">
                Reduce Scope 1 & 2 emissions by 50%
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>32%</span>
                </div>
                <Progress value={32} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600" />
                <span className="font-medium">2030 Intensity Target</span>
              </div>
              <p className="text-sm text-gray-600">
                Reduce Scope 3 emissions by 42%
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>28%</span>
                </div>
                <Progress value={28} className="h-2" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Leaf className="h-5 w-5 text-green-600" />
                <span className="font-medium">Net Zero Commitment</span>
              </div>
              <p className="text-sm text-gray-600">
                Achieve net zero emissions by 2050
              </p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>15%</span>
                </div>
                <Progress value={15} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Generator Dialog */}
      <Dialog open={showReportGenerator} onOpenChange={setShowReportGenerator}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate GHG Emissions Report</DialogTitle>
          </DialogHeader>
          {showReportGenerator && (
            <ReportGenerator
              defaultModule="GHG Emissions"
              defaultReportType="environmental"
              onClose={() => setShowReportGenerator(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
