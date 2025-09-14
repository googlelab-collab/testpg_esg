import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Users, Shield, Target, TrendingUp, FileText } from "lucide-react";

export default function BoardComposition() {
  const boardMetrics = {
    independence: 85,
    diversity: 72,
    experience: 91,
    tenure: 6.2
  };

  const diversityBreakdown = {
    gender: { women: 45, men: 55 },
    ethnicity: { diverse: 35, majority: 65 },
    age: { under50: 20, fiftyPlus: 80 }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Board Composition</h1>
          <p className="text-muted-foreground">Monitor board independence, diversity, and governance effectiveness</p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={async () => {
              try {
                const { generateESGReport } = await import('@/lib/pdfGenerator');
                const config = {
                  title: 'Board Composition & Governance Report',
                  organizationName: 'Enterprise Corp',
                  reportingPeriod: '2024',
                  framework: 'Corporate Governance Principles' as const,
                  includeCharts: true,
                  includeMetrics: true,
                  includeCompliance: true,
                };
                const reportData = {
                  executiveSummary: {
                    overallScore: 85, environmentalScore: 78, socialScore: 82, governanceScore: 88,
                    keyAchievements: ['85% board independence achieved', '72% diversity index maintained', 'Governance score A- rating'],
                    keyRisks: ['Board succession planning', 'Skills gap analysis needed', 'Committee effectiveness review']
                  },
                  metrics: [
                    { category: 'governance', metricName: 'Board Independence', value: '85', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Diversity Index', value: '72', unit: '%', trend: 'up' as const },
                    { category: 'governance', metricName: 'Experience Score', value: '91', unit: '%', trend: 'stable' as const },
                    { category: 'governance', metricName: 'Average Tenure', value: '6.2', unit: 'years', trend: 'stable' as const }
                  ],
                  complianceStatus: [
                    { framework: 'Corporate Governance Principles', status: 'compliant' as const, lastAssessment: new Date().toISOString() },
                    { framework: 'Board Diversity Standards', status: 'compliant' as const, lastAssessment: new Date().toISOString() }
                  ],
                  recommendations: ['Enhance board diversity initiatives', 'Implement succession planning framework', 'Strengthen committee oversight']
                };
                const pdfBlob = await generateESGReport(config, reportData);
                const url = URL.createObjectURL(pdfBlob);
                const link = document.createElement('a');
                link.href = url;
                link.download = `Board_Composition_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
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
            Download Board Report
          </Button>
          <Badge variant="outline" className="px-3 py-1">
            Governance Score: A-
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Board Independence</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boardMetrics.independence}%</div>
            <p className="text-xs text-muted-foreground">+5% from last quarter</p>
            <Progress value={boardMetrics.independence} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Diversity Index</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boardMetrics.diversity}%</div>
            <p className="text-xs text-muted-foreground">+12% from last year</p>
            <Progress value={boardMetrics.diversity} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Experience Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boardMetrics.experience}%</div>
            <p className="text-xs text-muted-foreground">Industry expertise</p>
            <Progress value={boardMetrics.experience} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Tenure</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{boardMetrics.tenure}</div>
            <p className="text-xs text-muted-foreground">years</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Diversity Breakdown</CardTitle>
            <CardDescription>Board member demographics and representation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Gender Diversity</span>
                <span className="text-sm text-muted-foreground">{diversityBreakdown.gender.women}% women</span>
              </div>
              <Progress value={diversityBreakdown.gender.women} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Ethnic Diversity</span>
                <span className="text-sm text-muted-foreground">{diversityBreakdown.ethnicity.diverse}% diverse</span>
              </div>
              <Progress value={diversityBreakdown.ethnicity.diverse} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Age Distribution</span>
                <span className="text-sm text-muted-foreground">{diversityBreakdown.age.under50}% under 50</span>
              </div>
              <Progress value={diversityBreakdown.age.under50} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Governance Effectiveness</CardTitle>
            <CardDescription>Board performance and oversight metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Meeting Attendance</span>
                <span className="text-sm font-bold">96%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Committee Participation</span>
                <span className="text-sm font-bold">100%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Board Evaluations</span>
                <span className="text-sm font-bold">Annual</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Executive Sessions</span>
                <span className="text-sm font-bold">Quarterly</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}