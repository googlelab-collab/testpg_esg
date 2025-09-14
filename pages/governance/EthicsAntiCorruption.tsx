import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Scale, Shield, AlertTriangle, CheckCircle, FileText } from "lucide-react";

export default function EthicsAntiCorruption() {
  const ethicsMetrics = {
    trainingCompletion: 96,
    reportedCases: 7,
    policyCompliance: 94,
    whistleblowerIndex: 89
  };

  const complianceAreas = {
    antiCorruption: 98,
    giftPolicy: 92,
    conflictOfInterest: 87,
    thirdPartyDueDiligence: 91
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Ethics & Anti-Corruption</h1>
          <p className="text-muted-foreground">Monitor ethical conduct and anti-corruption measures</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Ethics & Anti-Corruption Compliance Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'UN Global Compact' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 89, environmentalScore: 78, socialScore: 82, governanceScore: 94,
                    keyAchievements: ['96% ethics training completion', '98% anti-corruption compliance', '89% whistleblower protection index'],
                    keyRisks: ['Third-party due diligence gaps', 'Emerging market compliance', 'Conflict of interest monitoring']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'Training Completion', value: '96', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Reported Cases', value: '7', unit: 'cases', trend: 'stable' as const },
                    { category: 'governance', metricName: 'Policy Compliance', value: '94', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Whistleblower Index', value: '89', unit: '%', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'UN Global Compact', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'UK Bribery Act', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance third-party screening', 'Strengthen conflict of interest policies', 'Expand ethics awareness programs']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Ethics_Anti_Corruption_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Ethics Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Ethics Rating: A-
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Completion</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ethicsMetrics.trainingCompletion}%</div>
            <p className="text-xs text-muted-foreground">annual ethics training</p>
            <Progress value={ethicsMetrics.trainingCompletion} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reported Cases</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ethicsMetrics.reportedCases}</div>
            <p className="text-xs text-muted-foreground">this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Policy Compliance</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ethicsMetrics.policyCompliance}%</div>
            <p className="text-xs text-muted-foreground">adherence rate</p>
            <Progress value={ethicsMetrics.policyCompliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Whistleblower Index</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{ethicsMetrics.whistleblowerIndex}%</div>
            <p className="text-xs text-muted-foreground">protection score</p>
            <Progress value={ethicsMetrics.whistleblowerIndex} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compliance Areas</CardTitle>
            <CardDescription>Performance across key ethics domains</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Anti-Corruption</span>
                <span className="text-sm text-muted-foreground">{complianceAreas.antiCorruption}%</span>
              </div>
              <Progress value={complianceAreas.antiCorruption} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Gift Policy</span>
                <span className="text-sm text-muted-foreground">{complianceAreas.giftPolicy}%</span>
              </div>
              <Progress value={complianceAreas.giftPolicy} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Conflict of Interest</span>
                <span className="text-sm text-muted-foreground">{complianceAreas.conflictOfInterest}%</span>
              </div>
              <Progress value={complianceAreas.conflictOfInterest} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Third Party Due Diligence</span>
                <span className="text-sm text-muted-foreground">{complianceAreas.thirdPartyDueDiligence}%</span>
              </div>
              <Progress value={complianceAreas.thirdPartyDueDiligence} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ethics Program</CardTitle>
            <CardDescription>Key components of our ethics framework</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Code of Conduct</span>
                <Badge variant="outline" className="text-green-600">Updated</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Ethics Hotline</span>
                <Badge variant="outline" className="text-green-600">24/7</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Regular Audits</span>
                <Badge variant="outline" className="text-green-600">Monthly</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Leadership Training</span>
                <Badge variant="outline" className="text-green-600">Quarterly</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}