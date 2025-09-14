import React, { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Brain, Zap, TrendingUp, Shield, Target, Lightbulb } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';

interface AIAnalysisResult {
  insights: string[];
  recommendations: string[];
  risks: string[];
  opportunities: string[];
  actionPlan?: {
    priority: 'high' | 'medium' | 'low';
    timeframe: string;
    description: string;
    expectedImpact: string;
    resources: string;
    owner: string;
    kpis: string[];
  }[];
  benchmarks?: {
    metric: string;
    value: number;
    industryAverage: number;
    topPerformers: number;
    ranking: string;
    source: string;
  }[];
  confidence: number;
}

const analysisTypes = [
  { value: 'carbon_reduction', label: 'Carbon Reduction Analysis', icon: TrendingUp },
  { value: 'sustainability_assessment', label: 'Sustainability Assessment', icon: Target },
  { value: 'compliance_analysis', label: 'Compliance Analysis', icon: Shield },
  { value: 'risk_assessment', label: 'Risk Assessment', icon: Brain },
  { value: 'datacenter_optimization', label: 'Data Center Optimization', icon: Zap },
];

export default function AIAssistant() {
  const [selectedAnalysis, setSelectedAnalysis] = useState<string>('');
  const [context, setContext] = useState('');
  const [moduleType, setModuleType] = useState('environmental');
  const organizationId = 1; // Default organization

  // Fetch ESG data for analysis
  const { data: metrics } = useQuery({
    queryKey: ['/api/esg-metrics', organizationId],
    retry: false,
  });

  const { data: parameters } = useQuery({
    queryKey: ['/api/esg-parameters', organizationId],
    retry: false,
  });

  const { data: complianceFrameworks } = useQuery({
    queryKey: ['/api/compliance-frameworks', organizationId],
    retry: false,
  });

  const { data: dataCenterMetrics } = useQuery({
    queryKey: ['/api/datacenter-metrics', organizationId],
    retry: false,
  });

  // AI Analysis mutation
  const analysisMutation = useMutation({
    mutationFn: async (analysisRequest: any) => {
      console.log('Sending AI analysis request:', analysisRequest);
      try {
        const response = await apiRequest(`/api/ai/analyze`, {
          method: 'POST',
          body: JSON.stringify(analysisRequest),
          headers: { 'Content-Type': 'application/json' },
        });
        console.log('AI analysis response:', response);
        return response;
      } catch (error) {
        console.error('AI analysis error:', error);
        throw error;
      }
    },
  });

  const handleAnalysis = async () => {
    if (!selectedAnalysis) return;

    const analysisRequest = {
      type: selectedAnalysis,
      organizationId,
      data: {
        metrics: metrics || [],
        parameters: parameters || [],
        complianceFrameworks: complianceFrameworks || [],
        dataCenterMetrics: dataCenterMetrics || [],
      },
      context,
      moduleType,
    };

    analysisMutation.mutate(analysisRequest);
  };

  const renderAnalysisResults = (result: AIAnalysisResult, cached: boolean) => {
    const getPriorityColor = (priority: string) => {
      switch (priority) {
        case 'high': return 'bg-red-100 text-red-800';
        case 'medium': return 'bg-yellow-100 text-yellow-800';
        case 'low': return 'bg-green-100 text-green-800';
        default: return 'bg-gray-100 text-gray-800';
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">AI Analysis Results</h3>
          <div className="flex items-center gap-2">
            <Badge variant={cached ? 'outline' : 'default'}>
              {cached ? 'Cached' : 'Fresh'}
            </Badge>
            <Badge variant="outline">
              {Math.round(result.confidence * 100)}% Confidence
            </Badge>
          </div>
        </div>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.insights.map((insight, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-sm">{rec}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Risks & Opportunities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.risks.map((risk, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600 mt-1">•</span>
                    <span className="text-sm">{risk}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Opportunities
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {result.opportunities.map((opp, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">•</span>
                    <span className="text-sm">{opp}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Action Plan */}
        {result.actionPlan && result.actionPlan.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Action Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {result.actionPlan.map((action, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{action.description}</h4>
                      <Badge className={getPriorityColor(action.priority)}>
                        {action.priority} Priority
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Timeframe:</span> {action.timeframe}
                      </div>
                      <div>
                        <span className="font-medium">Owner:</span> {action.owner}
                      </div>
                      <div>
                        <span className="font-medium">Expected Impact:</span> {action.expectedImpact}
                      </div>
                      <div>
                        <span className="font-medium">Resources:</span> {action.resources}
                      </div>
                    </div>
                    {action.kpis && action.kpis.length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium">KPIs:</span>
                        <ul className="mt-1 space-y-1">
                          {action.kpis.map((kpi, kpiIndex) => (
                            <li key={kpiIndex} className="text-sm ml-4">• {kpi}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Benchmarks */}
        {result.benchmarks && result.benchmarks.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Industry Benchmarks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.benchmarks.map((benchmark, index) => (
                  <div key={index} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">{benchmark.metric}</span>
                      <Badge variant="outline">{benchmark.ranking}</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Current:</span> {benchmark.value}
                      </div>
                      <div>
                        <span className="text-gray-600">Industry Avg:</span> {benchmark.industryAverage}
                      </div>
                      <div>
                        <span className="text-gray-600">Top Performers:</span> {benchmark.topPerformers}
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500">
                      Source: {benchmark.source}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">AI ESG Assistant</h1>
        <Badge variant="outline" className="text-sm">
          Powered by Google Gemini (Free)
        </Badge>
      </div>

      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          Use free Google Gemini AI to analyze your ESG data, get actionable insights, and generate optimization recommendations.
          The AI considers your current metrics, compliance frameworks, and industry benchmarks.
        </AlertDescription>
      </Alert>

      {/* AI Analysis Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Configure AI Analysis</CardTitle>
          <CardDescription>
            Select the type of analysis you want to perform and provide additional context.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Analysis Type</label>
              <Select value={selectedAnalysis} onValueChange={setSelectedAnalysis}>
                <SelectTrigger>
                  <SelectValue placeholder="Select analysis type" />
                </SelectTrigger>
                <SelectContent>
                  {analysisTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center gap-2">
                        <type.icon className="h-4 w-4" />
                        {type.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Module Focus</label>
              <Select value={moduleType} onValueChange={setModuleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="environmental">Environmental</SelectItem>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="governance">Governance</SelectItem>
                  <SelectItem value="datacenter">Data Center</SelectItem>
                  <SelectItem value="overall">Overall ESG</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Additional Context (Optional)</label>
            <Textarea
              placeholder="Provide any specific context, concerns, or questions you want the AI to consider..."
              value={context}
              onChange={(e) => setContext(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button
            onClick={handleAnalysis}
            disabled={!selectedAnalysis || analysisMutation.isPending}
            className="w-full"
          >
            {analysisMutation.isPending ? (
              <LoadingSpinner />
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Generate AI Analysis
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Analysis Results */}
      {analysisMutation.data && (
        <Card>
          <CardContent className="pt-6">
            {renderAnalysisResults(
              analysisMutation.data.analysis,
              analysisMutation.data.cached
            )}
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {analysisMutation.error && (
        <Alert variant="destructive">
          <AlertDescription>
            Failed to generate AI analysis: {analysisMutation.error.message}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}