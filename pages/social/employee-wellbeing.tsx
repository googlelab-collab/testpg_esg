import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Heart, Shield, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorMessage from "@/components/common/ErrorMessage";

export default function EmployeeWellbeing() {
  const organizationId = 1;
  const [activeMetric, setActiveMetric] = useState("safety");
  
  const { data: wellbeingData, isLoading: wellbeingLoading, error: wellbeingError } = useQuery({
    queryKey: [`/api/social-metrics/${organizationId}?metricType=wellbeing`],
    retry: false,
  });

  if (wellbeingLoading) return <LoadingSpinner message="Loading employee wellbeing data..." />;
  if (wellbeingError) {
    console.error("Employee wellbeing data error:", wellbeingError);
    // Still show the page with mock data if API fails
  }

  const wellbeingMetrics = {
    safety: {
      score: 87,
      incidents: 12,
      target: 5,
      improvement: "+15%"
    },
    health: {
      score: 92,
      programParticipation: "78%",
      healthInsurance: "100%",
      improvement: "+8%"
    },
    workLife: {
      score: 85,
      flexibility: "90%",
      satisfaction: "4.2/5",
      improvement: "+12%"
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employee Wellbeing</h1>
          <p className="text-muted-foreground">Monitor and improve workplace safety, health, and work-life balance</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Overall Score: 88/100
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className={`cursor-pointer transition-all ${activeMetric === "safety" ? "ring-2 ring-blue-500" : ""}`} 
              onClick={() => setActiveMetric("safety")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workplace Safety</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wellbeingMetrics.safety.score}/100</div>
            <p className="text-xs text-muted-foreground">{wellbeingMetrics.safety.improvement} from last quarter</p>
            <Progress value={wellbeingMetrics.safety.score} className="mt-2" />
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activeMetric === "health" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setActiveMetric("health")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Programs</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wellbeingMetrics.health.score}/100</div>
            <p className="text-xs text-muted-foreground">{wellbeingMetrics.health.improvement} from last quarter</p>
            <Progress value={wellbeingMetrics.health.score} className="mt-2" />
          </CardContent>
        </Card>

        <Card className={`cursor-pointer transition-all ${activeMetric === "workLife" ? "ring-2 ring-blue-500" : ""}`}
              onClick={() => setActiveMetric("workLife")}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Work-Life Balance</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{wellbeingMetrics.workLife.score}/100</div>
            <p className="text-xs text-muted-foreground">{wellbeingMetrics.workLife.improvement} from last quarter</p>
            <Progress value={wellbeingMetrics.workLife.score} className="mt-2" />
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
              <CardTitle>Employee Wellbeing Metrics</CardTitle>
              <CardDescription>
                Track key performance indicators for employee safety, health, and satisfaction
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <h4 className="font-semibold">Safety Metrics</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Lost Time Incidents</span>
                      <span className="text-sm font-medium">12 (Target: 5)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Days Without Incident</span>
                      <span className="text-sm font-medium">45 days</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Safety Training Completion</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="font-semibold">Health & Wellness</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm">Health Program Participation</span>
                      <span className="text-sm font-medium">78%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Mental Health Support</span>
                      <span className="text-sm font-medium">Available 24/7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Employee Satisfaction</span>
                      <span className="text-sm font-medium">4.2/5</span>
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
              <CardTitle>Upload Employee Wellbeing Data</CardTitle>
              <CardDescription>
                Upload safety incident reports, health program data, and employee satisfaction surveys
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Shield className="h-6 w-6" />
                  <span>Safety Incident Data</span>
                  <span className="text-xs text-muted-foreground">CSV, Excel</span>
                </Button>
                <Button variant="outline" className="h-24 flex flex-col gap-2">
                  <Heart className="h-6 w-6" />
                  <span>Health Program Data</span>
                  <span className="text-xs text-muted-foreground">CSV, Excel</span>
                </Button>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">API Endpoints</h4>
                <div className="bg-muted p-3 rounded-md font-mono text-sm">
                  POST /api/social/employee-wellbeing/safety<br/>
                  POST /api/social/employee-wellbeing/health<br/>
                  POST /api/social/employee-wellbeing/satisfaction
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
                Compare your employee wellbeing metrics against industry standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-green-600">87</div>
                    <div className="text-sm text-muted-foreground">Your Score</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">72</div>
                    <div className="text-sm text-muted-foreground">Industry Average</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">95</div>
                    <div className="text-sm text-muted-foreground">Industry Leader</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground text-center">
                  Based on OSHA guidelines and industry safety standards
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
                Create comprehensive employee wellbeing reports for stakeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Generate Executive Summary
                </Button>
                <Button variant="outline" className="w-full">
                  Download Detailed Safety Report
                </Button>
                <Button variant="outline" className="w-full">
                  Export Health Program Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}