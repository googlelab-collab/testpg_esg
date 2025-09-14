import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Shield, TrendingUp, Target, FileText } from "lucide-react";

export default function RiskManagement() {
  const riskMetrics = {
    maturityLevel: 85,
    identifiedRisks: 42,
    mitigatedRisks: 87,
    emergingRisks: 8
  };

  const riskCategories = {
    operational: 78,
    financial: 92,
    strategic: 83,
    compliance: 89
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Risk Management</h1>
          <p className="text-muted-foreground">Monitor enterprise risk management and mitigation strategies</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Enterprise Risk Management Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'COSO ERM Framework' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 85, environmentalScore: 78, socialScore: 82, governanceScore: 90,
                    keyAchievements: ['85% risk management maturity', '87% mitigation rate achieved', '42 risks identified and assessed'],
                    keyRisks: ['8 emerging risks this quarter', 'Climate risk integration needed', 'Digital transformation risks']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'Risk Maturity Level', value: '85', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Identified Risks', value: '42', unit: 'risks', trend: 'stable' as const },
                    { category: 'governance', metricName: 'Mitigation Rate', value: '87', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Emerging Risks', value: '8', unit: 'new risks', trend: 'stable' as const }
                  ],
                  complianceStatus: [
                    { framework: 'COSO ERM Framework', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'ISO 31000', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance climate risk assessment', 'Strengthen digital risk controls', 'Improve risk monitoring systems']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Risk_Management_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Risk Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Risk Rating: Medium
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maturity Level</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.maturityLevel}%</div>
            <p className="text-xs text-muted-foreground">risk management maturity</p>
            <Progress value={riskMetrics.maturityLevel} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Identified Risks</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.identifiedRisks}</div>
            <p className="text-xs text-muted-foreground">total risk register</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mitigation Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.mitigatedRisks}%</div>
            <p className="text-xs text-muted-foreground">risks with controls</p>
            <Progress value={riskMetrics.mitigatedRisks} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emerging Risks</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskMetrics.emergingRisks}</div>
            <p className="text-xs text-muted-foreground">new this quarter</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Categories</CardTitle>
            <CardDescription>Risk assessment by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Operational</span>
                <span className="text-sm text-muted-foreground">{riskCategories.operational}%</span>
              </div>
              <Progress value={riskCategories.operational} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Financial</span>
                <span className="text-sm text-muted-foreground">{riskCategories.financial}%</span>
              </div>
              <Progress value={riskCategories.financial} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Strategic</span>
                <span className="text-sm text-muted-foreground">{riskCategories.strategic}%</span>
              </div>
              <Progress value={riskCategories.strategic} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Compliance</span>
                <span className="text-sm text-muted-foreground">{riskCategories.compliance}%</span>
              </div>
              <Progress value={riskCategories.compliance} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Risk Framework</CardTitle>
            <CardDescription>Enterprise risk management components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Committee</span>
                <Badge variant="outline" className="text-green-600">Active</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Appetite Statement</span>
                <Badge variant="outline" className="text-green-600">Updated</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Risk Register</span>
                <Badge variant="outline" className="text-green-600">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Business Continuity</span>
                <Badge variant="outline" className="text-green-600">Tested</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}