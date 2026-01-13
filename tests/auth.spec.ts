import { request, test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import config from '../playwright.config';
import { ServiceFactory } from '../common/utils/service.factory';
import { ErrorMessages } from '../common/constants';
require('dotenv').config();

const tokenFile = path.resolve(__dirname, '../.auth/token.json');
const baseURL = config.use?.baseURL!;

setup('Authenticate and save token', async () => {
  const requestContext = await request.newContext();

  try {
    const factory = new ServiceFactory(baseURL, requestContext);
    const authService = factory.createAuthService();
    const token = await authService.authenticate(
      process.env.TEST_USER_USERNAME!,
      process.env.TEST_USER_PASSWORD!
    );

    fs.mkdirSync(path.dirname(tokenFile), { recursive: true });
    fs.writeFileSync(tokenFile, JSON.stringify({ token }, null, 2));
    
    console.log('Authentication token saved:', token);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : ErrorMessages.GENERIC.UNKNOWN;
    console.error(ErrorMessages.AUTH.FAILED, errorMessage);
    throw new Error(`${ErrorMessages.AUTH.SETUP_FAILED}: ${errorMessage}`);

  } finally {
    await requestContext.dispose();
  }
});
