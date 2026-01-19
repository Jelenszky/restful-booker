import { APIRequestContext } from '@playwright/test';
import { AuthService } from '../../src/services/auth.service';
import { HealthService } from '../../src/services/health.service';
import { GetBookingIdsService } from '../../src/services/getbookingids.service';
import { CreateBookingService } from '../../src/services/createbooking.service';
import { UpdateBookingService } from '../../src/services/updatebooking.service';
import { PartialUpdateBookingService } from '../../src/services/partialupdatebooking.service';
import { DeleteBookingService } from '../../src/services/deletebooking.service';

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

  createCreateBookingService(): CreateBookingService {
    return new CreateBookingService(this.baseURL, this.requestContext);
  }

  createUpdateBookingService(): UpdateBookingService {
    return new UpdateBookingService(this.baseURL, this.requestContext);
  }

  createPartialUpdateBookingService(): PartialUpdateBookingService {
    return new PartialUpdateBookingService(this.baseURL, this.requestContext);
  }

  createDeleteBookingService(): DeleteBookingService {
    return new DeleteBookingService(this.baseURL, this.requestContext);
  }
}
