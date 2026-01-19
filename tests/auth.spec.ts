import { test, expect } from '../common/fixtures';
import fs from 'fs';
import path from 'path';

const tokenFile = path.resolve(__dirname, '../.auth/token.json');

test.describe('Auth - token generation', () => {
  test('should authenticate and return valid token', async ({ authToken }) => {
    expect(authToken).toBeTruthy();
    expect(typeof authToken).toBe('string');

    // Save token to file for debugging/verification
    fs.mkdirSync(path.dirname(tokenFile), { recursive: true });
    fs.writeFileSync(tokenFile, JSON.stringify({ token: authToken }, null, 2));
    console.log('Authentication token saved:', authToken);
  });
});
