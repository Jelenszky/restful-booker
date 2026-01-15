import { test, expect } from '../common/fixtures';
import { ErrorMessages, HttpStatus } from '../common/constants';
import { GetBookingIdsResponseSchema, BookingIdSchema } from '../src/types';
import { GetBookingIdsService } from '../src/services/getbookingids.service';
import { TestDataFactory } from '../common/utils/testdata.factory';

let bookingService: GetBookingIdsService;
let testData: TestDataFactory;

test.beforeAll(({ serviceFactory, testDataFactory }) => {
  bookingService = serviceFactory.createGetBookingIdsService();
  testData = testDataFactory;
});

test.describe('GetBookingIds - schema validation', () => {
  test('should return valid schema for all booking IDs', async () => {
    const bookings = await bookingService.getBookingIds();

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should return array with valid bookingid numbers', async () => {
    const bookings = await bookingService.getBookingIds();

    expect(Array.isArray(bookings)).toBeTruthy();

    bookings.forEach((booking, index) => {
      const result = BookingIdSchema.safeParse(booking);
      expect(result.success, `Booking at index ${index} failed schema validation`).toBeTruthy();
      expect(booking.bookingid).toBeGreaterThan(0);
      expect(Number.isInteger(booking.bookingid)).toBeTruthy();
    });
  });
});

test.describe('GetBookingIds - filtering by name', () => {
  test('should filter bookings by firstname', async () => {
    const params = testData.createFirstnameFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by lastname', async () => {
    const params = testData.createLastnameFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by firstname and lastname', async () => {
    const params = testData.createFullNameFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});

test.describe('GetBookingIds - filtering by date', () => {
  test('should filter bookings by checkin date', async () => {
    const params = testData.createCheckinFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by checkout date', async () => {
    const params = testData.createCheckoutFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should filter bookings by date range', async () => {
    const params = testData.createDateRangeFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});

test.describe('GetBookingIds - combined filters', () => {
  test('should filter with all parameters', async () => {
    const params = testData.createAllParamsFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});

test.describe('GetBookingIds - negative scenarios (invalid date formats)', () => {
  const invalidDateFormats = TestDataFactory.getInvalidDateFormatsTestData();

  for (const { description, params } of invalidDateFormats) {
    test(`should return error for ${description}`, async () => {
      const response = await bookingService.getBookingIdsResponse(params);

      expect(response.status()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(await response.text()).toContain(ErrorMessages.BOOKING.INTERNAL_SERVER_ERROR);
    });
  }
});

test.describe('GetBookingIds - edge cases', () => {
  test('should handle very old date', async () => {
    const params = testData.createOldDateFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should handle future date far in advance', async () => {
    const params = testData.createFutureDateFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should handle special characters in name filter', async () => {
    const params = testData.createSpecialCharsFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });

  test('should handle unicode characters in name filter', async () => {
    const params = testData.createUnicodeFilterTestData();
    const bookings = await bookingService.getBookingIds(params);

    const result = GetBookingIdsResponseSchema.safeParse(bookings);
    expect(result.success).toBeTruthy();
  });
});
