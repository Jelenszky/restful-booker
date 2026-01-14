import { test as base, request, APIRequestContext } from '@playwright/test';
import { ServiceFactory } from '../common/utils/service.factory';
import config from '../playwright.config';

const baseURL = config.use?.baseURL ?? 'https://restful-booker.herokuapp.com';

interface TestFixtures {
  serviceFactory: ServiceFactory;
  requestContext: APIRequestContext;
}

export const test = base.extend<TestFixtures>({
  requestContext: async ({}, use) => {
    const context = await request.newContext();
    await use(context);
    await context.dispose();
  },

  serviceFactory: async ({ requestContext }, use) => {
    const serviceFactory = new ServiceFactory(baseURL, requestContext);
    await use(serviceFactory);
  },
});

export { expect } from '@playwright/test';
