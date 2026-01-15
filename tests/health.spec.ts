import { test, expect } from '../common/fixtures';
import { HttpStatus } from '../common/constants';
import { HealthService } from '../src/services/health.service';

let healthService: HealthService;

test.beforeAll(({ serviceFactory }) => {
  healthService = serviceFactory.createHealthService();
});

test('should return 201 status when API is healthy', async () => {
  const response = await healthService.ping();

  expect(response.status()).toBe(HttpStatus.CREATED);
});
