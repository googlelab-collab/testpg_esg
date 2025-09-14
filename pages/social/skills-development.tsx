import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Target, BookOpen, TrendingUp } from "lucide-react";

export default function SkillsDevelopment() {
  const [activeProgram, setActiveProgram] = useState("technical");

  const developmentMetrics = {
    technical: {
      score: 84,
      completion: 78,
      participants: 450,
      improvement: "+22%"
    },
    leadership: {
      score: 91,
      completion: 85,
      participants: 120,
      improvement: "+18%"
    },
    digital: {
      score: 76,
      completion: 69,
      participants: 380,
      improvement: "+35%"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Skills Development</h1>
          <p className="text-muted-foreground">Track employee training, development programs, and skill advancement</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Overall Engagement: 84%
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`cursor-pointer transition-all ${activeProgram === "technical" ? "ring-2 ring-blue-500" : ""}`} 
              onClick={() => setActiveProgram("technical")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Technical Skills</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developmentMetrics.technical.score}%</div>
            <p className="text-xs text-muted-foreground">{developmentMetrics.technical.improvement} completion rate</p>
            <Progress value={developmentMetrics.technical.completion} className="mt-2" />
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activeProgram === "leadership" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setActiveProgram("leadership")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Leadership Development</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developmentMetrics.leadership.score}%</div>
            <p className="text-xs text-muted-foreground">{developmentMetrics.leadership.improvement} completion rate</p>
            <Progress value={developmentMetrics.leadership.completion} className="mt-2" />
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activeProgram === "digital" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setActiveProgram("digital")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Digital Literacy</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developmentMetrics.digital.score}%</div>
            <p className="text-xs text-muted-foreground">{developmentMetrics.digital.improvement} completion rate</p>
            <Progress value={developmentMetrics.digital.completion} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="data-upload">Data Upload</TabsTrigger>
          <TabsTrigger value="benchmarks">Benchmarks</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Skills Development Programs</CardTitle>
              <CardDescription>
                Monitor training effectiveness, skill progression, and development ROI
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Training Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Total Training Hours</span>
                      <span className="text-sm font-medium">12,450 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Hours per Employee</span>
                      <span className="text-sm font-medium">25.2 hours</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Training Completion Rate</span>
                      <span className="text-sm font-medium">84%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Development Impact</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Internal Promotions</span>
                      <span className="text-sm font-medium">67 (28% increase)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Skill Certification Rate</span>
                      <span className="text-sm font-medium">72%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employee Retention</span>
                      <span className="text-sm font-medium">91%</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload Skills Development Data</CardTitle>
              <CardDescription>
                Upload training records, certification data, and skill assessments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <GraduationCap className="h-6 w-6" />
                  <span>Training Records</span>
                  <span className="text-xs text-muted-foreground">CSV, Excel</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Target className="h-6 w-6" />
                  <span>Skill Assessments</span>
                  <span className="text-xs text-muted-foreground">CSV, Excel</span>
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">API Endpoints</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  POST /api/social/skills-development/training<br/>
                  POST /api/social/skills-development/certifications<br/>
                  POST /api/social/skills-development/assessments
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="benchmarks">
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarks</CardTitle>
              <CardDescription>
                Compare your skills development metrics against industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">84%</div>
                    <div className="text-sm text-muted-foreground">Your Rate</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">67%</div>
                    <div className="text-sm text-muted-foreground">Industry Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">92%</div>
                    <div className="text-sm text-muted-foreground">Industry Leader</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Based on global workforce development standards and best practices
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports">
          <Card>
            <CardHeader>
              <CardTitle>Generate Reports</CardTitle>
              <CardDescription>
                Create comprehensive skills development reports for stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Skills Development Summary
                </Button>
                <Button variant="outline" className="w-full">
                  Download Training Effectiveness Report
                </Button>
                <Button variant="outline" className="w-full">
                  Export ROI Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}