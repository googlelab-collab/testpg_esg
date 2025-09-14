import axios from 'axios';
import { storage } from '../storage';

// Third-party API integrations for ESG data
export class ThirdPartyIntegrations {
  
  // SAP ERP Integration
  async fetchSAPData(credentials: { baseUrl: string; username: string; password: string }) {
    try {
      const response = await axios.get(`${credentials.baseUrl}/sap/opu/odata/sap/API_ESG_DATA_SRV/ESGMetrics`, {
        auth: {
          username: credentials.username,
          password: credentials.password
        },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      return this.transformSAPData(response.data);
    } catch (error) {
      throw new Error(`SAP integration failed: ${error.message}`);
    }
  }

  // Oracle ERP Integration
  async fetchOracleData(credentials: { baseUrl: string; token: string }) {
    try {
      const response = await axios.get(`${credentials.baseUrl}/fscmRestApi/resources/11.13.18.05/esgMetrics`, {
        headers: {
          'Authorization': `Bearer ${credentials.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      return this.transformOracleData(response.data);
    } catch (error) {
      throw new Error(`Oracle integration failed: ${error.message}`);
    }
  }

  // Microsoft Sustainability Manager Integration
  async fetchMicrosoftSustainabilityData(credentials: { tenantId: string; clientId: string; clientSecret: string }) {
    try {
      // Get access token
      const tokenResponse = await axios.post(`https://login.microsoftonline.com/${credentials.tenantId}/oauth2/v2.0/token`, {
        grant_type: 'client_credentials',
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
        scope: 'https://graph.microsoft.com/.default'
      }, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const accessToken = tokenResponse.data.access_token;

      // Fetch sustainability data
      const response = await axios.get('https://graph.microsoft.com/v1.0/solutions/sustainability/emissions', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return this.transformMicrosoftData(response.data);
    } catch (error) {
      throw new Error(`Microsoft Sustainability integration failed: ${error.message}`);
    }
  }

  // Salesforce Net Zero Cloud Integration
  async fetchSalesforceNetZeroData(credentials: { instanceUrl: string; accessToken: string }) {
    try {
      const response = await axios.get(`${credentials.instanceUrl}/services/data/v57.0/sobjects/EmissionFactor__c`, {
        headers: {
          'Authorization': `Bearer ${credentials.accessToken}`,
          'Content-Type': 'application/json'
        }
      });

      return this.transformSalesforceData(response.data);
    } catch (error) {
      throw new Error(`Salesforce Net Zero integration failed: ${error.message}`);
    }
  }

  // EPA API Integration for emission factors
  async fetchEPAEmissionFactors() {
    try {
      const response = await axios.get('https://api.epa.gov/easigreen/rest-services/air-emissions', {
        headers: {
          'Accept': 'application/json'
        }
      });

      return this.transformEPAData(response.data);
    } catch (error) {
      throw new Error(`EPA API integration failed: ${error.message}`);
    }
  }

  // CDP (Carbon Disclosure Project) Integration
  async fetchCDPBenchmarkData(apiKey: string, organizationType: string) {
    try {
      const response = await axios.get(`https://api.cdp.net/v1/benchmarks/${organizationType}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return this.transformCDPData(response.data);
    } catch (error) {
      throw new Error(`CDP integration failed: ${error.message}`);
    }
  }

  // Data transformation methods
  private transformSAPData(data: any) {
    return {
      source: 'SAP ERP',
      metrics: data.d?.results?.map((item: any) => ({
        category: item.Category,
        metricType: item.MetricType,
        value: item.Value,
        unit: item.Unit,
        period: item.Period
      })) || []
    };
  }

  private transformOracleData(data: any) {
    return {
      source: 'Oracle ERP',
      metrics: data.items?.map((item: any) => ({
        category: item.esgCategory,
        metricType: item.metricCode,
        value: item.metricValue,
        unit: item.unitOfMeasure,
        period: item.reportingPeriod
      })) || []
    };
  }

  private transformMicrosoftData(data: any) {
    return {
      source: 'Microsoft Sustainability',
      metrics: data.value?.map((item: any) => ({
        category: 'environmental',
        metricType: 'ghg_emissions',
        value: item.co2Equivalent,
        unit: 'tCO2e',
        scope: `scope${item.scope}`,
        period: item.activityPeriod
      })) || []
    };
  }

  private transformSalesforceData(data: any) {
    return {
      source: 'Salesforce Net Zero',
      emissionFactors: data.records?.map((item: any) => ({
        source: item.Name,
        factor: item.Factor__c,
        unit: item.Unit__c,
        scope: item.Scope__c,
        region: item.Region__c
      })) || []
    };
  }

  private transformEPAData(data: any) {
    return {
      source: 'EPA',
      emissionFactors: data.map((item: any) => ({
        source: item.fuel_type,
        factor: item.emission_factor,
        unit: item.unit,
        scope: 1,
        region: 'US'
      }))
    };
  }

  private transformCDPData(data: any) {
    return {
      source: 'CDP',
      benchmarks: data.benchmarks?.map((item: any) => ({
        industry: item.industry,
        metric: item.metric,
        median: item.median_value,
        percentile25: item.percentile_25,
        percentile75: item.percentile_75,
        year: item.year
      })) || []
    };
  }

  // Automated data sync
  async syncAllIntegrations(organizationId: number, integrationConfigs: any[]) {
    const results = [];
    
    for (const config of integrationConfigs) {
      try {
        let data;
        
        switch (config.type) {
          case 'sap':
            data = await this.fetchSAPData(config.credentials);
            break;
          case 'oracle':
            data = await this.fetchOracleData(config.credentials);
            break;
          case 'microsoft':
            data = await this.fetchMicrosoftSustainabilityData(config.credentials);
            break;
          case 'salesforce':
            data = await this.fetchSalesforceNetZeroData(config.credentials);
            break;
          case 'epa':
            data = await this.fetchEPAEmissionFactors();
            break;
          case 'cdp':
            data = await this.fetchCDPBenchmarkData(config.credentials.apiKey, config.organizationType);
            break;
        }

        if (data) {
          await this.saveIntegrationData(organizationId, data);
          results.push({ type: config.type, status: 'success', recordsProcessed: data.metrics?.length || 0 });
        }
      } catch (error) {
        results.push({ type: config.type, status: 'error', error: error.message });
      }
    }

    return results;
  }

  private async saveIntegrationData(organizationId: number, data: any) {
    if (data.metrics) {
      for (const metric of data.metrics) {
        await storage.createESGMetric({
          organizationId,
          category: metric.category,
          metricType: metric.metricType,
          metricName: metric.metricType,
          value: metric.value.toString(),
          unit: metric.unit,
          scope: metric.scope,
          source: data.source,
          reportingPeriod: metric.period || new Date().toISOString().split('T')[0],
          verificationStatus: 'automated'
        });
      }
    }

    if (data.emissionFactors) {
      // Save emission factors to database
      // Implementation depends on emission factors table structure
    }

    if (data.benchmarks) {
      // Save industry benchmarks
      // Implementation depends on benchmarks table structure
    }
  }
}

export const integrations = new ThirdPartyIntegrations();