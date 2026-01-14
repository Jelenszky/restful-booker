export const ErrorMessages = {
  AUTH: {
    FAILED: 'Authentication failed',
    NO_TOKEN: 'No token received in authentication response',
    SETUP_FAILED: 'Authentication setup failed',
  },
  HEALTH: {
    FAILED: 'Health check failed',
  },
  BOOKING: {
    GET_IDS_FAILED: 'Failed to get booking IDs',
    SCHEMA_INVALID: 'Schema validation error:',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
  },
  GENERIC: {
    UNKNOWN: 'Unknown error occurred',
  },
} as const;
