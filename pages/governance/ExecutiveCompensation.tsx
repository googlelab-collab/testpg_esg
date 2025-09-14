import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { DollarSign, Target, TrendingUp, Users, FileText } from "lucide-react";

export default function ExecutiveCompensation() {
  const compensationMetrics = {
    esgAlignment: 78,
    payEquity: 92,
    disclosure: 88,
    payRatio: 247
  };

  const compensationStructure = {
    base: 35,
    variable: 45,
    longTerm: 20
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Executive Compensation</h1>
          <p className="text-muted-foreground">Track executive pay practices and ESG alignment</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Executive Compensation & Pay Equity Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'Say-on-Pay Guidelines' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 81, environmentalScore: 78, socialScore: 82, governanceScore: 84,
                    keyAchievements: ['78% ESG alignment in variable pay', '92% pay equity achieved', '88% disclosure transparency'],
                    keyRisks: ['CEO pay ratio above industry median', 'Long-term incentive complexity', 'Shareholder alignment concerns']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'ESG Alignment', value: '78', unit: '% of variable pay', trend: 'up' as const },
                    { category: 'governance', metricName: 'Pay Equity', value: '92', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Disclosure Score', value: '88', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'CEO Pay Ratio', value: '247', unit: ':1', trend: 'stable' as const }
                  ],
                  complianceStatus: [
                    { framework: 'Say-on-Pay Guidelines', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'Pay Equity Regulations', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance ESG metric integration', 'Reduce CEO pay ratio', 'Improve long-term incentive design']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Executive_Compensation_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
              } catch (error) {
                console.error('PDF generation error:', error);
                alert(`PDF generation failed: ${error.message}`);
              }
            }}
          >
            <FileText className="h-4 w-4" />
            Download Compensation Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Compensation Score: B+
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">ESG Alignment</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compensationMetrics.esgAlignment}%</div>
            <p className="text-xs text-muted-foreground">of variable pay</p>
            <Progress value={compensationMetrics.esgAlignment} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pay Equity</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compensationMetrics.payEquity}%</div>
            <p className="text-xs text-muted-foreground">gender pay parity</p>
            <Progress value={compensationMetrics.payEquity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disclosure Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compensationMetrics.disclosure}%</div>
            <p className="text-xs text-muted-foreground">transparency rating</p>
            <Progress value={compensationMetrics.disclosure} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CEO Pay Ratio</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{compensationMetrics.payRatio}:1</div>
            <p className="text-xs text-muted-foreground">vs median worker</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compensation Structure</CardTitle>
            <CardDescription>Breakdown of executive compensation components</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Base Salary</span>
                <span className="text-sm text-muted-foreground">{compensationStructure.base}%</span>
              </div>
              <Progress value={compensationStructure.base} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Variable Pay</span>
                <span className="text-sm text-muted-foreground">{compensationStructure.variable}%</span>
              </div>
              <Progress value={compensationStructure.variable} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Long-term Incentives</span>
                <span className="text-sm text-muted-foreground">{compensationStructure.longTerm}%</span>
              </div>
              <Progress value={compensationStructure.longTerm} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ESG Performance Metrics</CardTitle>
            <CardDescription>How executive pay aligns with ESG goals</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Carbon Reduction Target</span>
                <span className="text-sm font-bold">25%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Diversity Goals</span>
                <span className="text-sm font-bold">20%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Safety Metrics</span>
                <span className="text-sm font-bold">15%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Governance Score</span>
                <span className="text-sm font-bold">18%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}