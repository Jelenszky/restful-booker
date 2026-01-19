import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';
import { Booking } from '../types';

export class PartialUpdateBookingService extends BaseService {
  async partialUpdateBooking(
    bookingId: number,
    partialBooking: Partial<Booking>,
    token: string
  ): Promise<Booking> {
    const response = await this.requestContext.patch(`${this.baseURL}/booking/${bookingId}`, {
      data: partialBooking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.BOOKING.PARTIAL_UPDATE_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json() as Promise<Booking>;
  }

  async partialUpdateBookingResponse(
    bookingId: number,
    partialBooking: Partial<Booking>,
    token: string
  ): Promise<APIResponse> {
    return this.requestContext.patch(`${this.baseURL}/booking/${bookingId}`, {
      data: partialBooking,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: `token=${token}`,
      },
    });
  }
}
