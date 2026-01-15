import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';
import { Booking, BookingWithId } from '../types';

export class CreateBookingService extends BaseService {
  async createBooking(booking: Booking): Promise<BookingWithId> {
    const response = await this.requestContext.post(`${this.baseURL}/booking`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.BOOKING.CREATE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json() as Promise<BookingWithId>;
  }

  async createBookingResponse(booking: Booking): Promise<APIResponse> {
    return this.requestContext.post(`${this.baseURL}/booking`, {
      data: booking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
}
