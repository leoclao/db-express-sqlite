export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug'
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  stack?: string;
}

export class Logger {
  private static instance: Logger;
  private logLevel: LogLevel;

  private constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.ERROR, LogLevel.WARN, LogLevel.INFO, LogLevel.DEBUG];
    return levels.indexOf(level) <= levels.indexOf(this.logLevel);
  }

  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context, stack } = entry;
    let log = `[${timestamp}] ${level.toUpperCase()}: ${message}`;
    
    if (context && Object.keys(context).length > 0) {
      log += `\nContext: ${JSON.stringify(context, null, 2)}`;
    }
    
    if (stack) {
      log += `\nStack: ${stack}`;
    }
    
    return log;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, stack?: string) {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      stack
    };

    const formattedLog = this.formatLog(entry);
    
    switch (level) {
      case LogLevel.ERROR:
        console.error(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.INFO:
        console.log(formattedLog);
        break;
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
    }
  }

  public error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error?.stack);
  }

  public warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  public info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  public debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context);
  }
}

export const logger = Logger.getInstance();