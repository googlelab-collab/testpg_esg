import { Router } from 'express';
import { upload, processExcelFile, processCSVFile, generateESGMetricsTemplate, generateESGParametersTemplate } from '../integrations/dataIngestion';
import { integrations } from '../integrations/thirdPartyAPIs';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// File upload endpoint
router.post('/upload', isAuthenticated, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { organizationId, uploadType } = req.body;
    const filePath = req.file.path;
    const fileExtension = req.file.originalname.split('.').pop()?.toLowerCase();

    let results;
    
    if (fileExtension === 'csv') {
      results = await processCSVFile(filePath, parseInt(organizationId), uploadType);
    } else if (fileExtension === 'xlsx' || fileExtension === 'xls') {
      results = await processExcelFile(filePath, parseInt(organizationId), uploadType);
    } else {
      return res.status(400).json({ error: 'Unsupported file format' });
    }

    res.json(results);
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Template download endpoints
router.get('/template/metrics', (req, res) => {
  try {
    const template = generateESGMetricsTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ESG_Metrics_Template.xlsx');
    res.send(template);
  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({ error: 'Failed to generate template' });
  }
});

router.get('/template/parameters', (req, res) => {
  try {
    const template = generateESGParametersTemplate();
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=ESG_Parameters_Template.xlsx');
    res.send(template);
  } catch (error) {
    console.error('Template generation error:', error);
    res.status(500).json({ error: 'Failed to generate template' });
  }
});

// Integration sync endpoint
router.post('/sync/:organizationId', isAuthenticated, async (req, res) => {
  try {
    const { organizationId } = req.params;
    const { integrations: integrationConfigs } = req.body;

    const results = await integrations.syncAllIntegrations(parseInt(organizationId), integrationConfigs);
    res.json({ success: true, results });
  } catch (error) {
    console.error('Integration sync error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Data validation endpoint
router.post('/validate', isAuthenticated, async (req, res) => {
  try {
    const { data, type } = req.body;
    
    // Validate data structure and content
    const validationResults = {
      isValid: true,
      errors: [],
      warnings: []
    };

    // Add validation logic based on type
    if (type === 'metrics') {
      data.forEach((row: any, index: number) => {
        if (!row.metricType) {
          validationResults.errors.push(`Row ${index + 1}: Missing metric type`);
          validationResults.isValid = false;
        }
        if (!row.value || isNaN(parseFloat(row.value))) {
          validationResults.errors.push(`Row ${index + 1}: Invalid or missing value`);
          validationResults.isValid = false;
        }
      });
    }

    res.json(validationResults);
  } catch (error) {
    console.error('Data validation error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;