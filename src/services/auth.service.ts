import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants/error-messages';

export interface AuthResponse {
  token: string;
}

export class AuthService extends BaseService {
  async authenticate(username: string, password: string): Promise<string> {
    const response = await this.requestContext.post(`${this.baseURL}/auth`, {
      data: { username, password },
    });

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.AUTH.FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    const { token } = (await response.json()) as AuthResponse;

    if (!token) {
      throw new Error(ErrorMessages.AUTH.NO_TOKEN);
    }

    return token;
  }
}
