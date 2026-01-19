import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';
import { BookingId, GetBookingIdsParams } from '../types';

export class GetBookingIdsService extends BaseService {
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

  private buildQueryString(params?: GetBookingIdsParams): string {
    if (!params) return '';

    const definedParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    );

    const queryString = new URLSearchParams(definedParams).toString();
    return queryString ? `?${queryString}` : '';
  }
}
