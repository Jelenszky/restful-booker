import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';
import { Booking, BookingWithId, BookingId, GetBookingIdsParams } from '../types';

export class BookingService extends BaseService {
  private createdBookingIds: number[] = [];

  async getBookingIds(params?: GetBookingIdsParams): Promise<BookingId[]> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}/booking${queryString}`;

    const response = await this.requestContext.get(url);

    if (!response.ok()) {
      throw new Error(
        `${ErrorMessages.BOOKING.GET_IDS_FAILED} with status ${response.status()}: ${response.statusText()}`
      );
    }

    return response.json() as Promise<BookingId[]>;
  }

  async getBookingIdsResponse(params?: GetBookingIdsParams): Promise<APIResponse> {
    const queryString = this.buildQueryString(params);
    const url = `${this.baseURL}/booking${queryString}`;

    return this.requestContext.get(url);
  }

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

    const result = (await response.json()) as BookingWithId;
    this.createdBookingIds.push(result.bookingid);
    return result;
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

  async cleanup(token: string): Promise<void> {
    for (const id of this.createdBookingIds) {
      await this.deleteBooking(id, token);
    }
    this.createdBookingIds = [];
  }

  private buildQueryString(params?: GetBookingIdsParams): string {
    if (!params) return '';

    const definedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const queryString = new URLSearchParams(definedParams).toString();
    return queryString ? `?${queryString}` : '';
  }
}
