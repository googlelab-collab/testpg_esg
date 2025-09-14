import { Router } from 'express';
import { backupSystem } from '../integrations/backupSystem';
import { isAuthenticated } from '../replitAuth';

const router = Router();

// Create backup
router.post('/create', isAuthenticated, async (req, res) => {
  try {
    const { organizationId } = req.body;
    const backupName = await backupSystem.createFullBackup(organizationId);
    
    res.json({ 
      success: true, 
      backupName,
      message: 'Backup created successfully' 
    });
  } catch (error) {
    console.error('Backup creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List backups
router.get('/list', isAuthenticated, async (req, res) => {
  try {
    const backups = await backupSystem.listBackups();
    res.json({ success: true, backups });
  } catch (error) {
    console.error('Backup listing error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Restore backup
router.post('/restore/:backupName', isAuthenticated, async (req, res) => {
  try {
    const { backupName } = req.params;
    const { organizationId } = req.body;
    
    await backupSystem.restoreBackup(backupName, organizationId);
    
    res.json({ 
      success: true, 
      message: 'Backup restored successfully' 
    });
  } catch (error) {
    console.error('Backup restore error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Delete backup
router.delete('/:backupName', isAuthenticated, async (req, res) => {
  try {
    const { backupName } = req.params;
    await backupSystem.deleteBackup(backupName);
    
    res.json({ 
      success: true, 
      message: 'Backup deleted successfully' 
    });
  } catch (error) {
    console.error('Backup deletion error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;