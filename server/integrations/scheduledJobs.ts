import cron from 'node-cron';
import { backupSystem } from './backupSystem';
import { integrations } from './thirdPartyAPIs';
import { storage } from '../storage';
import { calculateESGScore } from '../utils/esgCalculations';

class ScheduledJobsManager {
  private jobs: Map<string, cron.ScheduledTask> = new Map();

  startAllJobs() {
    this.scheduleBackupJobs();
    this.scheduleDataSyncJobs();
    this.scheduleESGCalculations();
    this.scheduleComplianceChecks();
    
    console.log('All scheduled jobs started successfully');
  }

  private scheduleBackupJobs() {
    // Daily backup at 3 AM
    const dailyBackup = cron.schedule('0 3 * * *', async () => {
      try {
        console.log('Starting scheduled daily backup...');
        await backupSystem.createFullBackup();
        console.log('Daily backup completed successfully');
      } catch (error) {
        console.error('Daily backup failed:', error);
      }
    }, { scheduled: false });

    // Weekly full system backup on Sundays at 2 AM
    const weeklyBackup = cron.schedule('0 2 * * 0', async () => {
      try {
        console.log('Starting scheduled weekly full backup...');
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          await backupSystem.createFullBackup(org.id);
        }
        
        console.log('Weekly full backup completed successfully');
      } catch (error) {
        console.error('Weekly backup failed:', error);
      }
    }, { scheduled: false });

    this.jobs.set('dailyBackup', dailyBackup);
    this.jobs.set('weeklyBackup', weeklyBackup);
    
    dailyBackup.start();
    weeklyBackup.start();
    
