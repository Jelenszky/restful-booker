import { faker, Faker } from '@faker-js/faker';
import { Booking, BookingDates, GetBookingIdsParams } from '../../src/types';

export interface TestDataFactoryOptions {
  seed?: number;
}

export interface InvalidDateFormatTestData {
  description: string;
  params: GetBookingIdsParams;
}

export class TestDataFactory {
  private faker: Faker;

  constructor(options?: TestDataFactoryOptions) {
    this.faker = faker;
    if (options?.seed) {
      this.faker.seed(options.seed);
    }
  }

  /**
   * Generate a complete valid booking with all fields
   */
  createBookingTestData(overrides?: Partial<Booking>): Booking {
    const checkin = this.faker.date.future();
    const checkout = this.faker.date.future({ refDate: checkin });

    return {
      firstname: this.faker.person.firstName(),
      lastname: this.faker.person.lastName(),
      totalprice: this.faker.number.int({ min: 50, max: 1000 }),
      depositpaid: this.faker.datatype.boolean(),
      bookingdates: {
        checkin: checkin.toISOString().split('T')[0],
        checkout: checkout.toISOString().split('T')[0],
      },
      additionalneeds: this.faker.helpers.arrayElement([
        'Breakfast',
        'Lunch',
        'Dinner',
        'Late checkout',
        'Early checkin',
        'Airport transfer',
      ]),
      ...overrides,
    };
  }

  /**
   * Generate a minimal booking without optional fields
   */
  createMinimalBookingTestData(overrides?: Partial<Booking>): Booking {
    const checkin = this.faker.date.future();
    const checkout = this.faker.date.future({ refDate: checkin });

    return {
      firstname: this.faker.person.firstName(),
      lastname: this.faker.person.lastName(),
      totalprice: this.faker.number.int({ min: 50, max: 1000 }),
      depositpaid: this.faker.datatype.boolean(),
      bookingdates: {
        checkin: checkin.toISOString().split('T')[0],
        checkout: checkout.toISOString().split('T')[0],
      },
      ...overrides,
    };
  }

  /**
   * Generate booking dates
   */
  createBookingDatesTestData(overrides?: Partial<BookingDates>): BookingDates {
    const checkin = this.faker.date.future();
    const checkout = this.faker.date.future({ refDate: checkin });

    return {
      checkin: checkin.toISOString().split('T')[0],
      checkout: checkout.toISOString().split('T')[0],
      ...overrides,
    };
  }

  // ==========================================
  // Filter Params Generators for GetBookingIds
  // ==========================================

  /**
   * Generate filter with firstname only
   */
  createFirstnameFilterTestData(): GetBookingIdsParams {
    return { firstname: this.faker.person.firstName() };
  }

  /**
   * Generate filter with lastname only
   */
  createLastnameFilterTestData(): GetBookingIdsParams {
    return { lastname: this.faker.person.lastName() };
  }

  /**
   * Generate filter with both firstname and lastname
   */
  createFullNameFilterTestData(): GetBookingIdsParams {
    return {
      firstname: this.faker.person.firstName(),
      lastname: this.faker.person.lastName(),
    };
  }

  /**
   * Generate filter with checkin date only
   */
  createCheckinFilterTestData(): GetBookingIdsParams {
    return { checkin: this.faker.date.past().toISOString().split('T')[0] };
  }

  /**
   * Generate filter with checkout date only
   */
  createCheckoutFilterTestData(): GetBookingIdsParams {
    return { checkout: this.faker.date.future().toISOString().split('T')[0] };
  }

  /**
   * Generate filter with date range (checkin and checkout)
   */
  createDateRangeFilterTestData(): GetBookingIdsParams {
    const checkin = this.faker.date.past();
    const checkout = this.faker.date.future({ refDate: checkin });
    return {
      checkin: checkin.toISOString().split('T')[0],
      checkout: checkout.toISOString().split('T')[0],
    };
  }

  /**
   * Generate filter with all parameters
   */
  createAllParamsFilterTestData(): GetBookingIdsParams {
    const checkin = this.faker.date.past();
    const checkout = this.faker.date.future({ refDate: checkin });
    return {
      firstname: this.faker.person.firstName(),
      lastname: this.faker.person.lastName(),
      checkin: checkin.toISOString().split('T')[0],
      checkout: checkout.toISOString().split('T')[0],
    };
  }

