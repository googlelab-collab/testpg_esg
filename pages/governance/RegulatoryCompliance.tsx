import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ClipboardCheck, AlertTriangle, CheckCircle, TrendingUp, FileText } from "lucide-react";

export default function RegulatoryCompliance() {
  const complianceMetrics = {
    overallCompliance: 91,
    openIssues: 3,
    completedAudits: 12,
    upcomingDeadlines: 5
  };

  const frameworks = {
    euCsrd: 85,
    secClimate: 92,
    tcfd: 88,
    sasb: 94
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Regulatory Compliance</h1>
          <p className="text-muted-foreground">Monitor compliance with regulatory frameworks and standards</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Regulatory Compliance Status Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'Multi-Framework Compliance' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 91, environmentalScore: 88, socialScore: 85, governanceScore: 94,
                    keyAchievements: ['91% overall compliance rate', '12 audits completed successfully', 'EU CSRD readiness achieved'],
                    keyRisks: ['3 open compliance issues', '5 upcoming regulatory deadlines', 'New regulation monitoring gaps']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'Overall Compliance', value: '91', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Open Issues', value: '3', unit: 'issues', trend: 'down' as const },
                    { category: 'governance', metricName: 'Completed Audits', value: '12', unit: 'audits', trend: 'up' as const },
                    { category: 'governance', metricName: 'Upcoming Deadlines', value: '5', unit: 'deadlines', trend: 'stable' as const }
                  ],
                  complianceStatus: [
                    { framework: 'EU CSRD', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'SEC Climate Rules', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'TCFD', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Address outstanding compliance issues', 'Enhance regulatory monitoring', 'Strengthen audit preparation processes']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Regulatory_Compliance_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Compliance Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Compliance Score: A-
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.overallCompliance}%</div>
            <p className="text-xs text-muted-foreground">across all frameworks</p>
            <Progress value={complianceMetrics.overallCompliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.openIssues}</div>
            <p className="text-xs text-muted-foreground">requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Audits</CardTitle>
            <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.completedAudits}</div>
            <p className="text-xs text-muted-foreground">this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Deadlines</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{complianceMetrics.upcomingDeadlines}</div>
            <p className="text-xs text-muted-foreground">next 90 days</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Regulatory Frameworks</CardTitle>
            <CardDescription>Compliance status by framework</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">EU CSRD</span>
                <span className="text-sm text-muted-foreground">{frameworks.euCsrd}%</span>
              </div>
              <Progress value={frameworks.euCsrd} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">SEC Climate Rules</span>
                <span className="text-sm text-muted-foreground">{frameworks.secClimate}%</span>
              </div>
              <Progress value={frameworks.secClimate} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">TCFD</span>
                <span className="text-sm text-muted-foreground">{frameworks.tcfd}%</span>
              </div>
              <Progress value={frameworks.tcfd} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">SASB</span>
                <span className="text-sm text-muted-foreground">{frameworks.sasb}%</span>
              </div>
              <Progress value={frameworks.sasb} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Compliance Activities</CardTitle>
            <CardDescription>Key compliance initiatives and status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Annual Sustainability Report</span>
                <Badge variant="outline" className="text-green-600">Published</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Third-Party Assurance</span>
                <Badge variant="outline" className="text-green-600">Completed</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Regulatory Filings</span>
                <Badge variant="outline" className="text-green-600">Current</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Internal Audit</span>
                <Badge variant="outline" className="text-yellow-600">In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}