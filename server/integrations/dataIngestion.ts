import multer from 'multer';
import * as XLSX from 'xlsx';
import csvParser from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { storage } from '../storage';
import type { Request } from 'express';

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
      'application/json'
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only Excel, CSV, and JSON files allowed.'));
    }
  }
});

export { upload };

// Data processing interfaces
export interface ESGDataRow {
  category: string;
  metricType: string;
  metricName: string;
  value: string;
  unit: string;
  scope?: string;
  source: string;
  reportingPeriod: string;
  verificationStatus?: string;
}

export interface ParameterDataRow {
  category: string;
  parameterName: string;
  currentValue: string;
  targetValue?: string;
  unit: string;
  impactWeight?: string;
}

// Excel/CSV processing functions
export async function processExcelFile(filePath: string, organizationId: number, dataType: 'metrics' | 'parameters'): Promise<{ success: number; errors: string[] }> {
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  const results = { success: 0, errors: [] as string[] };
  
  for (const [index, row] of data.entries()) {
    try {
      if (dataType === 'metrics') {
        await processMetricRow(row as ESGDataRow, organizationId);
      } else {
        await processParameterRow(row as ParameterDataRow, organizationId);
      }
      results.success++;
    } catch (error) {
      results.errors.push(`Row ${index + 2}: ${error.message}`);
    }
  }
  
  // Clean up uploaded file
  fs.unlinkSync(filePath);
  
  return results;
}

export async function processCSVFile(filePath: string, organizationId: number, dataType: 'metrics' | 'parameters'): Promise<{ success: number; errors: string[] }> {
  return new Promise((resolve) => {
    const results = { success: 0, errors: [] as string[] };
    const rows: any[] = [];
    
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row) => rows.push(row))
      .on('end', async () => {
        for (const [index, row] of rows.entries()) {
          try {
            if (dataType === 'metrics') {
              await processMetricRow(row as ESGDataRow, organizationId);
            } else {
              await processParameterRow(row as ParameterDataRow, organizationId);
            }
            results.success++;
          } catch (error) {
            results.errors.push(`Row ${index + 2}: ${error.message}`);
          }
        }
        
        // Clean up uploaded file
        fs.unlinkSync(filePath);
        resolve(results);
      });
  });
}

async function processMetricRow(row: ESGDataRow, organizationId: number) {
  // Validate required fields
  if (!row.metricType || !row.metricName || !row.value || !row.unit) {
    throw new Error('Missing required fields: metricType, metricName, value, unit');
  }
  
  // Determine metric type and create appropriate record
  if (row.category === 'social') {
    await storage.createSocialMetric({
      organizationId,
      metricType: row.metricType,
      metricName: row.metricName,
      value: parseFloat(row.value).toString(),
      unit: row.unit,
      source: row.source || 'File Upload',
      reportingPeriod: row.reportingPeriod || new Date().toISOString().split('T')[0],
      verificationStatus: row.verificationStatus || 'pending'
    });
  } else {
    await storage.createESGMetric({
      organizationId,
      category: row.category as 'environmental' | 'governance',
      metricType: row.metricType,
      metricName: row.metricName,
      value: parseFloat(row.value).toString(),
      unit: row.unit,
      scope: row.scope,
      source: row.source || 'File Upload',
      reportingPeriod: row.reportingPeriod || new Date().toISOString().split('T')[0],
      verificationStatus: row.verificationStatus || 'pending'
    });
  }
}

async function processParameterRow(row: ParameterDataRow, organizationId: number) {
  // Validate required fields
  if (!row.category || !row.parameterName || !row.currentValue || !row.unit) {
    throw new Error('Missing required fields: category, parameterName, currentValue, unit');
  }
  
  await storage.createESGParameter({
    organizationId,
    category: row.category as 'environmental' | 'social' | 'governance',
    parameterName: row.parameterName,
    currentValue: row.currentValue,
    targetValue: row.targetValue,
    unit: row.unit,
    impactWeight: row.impactWeight || '1.0'
  });
}

// Template generation for uploads
export function generateESGMetricsTemplate(): Buffer {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['category', 'metricType', 'metricName', 'value', 'unit', 'scope', 'source', 'reportingPeriod', 'verificationStatus'],
    ['environmental', 'ghg_emissions', 'Total GHG Emissions', '125000', 'tCO2e', 'scope1', 'Direct measurement', '2024-01-01', 'verified'],
    ['environmental', 'energy', 'Renewable Energy Usage', '45.5', 'percent', '', 'Energy audit', '2024-01-01', 'verified'],
    ['social', 'diversity', 'Female Leadership Ratio', '35', 'percent', '', 'HR records', '2024-01-01', 'verified'],
    ['governance', 'board', 'Independent Directors', '60', 'percent', '', 'Board records', '2024-01-01', 'verified']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'ESG_Metrics_Template');
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

export function generateESGParametersTemplate(): Buffer {
  const wb = XLSX.utils.book_new();
  
  const data = [
    ['category', 'parameterName', 'currentValue', 'targetValue', 'unit', 'impactWeight'],
    ['environmental', 'renewable_energy_percentage', '45', '75', 'percent', '1.2'],
    ['environmental', 'ghg_emissions_reduction', '15', '50', 'percent', '1.5'],
    ['social', 'employee_safety_training', '85', '95', 'percent', '1.1'],
    ['governance', 'board_diversity_ratio', '35', '50', 'percent', '1.0']
  ];
  
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, 'ESG_Parameters_Template');
  
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}