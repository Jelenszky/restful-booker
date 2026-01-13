import { APIRequestContext, APIResponse } from '@playwright/test';

export class HealthService {
  constructor(
    private baseURL: string,
    private requestContext: APIRequestContext
  ) {}

  async ping(): Promise<APIResponse> {
    const response = await this.requestContext.get(`${this.baseURL}/ping`);

    if (!response.ok()) {
      throw new Error(
        `Health check failed with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response;
  }
}