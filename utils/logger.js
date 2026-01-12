/**
 * Custom Logger Utility
 * Provides consistent logging across the application
 */

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
  };
  
  const getTimestamp = () => {
    return new Date().toISOString();
  };
  
  const log = (level, message, data = null) => {
    const timestamp = getTimestamp();
    const logMessage = `[${timestamp}] [${level}] ${message}`;
  
    console.log(logMessage);
    
    if (data) {
      console.log(JSON.stringify(data, null, 2));
    }
  };
  
  const info = (message, data = null) => {
    console.log(`${colors.blue}ℹ ${message}${colors.reset}`);
    if (data) console.log(data);
  };
  
  const success = (message, data = null) => {
    console.log(`${colors.green}✓ ${message}${colors.reset}`);
    if (data) console.log(data);
  };
  
  const warning = (message, data = null) => {
    console.log(`${colors.yellow}⚠ ${message}${colors.reset}`);
    if (data) console.log(data);
  };
  
  const error = (message, err = null) => {
    console.log(`${colors.red}✗ ${message}${colors.reset}`);
    if (err) {
      console.error(err);
    }
  };
  
  const debug = (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.magenta}[DEBUG] ${message}${colors.reset}`);
      if (data) console.log(data);
    }
  };
  
  export default {
    log,
    info,
    success,
    warning,
    error,
    debug,
  };