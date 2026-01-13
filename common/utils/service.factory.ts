import { APIRequestContext } from '@playwright/test';
import { AuthService } from '../../src/services/auth.service';
import { HealthService } from '../../src/services/health.service';
import { GetBookingIdsService } from '../../src/services/getbookingids.service';

export class ServiceFactory {
  constructor(
    private baseURL: string,
    private requestContext: APIRequestContext
  ) {}

  createAuthService(): AuthService {
    return new AuthService(this.baseURL, this.requestContext);
  }

  createHealthService(): HealthService {
    return new HealthService(this.baseURL, this.requestContext);
  }

  createGetBookingIdsService(): GetBookingIdsService {
    return new GetBookingIdsService(this.baseURL, this.requestContext);
  }
}