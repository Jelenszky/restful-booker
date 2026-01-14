import { test, expect } from '../common/fixtures';
import { HttpStatus } from '../common/constants';

test('should return 201 status when API is healthy', async ({ serviceFactory }) => {
  const healthService = serviceFactory.createHealthService();
  const response = await healthService.ping();

  expect(response.status()).toBe(HttpStatus.CREATED);
});
