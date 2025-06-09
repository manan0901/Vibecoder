import { Request, Response, NextFunction } from 'express';

interface LogEntry {
  timestamp: string;
  method: string;
  url: string;
  ip: string;
  userAgent?: string;
  responseTime?: number;
  statusCode?: number;
}

// Request logger middleware
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startTime = Date.now();
  
  // Log request
  const logEntry: LogEntry = {
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    ip: req.ip || req.connection.remoteAddress || 'unknown',
    userAgent: req.get('User-Agent'),
  };

  // Log response when it finishes
  res.on('finish', () => {
    logEntry.responseTime = Date.now() - startTime;
    logEntry.statusCode = res.statusCode;

    // Color code based on status
    let statusColor = '\x1b[32m'; // Green for 2xx
    if (res.statusCode >= 400 && res.statusCode < 500) {
      statusColor = '\x1b[33m'; // Yellow for 4xx
    } else if (res.statusCode >= 500) {
      statusColor = '\x1b[31m'; // Red for 5xx
    }

    // Format log message
    const logMessage = `${logEntry.timestamp} - ${logEntry.method} ${logEntry.url} - ${statusColor}${logEntry.statusCode}\x1b[0m - ${logEntry.responseTime}ms - ${logEntry.ip}`;

    // Only log in development or if LOG_LEVEL is debug
    if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
      console.log(logMessage);
    }

    // In production, you might want to send this to a logging service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to logging service (e.g., Winston, CloudWatch, etc.)
    }
  });

  next();
}

// API response logger for debugging
export function logApiResponse(data: any, message?: string): void {
  if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
    console.log('📤 API Response:', message || 'Response sent');
    console.log(JSON.stringify(data, null, 2));
  }
}

// API request logger for debugging
export function logApiRequest(req: Request, message?: string): void {
  if (process.env.NODE_ENV === 'development' || process.env.LOG_LEVEL === 'debug') {
    console.log('📥 API Request:', message || 'Request received');
    console.log('Method:', req.method);
    console.log('URL:', req.originalUrl);
    console.log('Headers:', req.headers);
    if (req.body && Object.keys(req.body).length > 0) {
      console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    if (req.query && Object.keys(req.query).length > 0) {
      console.log('Query:', req.query);
    }
  }
}
