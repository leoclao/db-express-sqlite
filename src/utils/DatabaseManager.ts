import { AppDataSource } from '../config/database';
import { config } from '../config';
import { logger } from './logger';
import fs from 'fs';
import path from 'path';
import cron, { ScheduledTask } from 'node-cron';

export class DatabaseManager {
  private static backupJob: ScheduledTask | null = null;
  
  static async initialize() {
    try {
      if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        logger.info('Database connected successfully');
        
        // Tối ưu SQLite performance
        await this.optimizeDatabase();
      }
    } catch (error) {
      logger.error('Database connection failed:', error);
      throw error;
    }
  }

  static async close() {
    try {
      // Stop backup job nếu có
      if (this.backupJob) {
        this.backupJob.stop();
        this.backupJob = null;
      }
      
      if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
        logger.info('Database connection closed');
      }
    } catch (error) {
      logger.error('Error closing database:', error);
      throw error;
    }
  }

  static async runMigrations() {
    try {
      if (config.nodeEnv === 'production') {
        await AppDataSource.runMigrations();
        logger.info('Migrations executed successfully');
      }
    } catch (error) {
      logger.error('Migration failed:', error);
      throw error;
    }
  }

  static async backup(backupPath?: string) {
    const dbPath = AppDataSource.options.database as string;
    const backupDir = backupPath || config.database.backup.path;
    
    try {
      // Tạo backup directory nếu chưa tồn tại
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFile = path.join(backupDir, `backup-${timestamp}.sqlite`);
      
      // Copy database file
      fs.copyFileSync(dbPath, backupFile);
      
      // Cleanup old backups (giữ lại 10 backup gần nhất)
      await this.cleanupOldBackups(backupDir);
      
      logger.info(`Database backup created: ${backupFile}`);
      return backupFile;
    } catch (error) {
      logger.error('Backup failed:', error);
      throw error;
    }
  }

  static async scheduleBackup() {
    if (!config.database.backup.enabled) return;
    
    try {
      // Parse interval (24h, 12h, etc.)
      const interval = this.parseInterval(config.database.backup.interval);
      
      // Schedule backup job
      this.backupJob = cron.schedule(interval, async () => {
        try {
          await this.backup();
          logger.info('Scheduled backup completed');
        } catch (error) {
          logger.error('Scheduled backup failed:', error);
        }
      });
      
      logger.info(`Backup scheduled: ${config.database.backup.interval}`);
    } catch (error) {
      logger.error('Failed to schedule backup:', error);
    }
  }

  static async vacuum() {
    try {
      await AppDataSource.query('VACUUM');
      logger.info('Database vacuum completed');
    } catch (error) {
      logger.error('Vacuum failed:', error);
      throw error;
    }
  }

  static async needsVacuum(): Promise<boolean> {
    try {
      // Check database size và fragmentation
      const result = await AppDataSource.query('PRAGMA freelist_count');
      const freelistCount = result[0]?.freelist_count || 0;
      
      // Vacuum nếu có nhiều free pages
      return freelistCount > 1000;
    } catch (error) {
      logger.error('Error checking vacuum need:', error);
      return false;
    }
  }

  private static async optimizeDatabase() {
    try {
      // SQLite optimization queries
      const optimizations = [
        'PRAGMA journal_mode = WAL',
        'PRAGMA synchronous = NORMAL',
        'PRAGMA cache_size = -64000',
        'PRAGMA temp_store = MEMORY',
        'PRAGMA mmap_size = 268435456',
      ];
      
      for (const query of optimizations) {
        await AppDataSource.query(query);
      }
      
      logger.info('Database optimizations applied');
    } catch (error) {
      logger.error('Database optimization failed:', error);
    }
  }

  private static parseInterval(interval: string): string {
    // Convert interval to cron format
    const match = interval.match(/^(\d+)([hmd])$/);
    if (!match) return '0 2 * * *'; // Default: daily at 2 AM
    
    const [, value, unit] = match;
    const num = parseInt(value);
    
    switch (unit) {
      case 'h': // hours
        return `0 */${num} * * *`;
      case 'd': // days
        return `0 2 */${num} * *`;
      case 'm': // minutes
        return `*/${num} * * * *`;
      default:
        return '0 2 * * *';
    }
  }

  private static async cleanupOldBackups(backupDir: string) {
    try {
      const files = fs.readdirSync(backupDir)
        .filter(file => file.startsWith('backup-') && file.endsWith('.sqlite'))
        .map(file => ({
          name: file,
          path: path.join(backupDir, file),
          stat: fs.statSync(path.join(backupDir, file))
        }))
        .sort((a, b) => b.stat.mtime.getTime() - a.stat.mtime.getTime());
      
      // Giữ lại 10 backup gần nhất
      const filesToDelete = files.slice(10);
      
      for (const file of filesToDelete) {
        fs.unlinkSync(file.path);
        logger.info(`Deleted old backup: ${file.name}`);
      }
    } catch (error) {
      logger.error('Error cleaning up old backups:', error);
    }
  }
}
