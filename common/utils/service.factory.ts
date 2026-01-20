import { APIRequestContext } from '@playwright/test';
import { AuthService } from '../../src/services/auth.service';
import { HealthService } from '../../src/services/health.service';
import { BookingService } from '../../src/services/booking.service';

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

  createBookingService(): BookingService {
    return new BookingService(this.baseURL, this.requestContext);
  }
}