  /**
   * Generate filter with special characters in name
   */
  createSpecialCharsFilterTestData(): GetBookingIdsParams {
    return { firstname: `O'${this.faker.person.firstName()}` };
  }

  /**
   * Generate filter with unicode characters in name
   */
  createUnicodeFilterTestData(): GetBookingIdsParams {
    return {
      firstname: this.faker.helpers.arrayElement(['José', 'François', 'Müller', '中村', 'Иван']),
    };
  }

  /**
   * Generate filter with very old date
   */
  createOldDateFilterTestData(): GetBookingIdsParams {
    return { checkin: '1900-01-01' };
  }

  /**
   * Generate filter with far future date
   */
  createFutureDateFilterTestData(): GetBookingIdsParams {
    const futureYear = new Date().getFullYear() + 50;
    return { checkin: `${futureYear}-12-31` };
  }

  /**
   * Get array of invalid date format test scenarios
   * Static because these are hardcoded invalid values (no faker needed)
   */
  static getInvalidDateFormatsTestData(): InvalidDateFormatTestData[] {
    return [
      { description: 'DD/MM/YYYY format with slashes', params: { checkin: '31/12/2024' } },
      { description: 'text as date value', params: { checkin: 'invalid-date' } },
      { description: 'impossible date values', params: { checkin: '2024-13-45' } },
      { description: 'SQL injection attempt', params: { checkin: "'; DROP TABLE bookings;--" } },
      { description: 'XSS attempt in date', params: { checkin: '<script>alert(1)</script>' } },
    ];
  }

  // ==========================================
  // Booking Edge Case Generators
  // ==========================================

  /**
   * Generate booking with zero price
   */
  createZeroPriceBookingTestData(): Booking {
    return this.createBookingTestData({ totalprice: 0 });
  }

  /**
   * Generate booking with very high price
   */
  createHighPriceBookingTestData(): Booking {
    return this.createBookingTestData({
      totalprice: this.faker.number.int({ min: 10000, max: 100000 }),
    });
  }

  /**
   * Generate booking with long stay (30+ days)
   */
  createLongStayBookingTestData(): Booking {
    const checkin = this.faker.date.future();
    const checkout = new Date(checkin);
    checkout.setDate(checkout.getDate() + this.faker.number.int({ min: 30, max: 365 }));

    return this.createBookingTestData({
      bookingdates: {
        checkin: checkin.toISOString().split('T')[0],
        checkout: checkout.toISOString().split('T')[0],
      },
    });
  }

  /**
   * Generate booking with special characters in name
   */
  createSpecialCharsBookingTestData(): Booking {
    return this.createBookingTestData({
      firstname: `${this.faker.person.firstName()}-${this.faker.person.firstName()}`,
      lastname: `O'${this.faker.person.lastName()}`,
    });
  }

  /**
   * Generate booking with unicode characters in name
   */
  createUnicodeNameBookingTestData(): Booking {
    return this.createBookingTestData({
      firstname: this.faker.helpers.arrayElement(['José', 'François', 'Müller', '中村', 'Иван']),
      lastname: this.faker.helpers.arrayElement([
        'García',
        'Müller',
        '田中',
        'Петров',
        'Østerberg',
      ]),
    });
  }

  /**
   * Generate booking with empty additionalneeds
   */
  createEmptyNeedsBookingTestData(): Booking {
    return this.createBookingTestData({ additionalneeds: '' });
  }

  // ==========================================
  // Invalid Booking Generators (Negative Tests)
  // ==========================================

  /**
   * Generate booking missing firstname
   */
  createMissingFirstnameBookingTestData(): Partial<Booking> {
    const booking = this.createBookingTestData();
    const { firstname: _, ...rest } = booking;
    return rest;
  }

  /**
   * Generate booking missing lastname
   */
  createMissingLastnameBookingTestData(): Partial<Booking> {
    const booking = this.createBookingTestData();
    const { lastname: _, ...rest } = booking;
    return rest;
  }

  /**
   * Generate booking missing bookingdates
   */
  createMissingDatesBookingTestData(): Partial<Booking> {
    const booking = this.createBookingTestData();
    const { bookingdates: _, ...rest } = booking;
    return rest;
  }

  /**
   * Generate a non-existent booking ID that is very unlikely to exist
   */
  getNonExistentBookingId(): number {
    return this.faker.number.int({ min: 999999, max: 9999999 });
  }
}
