import { test, expect } from '../common/fixtures';
import { StatusCodes } from 'http-status-codes';
import { HealthService } from '../src/services/health.service';

let healthService: HealthService;

test.beforeAll(({ serviceFactory }) => {
  healthService = serviceFactory.createHealthService();
});

test('should return 201 status when API is healthy', async () => {
  const response = await healthService.ping();
  const status = response.status();

  expect(status).toBe(StatusCodes.CREATED);
});
