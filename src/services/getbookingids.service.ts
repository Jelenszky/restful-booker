import { APIResponse } from '@playwright/test';
import { BaseService } from './base.service';
import { ErrorMessages } from '../../common/constants';

export interface GetBookingIdsParams {
  firstname?: string;
  lastname?: string;
  checkin?: string; 
  checkout?: string;
}

export interface BookingId {
  bookingid: number;
}

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

  private buildQueryString(params?: GetBookingIdsParams): string {
    if (!params) return '';

    const queryParams = new URLSearchParams();
    
    if (params.firstname) queryParams.append('firstname', params.firstname);
    if (params.lastname) queryParams.append('lastname', params.lastname);
    if (params.checkin) queryParams.append('checkin', params.checkin);
    if (params.checkout) queryParams.append('checkout', params.checkout);

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }
}
