import { request, test as setup } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import config from '../playwright.config';
import { AuthService } from '../src/services/auth.service.ts';
require('dotenv').config();

const tokenFile = path.resolve(__dirname, '../.auth/token.json');
const baseURL = config.use?.baseURL;

setup('Authenticate and save token', async () => {
  const requestContext = await request.newContext();

  try {
    const authService = new AuthService(baseURL!, requestContext);
    const token = await authService.authenticate(
      process.env.TEST_USER_USERNAME!,
      process.env.TEST_USER_PASSWORD!
    );

    fs.mkdirSync(path.dirname(tokenFile), { recursive: true });
    fs.writeFileSync(tokenFile, JSON.stringify({ token }, null, 2));
    
    console.log('Authentication token saved:', token);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Authentication failed:', errorMessage);
    throw new Error(`Setup failed: ${errorMessage}`);

  } finally {
    await requestContext.dispose();
  }
});
