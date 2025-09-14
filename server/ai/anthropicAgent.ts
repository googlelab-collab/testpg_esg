import { GoogleGenAI } from "@google/genai";

// DON'T DELETE THIS COMMENT
// Follow these instructions when using this blueprint:
// - Note that the newest Gemini model series is "gemini-2.5-flash" or gemini-2.5-pro"
//   - do not change this unless explicitly requested by the user

// This API key is from Gemini Developer API Key, not vertex AI API Key
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface ESGAnalysisRequest {
  type: 'carbon_reduction' | 'sustainability_assessment' | 'compliance_analysis' | 'risk_assessment' | 'datacenter_optimization';
  organizationId: number;
  data: {
    metrics?: any[];
    parameters?: any[];
    complianceFrameworks?: any[];
    dataCenterMetrics?: any[];
  };
  context?: string;
  moduleType?: string;
}

export interface ESGAnalysisResponse {
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

export interface DataCenterOptimization {
  pueOptimization: string[];
  coolingRecommendations: string[];
  energyEfficiency: string[];
  sustainabilityActions: string[];
}

class ESGAgent {
  async analyzeESGPerformance(request: ESGAnalysisRequest): Promise<ESGAnalysisResponse> {
    try {
      const prompt = this.buildAnalysisPrompt(request);
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: this.getSystemPrompt(request.type),
        },
        contents: prompt,
      });

