// Centralized error logging utility
const ErrorLogger = {
  log: (error, context = '') => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ${context}:`, error);
    
    // In production, you could send to a service like Sentry
    // For now, just console logging
  },

  logAPIError: (error, endpoint) => {
    ErrorLogger.log(error, `API Error - ${endpoint}`);
  },

  logStorageError: (error, operation) => {
    ErrorLogger.log(error, `Storage Error - ${operation}`);
  },

  getUserFriendlyMessage: (error) => {
    if (!error) return 'An unexpected error occurred';
    
    if (error.message?.includes('network')) {
      return 'Network connection issue. Please check your internet.';
    }
    
    if (error.message?.includes('API')) {
      return 'Unable to connect to support service. Try again later.';
    }
    
    if (error.message?.includes('storage')) {
      return 'Unable to save data. Please try again.';
    }
    
    return 'Something went wrong. Please try again.';
  }
};

export default ErrorLogger;
