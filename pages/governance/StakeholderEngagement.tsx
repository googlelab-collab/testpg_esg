import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users, TrendingUp, Target, FileText } from "lucide-react";

export default function StakeholderEngagement() {
  const engagementMetrics = {
    satisfaction: 84,
    participation: 76,
    feedback: 92,
    transparency: 88
  };

  const stakeholderGroups = {
    investors: 91,
    employees: 85,
    customers: 79,
    communities: 73
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Stakeholder Engagement</h1>
          <p className="text-muted-foreground">Monitor stakeholder relationships and engagement quality</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Stakeholder Engagement & Relations Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'AA1000 Stakeholder Engagement' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 82, environmentalScore: 78, socialScore: 85, governanceScore: 84,
                    keyAchievements: ['84% stakeholder satisfaction', '76% participation rate', '92% feedback quality score'],
                    keyRisks: ['Community relations challenges', 'Investor engagement gaps', 'Digital engagement barriers']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'Stakeholder Satisfaction', value: '84', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Participation Rate', value: '76', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Feedback Quality', value: '92', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Transparency Score', value: '88', unit: '%', trend: 'up' as const }
                  ],
                  complianceStatus: [
                    { framework: 'AA1000 Stakeholder Engagement', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'GRI 102 Stakeholder Engagement', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance digital engagement platforms', 'Strengthen community outreach', 'Improve investor communication']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Stakeholder_Engagement_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Engagement Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Engagement Score: B+
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.satisfaction}%</div>
            <p className="text-xs text-muted-foreground">overall satisfaction</p>
            <Progress value={engagementMetrics.satisfaction} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participation</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.participation}%</div>
            <p className="text-xs text-muted-foreground">active participation</p>
            <Progress value={engagementMetrics.participation} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Quality</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.feedback}%</div>
            <p className="text-xs text-muted-foreground">constructive feedback</p>
            <Progress value={engagementMetrics.feedback} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transparency</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{engagementMetrics.transparency}%</div>
            <p className="text-xs text-muted-foreground">disclosure rating</p>
            <Progress value={engagementMetrics.transparency} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Stakeholder Groups</CardTitle>
            <CardDescription>Engagement scores by stakeholder category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Investors</span>
                <span className="text-sm text-muted-foreground">{stakeholderGroups.investors}%</span>
              </div>
              <Progress value={stakeholderGroups.investors} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Employees</span>
                <span className="text-sm text-muted-foreground">{stakeholderGroups.employees}%</span>
              </div>
              <Progress value={stakeholderGroups.employees} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Customers</span>
                <span className="text-sm text-muted-foreground">{stakeholderGroups.customers}%</span>
              </div>
              <Progress value={stakeholderGroups.customers} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Communities</span>
                <span className="text-sm text-muted-foreground">{stakeholderGroups.communities}%</span>
              </div>
              <Progress value={stakeholderGroups.communities} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Engagement Activities</CardTitle>
            <CardDescription>Key engagement initiatives and frequency</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Annual General Meeting</span>
                <Badge variant="outline" className="text-green-600">Annual</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Quarterly Investor Calls</span>
                <Badge variant="outline" className="text-green-600">Quarterly</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Employee Surveys</span>
                <Badge variant="outline" className="text-green-600">Bi-annual</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Community Forums</span>
                <Badge variant="outline" className="text-green-600">Monthly</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}