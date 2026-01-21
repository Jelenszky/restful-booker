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
    CREATE_FAILED: 'Failed to create booking',
    UPDATE_FAILED: 'Failed to update booking',
    PARTIAL_UPDATE_FAILED: 'Failed to partial update booking',
    DELETE_FAILED: 'Failed to delete booking',
    SCHEMA_INVALID: 'Schema validation error:',
    INTERNAL_SERVER_ERROR: 'Internal Server Error',
  },
  GENERIC: {
    UNKNOWN: 'Unknown error occurred',
  },
} as const;
