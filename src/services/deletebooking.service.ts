import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';

export class DeleteBookingService extends BaseService {
  async deleteBooking(bookingId: number, token: string): Promise<string> {
    const response = await this.requestContext.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.BOOKING.DELETE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.text() as Promise<string>;
  }

  async deleteBookingResponse(bookingId: number, token: string): Promise<APIResponse> {
    return this.requestContext.delete(`${this.baseURL}/booking/${bookingId}`, {
      headers: {
        'Content-Type': 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }
}
