import { test as base, request, APIRequestContext } from '@playwright/test';
import { ServiceFactory } from '../common/utils/service.factory';
import { TestDataFactory } from '../common/utils/testdata.factory';
import { ErrorMessages } from '../common/constants';
import config from '../playwright.config';
import dotenv from 'dotenv';

dotenv.config();

const baseURL = config.use?.baseURL ?? 'https://restful-booker.herokuapp.com';

interface WorkerFixtures {
  serviceFactory: ServiceFactory;
  requestContext: APIRequestContext;
  testDataFactory: TestDataFactory;
  authToken: string;
}

export const test = base.extend<object, WorkerFixtures>({
  requestContext: [
    async ({}, use) => {
      const context = await request.newContext();
      await use(context);
      await context.dispose();
    },
    { scope: 'worker' },
  ],

  serviceFactory: [
    async ({ requestContext }, use) => {
      const serviceFactory = new ServiceFactory(baseURL, requestContext);
      await use(serviceFactory);
    },
    { scope: 'worker' },
  ],

  testDataFactory: [
    async ({}, use) => {
      // Optional: Set TEST_SEED env var for reproducible test data
      const seed = process.env.TEST_SEED ? parseInt(process.env.TEST_SEED) : undefined;
      const testDataFactory = new TestDataFactory({ seed });
      await use(testDataFactory);
    },
    { scope: 'worker' },
  ],

  authToken: [
    async ({ serviceFactory }, use) => {
      try {
        const authService = serviceFactory.createAuthService();
        const token = await authService.authenticate(
          process.env.TEST_USER_USERNAME!,
          process.env.TEST_USER_PASSWORD!
        );
        await use(token);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : ErrorMessages.GENERIC.UNKNOWN;
        throw new Error(`${ErrorMessages.AUTH.SETUP_FAILED}: ${errorMessage}`);
      }
    },
    { scope: 'worker' },
  ],
});

export { expect } from '@playwright/test';