    console.log('Backup jobs scheduled');
  }

  private scheduleDataSyncJobs() {
    // Hourly integration sync
    const hourlySync = cron.schedule('0 * * * *', async () => {
      try {
        console.log('Starting scheduled data sync...');
        
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          // Sync with configured integrations
          const results = await integrations.syncAllIntegrations(org.id, [
            { type: 'epa', enabled: true },
            { type: 'government_data', enabled: true }
          ]);
          
          console.log(`Data sync completed for organization ${org.id}:`, results);
        }
        
      } catch (error) {
        console.error('Data sync failed:', error);
      }
    }, { scheduled: false });

    // Daily EPA data sync at 6 AM
    const epaSync = cron.schedule('0 6 * * *', async () => {
      try {
        console.log('Starting EPA data sync...');
        
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          await integrations.syncEPAData(org.id);
        }
        
        console.log('EPA data sync completed');
      } catch (error) {
        console.error('EPA data sync failed:', error);
      }
    }, { scheduled: false });

    this.jobs.set('hourlySync', hourlySync);
    this.jobs.set('epaSync', epaSync);
    
    hourlySync.start();
    epaSync.start();
    
    console.log('Data sync jobs scheduled');
  }

  private scheduleESGCalculations() {
    // Daily ESG score calculation at 8 AM
    const dailyESGCalc = cron.schedule('0 8 * * *', async () => {
      try {
        console.log('Starting scheduled ESG score calculations...');
        
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          const parameters = await storage.getESGParameters(org.id);
          
          if (parameters.length > 0) {
            const scores = await calculateESGScore(parameters);
            
            await storage.createESGScore({
              organizationId: org.id,
              overallScore: scores.overallScore.toString(),
              environmentalScore: scores.environmentalScore.toString(),
              socialScore: scores.socialScore.toString(),
              governanceScore: scores.governanceScore.toString(),
              calculatedAt: new Date(),
              methodology: 'Automated Daily Calculation'
            });
            
            console.log(`ESG scores calculated for organization ${org.id}:`, scores);
          }
        }
        
        console.log('Daily ESG calculations completed');
      } catch (error) {
        console.error('ESG calculation failed:', error);
      }
    }, { scheduled: false });

    // Weekly comprehensive ESG analysis on Mondays at 9 AM
    const weeklyAnalysis = cron.schedule('0 9 * * 1', async () => {
      try {
        console.log('Starting weekly ESG analysis...');
        
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          // Get historical data for trend analysis
          const scoreHistory = await storage.getESGScoreHistory(org.id, 12);
          const currentMetrics = await storage.getESGMetrics(org.id);
          
          // Perform trend analysis and generate insights
          // This could include performance alerts, target tracking, etc.
          
          console.log(`Weekly analysis completed for organization ${org.id}`);
        }
        
      } catch (error) {
        console.error('Weekly ESG analysis failed:', error);
      }
    }, { scheduled: false });

    this.jobs.set('dailyESGCalc', dailyESGCalc);
    this.jobs.set('weeklyAnalysis', weeklyAnalysis);
    
    dailyESGCalc.start();
    weeklyAnalysis.start();
    
    console.log('ESG calculation jobs scheduled');
  }

  private scheduleComplianceChecks() {
    // Daily compliance monitoring at 10 AM
    const complianceCheck = cron.schedule('0 10 * * *', async () => {
      try {
        console.log('Starting compliance monitoring...');
        
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          const frameworks = await storage.getComplianceFrameworks(org.id);
          
          for (const framework of frameworks) {
            // Check upcoming deadlines
            if (framework.deadline) {
              const daysUntilDeadline = Math.ceil(
                (framework.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
              );
              
              if (daysUntilDeadline <= 30 && daysUntilDeadline > 0) {
                console.log(`Compliance reminder: ${framework.frameworkName} deadline in ${daysUntilDeadline} days for organization ${org.id}`);
                
                // In a real implementation, you'd send notifications here
                // await sendNotification(org.id, 'compliance_reminder', { framework: framework.frameworkName, days: daysUntilDeadline });
              }
            }
          }
        }
        
        console.log('Compliance monitoring completed');
      } catch (error) {
        console.error('Compliance monitoring failed:', error);
      }
    }, { scheduled: false });

    // Monthly compliance status update on 1st at 11 AM
    const monthlyUpdate = cron.schedule('0 11 1 * *', async () => {
      try {
        console.log('Starting monthly compliance status update...');
        
        const organizations = await storage.getAllOrganizations();
        
        for (const org of organizations) {
          const frameworks = await storage.getComplianceFrameworks(org.id);
          
          // Generate compliance status reports
          const complianceReport = {
            organizationId: org.id,
            month: new Date().getMonth() + 1,
            year: new Date().getFullYear(),
            frameworks: frameworks.map(f => ({
              name: f.frameworkName,
              status: f.status,
              lastAssessment: f.lastAssessment,
              nextDeadline: f.deadline
            }))
          };
          
          console.log(`Monthly compliance report generated for organization ${org.id}:`, complianceReport);
        }
        
      } catch (error) {
        console.error('Monthly compliance update failed:', error);
      }
    }, { scheduled: false });

    this.jobs.set('complianceCheck', complianceCheck);
    this.jobs.set('monthlyUpdate', monthlyUpdate);
    
    complianceCheck.start();
    monthlyUpdate.start();
    
    console.log('Compliance monitoring jobs scheduled');
  }

  stopAllJobs() {
    this.jobs.forEach((job, name) => {
      job.stop();
      console.log(`Stopped job: ${name}`);
    });
    
    this.jobs.clear();
    console.log('All scheduled jobs stopped');
  }

  getJobStatus() {
    const status: { [key: string]: boolean } = {};
    
    this.jobs.forEach((job, name) => {
      status[name] = job.running;
    });
    
    return status;
  }

  restartJob(jobName: string) {
    const job = this.jobs.get(jobName);
    if (job) {
      job.stop();
      job.start();
      console.log(`Restarted job: ${jobName}`);
      return true;
    }
    return false;
  }
}

export const scheduledJobs = new ScheduledJobsManager();