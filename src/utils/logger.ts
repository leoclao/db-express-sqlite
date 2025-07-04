import fs from 'fs';
import path from 'path';

export class Logger {
  private logDir: string;

  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private writeLog(level: string, message: string, meta?: any) {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      level,
      message,
      ...(meta && { meta }),
    };

    const logString = JSON.stringify(logEntry) + '\n';

    // Write to console
    console.log(logString);

    // Write to file
    const logFile = path.join(this.logDir, `${new Date().toISOString().split('T')[0]}.log`);
    fs.appendFileSync(logFile, logString);
  }

  info(message: string, meta?: any) {
    this.writeLog('INFO', message, meta);
  }

  error(message: string, meta?: any) {
    this.writeLog('ERROR', message, meta);
  }

  warn(message: string, meta?: any) {
    this.writeLog('WARN', message, meta);
  }

  debug(message: string, meta?: any) {
    if (process.env.NODE_ENV === 'development') {
      this.writeLog('DEBUG', message, meta);
    }
  }
}

export const logger = new Logger();