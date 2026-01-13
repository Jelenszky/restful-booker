import { APIRequestContext } from '@playwright/test';

export interface AuthResponse {
  token: string;
}

export class AuthService {
  constructor(
    private baseURL: string,
    private requestContext: APIRequestContext
  ) {}

  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.requestContext.post(`${this.baseURL}/auth`, {
      data: { username, password }
    });

    if (!response.ok()) {
      throw new Error(
        `Authentication failed with status ${response.status()}: ${response.statusText()}`
      );
    }

    const { token } = await response.json() as AuthResponse;

    if (!token) {
      throw new Error('No token received in authentication response');
    }

    return token;
  }
}