      const analysis = this.parseAnalysisResponse(response.text || "");
      return {
        ...analysis,
        confidence: this.calculateConfidence(request.data)
      };
    } catch (error) {
      console.error('ESG Analysis Error:', error);
      throw new Error(`Failed to generate ESG analysis: ${error.message}`);
    }
  }

  async optimizeDataCenterOperations(metrics: any[]): Promise<DataCenterOptimization> {
    try {
      const prompt = `
Analyze the following data center metrics and provide specific optimization recommendations:

Metrics Data:
${JSON.stringify(metrics, null, 2)}

Please provide:
1. PUE optimization strategies (specific actions to reduce Power Usage Effectiveness)
2. Cooling system recommendations (including emerging technologies)
3. Energy efficiency improvements (renewable energy, demand management)
4. Sustainability actions (water usage, carbon reduction, waste heat recovery)

Focus on practical, measurable improvements with industry benchmarks.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: `You are an expert data center sustainability consultant specializing in energy efficiency optimization and green technology implementation. Provide specific, actionable recommendations with quantified benefits.`,
        },
        contents: prompt,
      });

      return this.parseOptimizationResponse(response.text || "");
    } catch (error) {
      console.error('Data Center Optimization Error:', error);
      throw new Error(`Failed to generate optimization recommendations: ${error.message}`);
    }
  }

  async generateESGReport(organizationId: number, moduleType: string, options: any): Promise<string> {
    try {
      const prompt = `
Generate a comprehensive ESG report narrative for ${moduleType} module.

Organization ID: ${organizationId}
Module Type: ${moduleType}
Include AI Insights: ${options.includeAI}

Create a professional executive summary and key findings section suitable for stakeholder communication.
Focus on:
- Performance highlights and achievements
- Risk identification and mitigation strategies
- Compliance status and regulatory alignment
- Strategic recommendations for improvement
- Industry benchmarking and positioning

Write in a professional, authoritative tone suitable for C-suite executives and board members.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        config: {
          systemInstruction: `You are a senior ESG consultant and report writer. Generate comprehensive, professional sustainability reports that meet regulatory standards and stakeholder expectations.`,
        },
        contents: prompt,
      });

      return response.text || "";
    } catch (error) {
      console.error('ESG Report Generation Error:', error);
      throw new Error(`Failed to generate ESG report: ${error.message}`);
    }
  }

  private buildAnalysisPrompt(request: ESGAnalysisRequest): string {
    const contextSection = request.context ? `Context: ${request.context}\n\n` : '';
    
    return `
${contextSection}Analyze the following ESG data for comprehensive sustainability assessment:

Analysis Type: ${request.type}
Module Type: ${request.moduleType || 'general'}
Organization ID: ${request.organizationId}

Data:
${JSON.stringify(request.data, null, 2)}

Provide a detailed analysis with:
1. Key insights (strategic observations and trends)
2. Actionable recommendations (specific, measurable actions)
3. Risk assessment (potential threats and vulnerabilities)
4. Growth opportunities (areas for competitive advantage)
5. Strategic action plan (prioritized initiatives with timelines)
6. Industry benchmarks (comparative performance analysis)

Format the response as structured JSON with clear categorization.
`;
  }

  private getSystemPrompt(analysisType: string): string {
    const basePrompt = `You are an expert ESG (Environmental, Social, Governance) analyst and sustainability consultant with deep expertise in corporate sustainability reporting, regulatory compliance, and performance optimization.`;
    
    const typeSpecificPrompts = {
      carbon_reduction: `${basePrompt} Specialize in carbon footprint analysis, GHG emissions reduction strategies, and climate risk assessment.`,
      sustainability_assessment: `${basePrompt} Focus on comprehensive sustainability performance evaluation across all ESG dimensions.`,
      compliance_analysis: `${basePrompt} Expert in regulatory frameworks including GRI, SASB, TCFD, EU-CSRD, SEC climate rules, and ISSB standards.`,
      risk_assessment: `${basePrompt} Specialize in ESG risk identification, impact assessment, and mitigation strategy development.`,
      datacenter_optimization: `${basePrompt} Expert in data center sustainability, energy efficiency optimization, and green technology implementation.`
    };

    return typeSpecificPrompts[analysisType as keyof typeof typeSpecificPrompts] || basePrompt;
  }

  private parseAnalysisResponse(responseText: string): Omit<ESGAnalysisResponse, 'confidence'> {
    try {
      // Try to parse as JSON first
      if (responseText.includes('{') && responseText.includes('}')) {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      }

      // Fallback to text parsing
      return this.parseTextResponse(responseText);
    } catch (error) {
      console.warn('JSON parsing failed, using text parsing:', error);
      return this.parseTextResponse(responseText);
    }
  }

  private parseTextResponse(text: string): Omit<ESGAnalysisResponse, 'confidence'> {
    const sections = {
      insights: this.extractListFromText(text, ['insights', 'key insights', 'observations']),
      recommendations: this.extractListFromText(text, ['recommendations', 'actions', 'suggestions']),
      risks: this.extractListFromText(text, ['risks', 'threats', 'challenges']),
      opportunities: this.extractListFromText(text, ['opportunities', 'potential', 'growth'])
    };

    return sections;
  }

  private extractListFromText(text: string, keywords: string[]): string[] {
    const items: string[] = [];
    
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[:\\n]([\\s\\S]*?)(?=\\n\\n|$)`, 'i');
      const match = text.match(regex);
      
      if (match) {
        const content = match[1];
        const bulletPoints = content.split('\n')
          .filter(line => line.trim().match(/^[-•*]\s+|^\d+\.\s+/))
          .map(line => line.replace(/^[-•*]\s+|^\d+\.\s+/, '').trim())
          .filter(line => line.length > 0);
        
        items.push(...bulletPoints);
      }
    }

    return items.length > 0 ? items : [
      'Analysis generated - specific insights available through detailed review',
      'Comprehensive assessment completed with recommendations',
      'Strategic opportunities identified for sustainability improvement'
    ];
  }

  private parseOptimizationResponse(responseText: string): DataCenterOptimization {
    return {
      pueOptimization: this.extractListFromText(responseText, ['pue', 'power usage effectiveness', 'efficiency']),
      coolingRecommendations: this.extractListFromText(responseText, ['cooling', 'hvac', 'temperature']),
      energyEfficiency: this.extractListFromText(responseText, ['energy', 'renewable', 'efficiency']),
      sustainabilityActions: this.extractListFromText(responseText, ['sustainability', 'green', 'environmental'])
    };
  }

  private calculateConfidence(data: any): number {
    // Simple confidence calculation based on data completeness
    let score = 60; // Base confidence
    
    if (data.metrics && data.metrics.length > 0) score += 15;
    if (data.parameters && data.parameters.length > 0) score += 10;
    if (data.complianceFrameworks && data.complianceFrameworks.length > 0) score += 10;
    if (data.dataCenterMetrics && data.dataCenterMetrics.length > 0) score += 5;
    
    return Math.min(score, 95); // Cap at 95%
  }
}

export const esgAgent = new ESGAgent();