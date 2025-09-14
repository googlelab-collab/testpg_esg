import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, CheckCircle, TrendingUp, FileText } from "lucide-react";

export default function Cybersecurity() {
  const securityMetrics = {
    maturityScore: 87,
    incidents: 3,
    compliance: 94,
    training: 89
  };

  const threatMetrics = {
    blocked: 99.8,
    detected: 15,
    resolved: 98.5,
    uptime: 99.95
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cybersecurity</h1>
          <p className="text-muted-foreground">Monitor cyber risk management and security posture</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Cybersecurity & Information Security Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'NIST Cybersecurity Framework' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 87, environmentalScore: 78, socialScore: 82, governanceScore: 92,
                    keyAchievements: ['87% security maturity score', '99.8% threat blocking rate', 'Zero critical incidents in Q4'],
                    keyRisks: ['Advanced persistent threats', 'Third-party vulnerabilities', 'Remote work security gaps']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'Security Maturity Score', value: '87', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Security Incidents', value: '3', unit: 'incidents', trend: 'down' as const },
                    { category: 'governance', metricName: 'Compliance Rate', value: '94', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Training Coverage', value: '89', unit: '%', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'NIST Cybersecurity Framework', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'ISO 27001', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance threat detection capabilities', 'Strengthen third-party security assessments', 'Expand security awareness training']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Cybersecurity_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Security Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Security Rating: A
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maturity Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.maturityScore}%</div>
            <p className="text-xs text-muted-foreground">+3% from last quarter</p>
            <Progress value={securityMetrics.maturityScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Security Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.incidents}</div>
            <p className="text-xs text-muted-foreground">this quarter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.compliance}%</div>
            <p className="text-xs text-muted-foreground">regulatory standards</p>
            <Progress value={securityMetrics.compliance} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Coverage</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{securityMetrics.training}%</div>
            <p className="text-xs text-muted-foreground">employee completion</p>
            <Progress value={securityMetrics.training} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Threat Detection</CardTitle>
            <CardDescription>Real-time security monitoring and response</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Threats Blocked</span>
                <span className="text-sm text-muted-foreground">{threatMetrics.blocked}%</span>
              </div>
              <Progress value={threatMetrics.blocked} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Advanced Threats Detected</span>
                <span className="text-sm text-muted-foreground">{threatMetrics.detected}</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Incidents Resolved</span>
                <span className="text-sm text-muted-foreground">{threatMetrics.resolved}%</span>
              </div>
              <Progress value={threatMetrics.resolved} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">System Uptime</span>
                <span className="text-sm text-muted-foreground">{threatMetrics.uptime}%</span>
              </div>
              <Progress value={threatMetrics.uptime} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Framework</CardTitle>
            <CardDescription>Compliance with security standards</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ISO 27001</span>
                <Badge variant="outline" className="text-green-600">Certified</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">SOC 2 Type II</span>
                <Badge variant="outline" className="text-green-600">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">GDPR</span>
                <Badge variant="outline" className="text-green-600">Compliant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">NIST Framework</span>
                <Badge variant="outline" className="text-yellow-600">In Progress</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}