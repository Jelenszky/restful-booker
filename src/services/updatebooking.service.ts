import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';
import { Booking } from '../types';

export class UpdateBookingService extends BaseService {
  async updateBooking(bookingId: number, booking: Booking, token: string): Promise<Booking> {
    const response = await this.requestContext.put(`${this.baseURL}/booking/${bookingId}`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.BOOKING.UPDATE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json() as Promise<Booking>;
  }

  async updateBookingResponse(
    bookingId: number,
    booking: Booking,
    token: string
  ): Promise<APIResponse> {
    return this.requestContext.put(`${this.baseURL}/booking/${bookingId}`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }
}
