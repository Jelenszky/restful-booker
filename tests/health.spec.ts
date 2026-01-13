import { request, test, expect } from '@playwright/test';
import config from '../playwright.config';
import { HealthService } from '../src/services/health.service';

const baseURL = config.use?.baseURL;

test('should return 201 status when API is healthy', async () => {
  const requestContext = await request.newContext();

  try {
    const healthService = new HealthService(baseURL!, requestContext);
    const response = await healthService.ping();

    expect(response.status()).toBe(201);
  } finally {
    await requestContext.dispose();
  }
});