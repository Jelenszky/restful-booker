import { request, test, expect } from '@playwright/test';
import config from '../playwright.config';
import { ServiceFactory } from '../common/utils/service.factory';
import { HttpStatus } from '../common/constants';

const baseURL = config.use?.baseURL!;

test('should return 201 status when API is healthy', async () => {
  const requestContext = await request.newContext();

  try {
    const factory = new ServiceFactory(baseURL, requestContext);
    const healthService = factory.createHealthService();
    const response = await healthService.ping();

    expect(response.status()).toBe(HttpStatus.CREATED);
  } finally {
    await requestContext.dispose();
  }
});