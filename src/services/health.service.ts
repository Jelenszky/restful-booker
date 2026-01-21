import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants/error-messages';

export class HealthService extends BaseService {
  async ping(): Promise<APIResponse> {
    const response = await this.requestContext.get(`${this.baseURL}/ping`);

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.HEALTH.FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response;
  }
}
