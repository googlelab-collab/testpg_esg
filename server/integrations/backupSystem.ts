import { storage } from '../storage';
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

export class BackupSystem {
  private backupDir = path.join(process.cwd(), 'backups');
  
  constructor() {
    this.ensureBackupDirectory();
  }

  private async ensureBackupDirectory() {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
    }
  }

  async createFullBackup(organizationId?: number): Promise<string> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = `backup_${timestamp}`;
    const backupPath = path.join(this.backupDir, backupName);
    
    await fs.mkdir(backupPath, { recursive: true });
    
    try {
      // Database backup
      if (process.env.DATABASE_URL) {
        await this.createDatabaseBackup(path.join(backupPath, 'database.sql'));
      }
      
      // Application data backup
      const appData = await this.collectApplicationData(organizationId);
      await fs.writeFile(
        path.join(backupPath, 'app_data.json'),
        JSON.stringify(appData, null, 2)
      );
      
      // Configuration backup
      const configData = await this.collectConfigurationData();
      await fs.writeFile(
        path.join(backupPath, 'config.json'),
        JSON.stringify(configData, null, 2)
      );
      
      // Create manifest
      const manifest = {
        backupName,
        timestamp: new Date().toISOString(),
        organizationId,
        type: organizationId ? 'organization' : 'full',
        files: ['database.sql', 'app_data.json', 'config.json']
      };
      
      await fs.writeFile(
        path.join(backupPath, 'manifest.json'),
        JSON.stringify(manifest, null, 2)
      );
      
      console.log(`Backup created successfully: ${backupName}`);
      return backupName;
      
    } catch (error) {
      console.error('Backup creation failed:', error);
      // Clean up partial backup
      await fs.rmdir(backupPath, { recursive: true }).catch(() => {});
      throw error;
    }
  }

  private async createDatabaseBackup(outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const dbUrl = new URL(process.env.DATABASE_URL!);
      
      const pgDump = spawn('pg_dump', [
        '--host', dbUrl.hostname,
        '--port', dbUrl.port || '5432',
        '--username', dbUrl.username,
        '--dbname', dbUrl.pathname.slice(1),
        '--no-password',
        '--format', 'custom',
        '--file', outputPath
      ], {
        env: {
          ...process.env,
          PGPASSWORD: dbUrl.password
        }
      });
      
      pgDump.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`pg_dump exited with code ${code}`));
        }
      });
      
      pgDump.on('error', reject);
    });
  }

  private async collectApplicationData(organizationId?: number) {
    const data: any = {};
    
    if (organizationId) {
      // Organization-specific backup
      data.organization = await storage.getOrganization(organizationId);
      data.esgParameters = await storage.getESGParameters(organizationId);
      data.esgMetrics = await storage.getESGMetrics(organizationId);
      data.socialMetrics = await storage.getSocialMetrics(organizationId);
      data.complianceFrameworks = await storage.getComplianceFrameworks(organizationId);
      data.esgScores = await storage.getESGScoreHistory(organizationId, 100);
    } else {
      // Full system backup
      data.users = await storage.getAllUsers();
      data.esgParameters = [];
      data.esgMetrics = [];
      data.socialMetrics = [];
      data.complianceFrameworks = [];
      data.esgScores = [];
      
      // Note: In a real implementation, you'd iterate through all organizations
      // For now, we'll backup the main organization data
      const mainOrg = await storage.getOrganization(1);
      if (mainOrg) {
        data.esgParameters = await storage.getESGParameters(1);
        data.esgMetrics = await storage.getESGMetrics(1);
        data.socialMetrics = await storage.getSocialMetrics(1);
        data.complianceFrameworks = await storage.getComplianceFrameworks(1);
        data.esgScores = await storage.getESGScoreHistory(1, 100);
      }
    }
    
    return data;
  }

  private async collectConfigurationData() {
    return {
      environment: process.env.NODE_ENV,
      version: process.env.npm_package_version || '1.0.0',
      databaseConnected: !!process.env.DATABASE_URL,
      timestamp: new Date().toISOString()
    };
  }

  async listBackups(): Promise<any[]> {
    try {
      const files = await fs.readdir(this.backupDir);
      const backups = [];
      
      for (const file of files) {
        const backupPath = path.join(this.backupDir, file);
        const stat = await fs.stat(backupPath);
        
        if (stat.isDirectory()) {
          try {
            const manifestPath = path.join(backupPath, 'manifest.json');
            const manifestContent = await fs.readFile(manifestPath, 'utf-8');
            const manifest = JSON.parse(manifestContent);
            
            backups.push({
              ...manifest,
              size: await this.getDirectorySize(backupPath),
              path: backupPath
            });
          } catch {
            // Skip directories without valid manifest
          }
        }
      }
      
      return backups.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch {
      return [];
    }
  }

  async restoreBackup(backupName: string, organizationId?: number): Promise<void> {
    const backupPath = path.join(this.backupDir, backupName);
    
    try {
      // Verify backup exists and is valid
      const manifestPath = path.join(backupPath, 'manifest.json');
      const manifestContent = await fs.readFile(manifestPath, 'utf-8');
      const manifest = JSON.parse(manifestContent);
      
      console.log(`Starting restore from backup: ${backupName}`);
      
      // Restore application data
      const appDataPath = path.join(backupPath, 'app_data.json');
      const appDataContent = await fs.readFile(appDataPath, 'utf-8');
      const appData = JSON.parse(appDataContent);
      
      await this.restoreApplicationData(appData, organizationId);
      
      console.log(`Restore completed successfully from backup: ${backupName}`);
      
    } catch (error) {
      console.error('Restore failed:', error);
      throw error;
    }
  }

  private async restoreApplicationData(data: any, organizationId?: number) {
    // Note: This is a simplified restore process
    // In production, you'd want more sophisticated conflict resolution
    
    if (data.esgParameters && Array.isArray(data.esgParameters)) {
      for (const param of data.esgParameters) {
        try {
          await storage.createESGParameter(param);
        } catch (error) {
          console.warn('Failed to restore parameter:', param.parameterName, error.message);
        }
      }
    }
    
    if (data.esgMetrics && Array.isArray(data.esgMetrics)) {
      for (const metric of data.esgMetrics) {
        try {
          await storage.createESGMetric(metric);
        } catch (error) {
          console.warn('Failed to restore metric:', metric.metricName, error.message);
        }
      }
    }
    
    if (data.socialMetrics && Array.isArray(data.socialMetrics)) {
      for (const metric of data.socialMetrics) {
        try {
          await storage.createSocialMetric(metric);
        } catch (error) {
          console.warn('Failed to restore social metric:', metric.metricName, error.message);
        }
      }
    }
  }

  async deleteBackup(backupName: string): Promise<void> {
    const backupPath = path.join(this.backupDir, backupName);
    await fs.rmdir(backupPath, { recursive: true });
    console.log(`Backup deleted: ${backupName}`);
  }

  private async getDirectorySize(dirPath: string): Promise<number> {
    let size = 0;
    const files = await fs.readdir(dirPath);
    
    for (const file of files) {
      const filePath = path.join(dirPath, file);
      const stat = await fs.stat(filePath);
      
      if (stat.isDirectory()) {
        size += await this.getDirectorySize(filePath);
      } else {
        size += stat.size;
      }
    }
    
    return size;
  }

  // Automated backup scheduling
  async scheduleBackups() {
    const cron = await import('node-cron');
    
    // Daily backup at 3 AM
    cron.schedule('0 3 * * *', async () => {
      try {
        console.log('Starting scheduled backup...');
        await this.createFullBackup();
        await this.cleanupOldBackups();
        console.log('Scheduled backup completed');
      } catch (error) {
        console.error('Scheduled backup failed:', error);
      }
    });
    
    console.log('Backup scheduler started');
  }

  private async cleanupOldBackups(retentionDays: number = 30) {
    const backups = await this.listBackups();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);
    
    for (const backup of backups) {
      const backupDate = new Date(backup.timestamp);
      if (backupDate < cutoffDate) {
        try {
          await this.deleteBackup(backup.backupName);
          console.log(`Cleaned up old backup: ${backup.backupName}`);
        } catch (error) {
          console.warn(`Failed to cleanup backup ${backup.backupName}:`, error.message);
        }
      }
    }
  }
}

export const backupSystem = new BackupSystem();