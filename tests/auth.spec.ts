import { test as setup } from '../common/fixtures';
import fs from 'fs';
import path from 'path';
import { ErrorMessages } from '../common/constants';
import dotenv from 'dotenv';

dotenv.config();

const tokenFile = path.resolve(__dirname, '../.auth/token.json');

setup('Authenticate and save token', async ({ serviceFactory }) => {
  try {
    const authService = serviceFactory.createAuthService();
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
  }
});
