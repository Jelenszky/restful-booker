import { test, expect } from '../common/fixtures';
import { HttpStatus } from '../common/constants';
import { BookingWithIdSchema, Booking } from '../src/types';
import { CreateBookingService } from '../src/services/createbooking.service';
import { TestDataFactory } from '../common/utils/testdata.factory';

let bookingService: CreateBookingService;
let testData: TestDataFactory;

test.beforeAll(({ serviceFactory, testDataFactory }) => {
  bookingService = serviceFactory.createCreateBookingService();
  testData = testDataFactory;
});

test.describe('CreateBooking - schema validation', () => {
  test('should return valid schema for created booking', async () => {
    const bookingData = testData.createBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    const result = BookingWithIdSchema.safeParse(response);
    expect(result.success).toBeTruthy();
  });

  test('should return booking object matching request data', async () => {
    const bookingData = testData.createBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.booking.firstname).toBe(bookingData.firstname);
    expect(response.booking.lastname).toBe(bookingData.lastname);
    expect(response.booking.totalprice).toBe(bookingData.totalprice);
    expect(response.booking.depositpaid).toBe(bookingData.depositpaid);
    expect(response.booking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
    expect(response.booking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
    expect(response.booking.additionalneeds).toBe(bookingData.additionalneeds);
  });

  test('should return positive integer bookingid', async () => {
    const bookingData = testData.createBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
  });
});

test.describe('CreateBooking - valid bookings', () => {
  test('should create booking with all fields', async () => {
    const bookingData = testData.createBookingTestData();
    const response = await bookingService.createBookingResponse(bookingData);

    expect(response.status()).toBe(HttpStatus.OK);
  });

  test('should create booking without additionalneeds', async () => {
    const bookingData = testData.createMinimalBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
    expect(response.booking.firstname).toBe(bookingData.firstname);
    expect(response.booking.additionalneeds).toBeUndefined();
  });

  test('should create booking with depositpaid false', async () => {
    const bookingData = testData.createBookingTestData({ depositpaid: false });
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
    expect(response.booking.depositpaid).toBe(false);
  });
});

test.describe('CreateBooking - edge cases', () => {
  test('should create booking with zero price', async () => {
    const bookingData = testData.createZeroPriceBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
    expect(response.booking.totalprice).toBe(0);
  });

  test('should create booking with long stay dates', async () => {
    const bookingData = testData.createLongStayBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
    expect(response.booking.bookingdates.checkin).toBe(bookingData.bookingdates.checkin);
    expect(response.booking.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  });

  test('should create booking with special characters in name', async () => {
    const bookingData = testData.createSpecialCharsBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
    expect(response.booking.firstname).toBe(bookingData.firstname);
    expect(response.booking.lastname).toBe(bookingData.lastname);
  });

  test('should create booking with empty additionalneeds string', async () => {
    const bookingData = testData.createEmptyNeedsBookingTestData();
    const response = await bookingService.createBooking(bookingData);

    expect(response.bookingid).toBeGreaterThan(0);
    expect(response.booking.additionalneeds).toBe('');
  });
});

test.describe('CreateBooking - invalid requests', () => {
  test('should return 500 for missing firstname', async () => {
    const bookingData = testData.createMissingFirstnameBookingTestData() as unknown as Booking;
    const response = await bookingService.createBookingResponse(bookingData);

    expect(response.status()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should return 500 for missing lastname', async () => {
    const bookingData = testData.createMissingLastnameBookingTestData() as unknown as Booking;
    const response = await bookingService.createBookingResponse(bookingData);

    expect(response.status()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should return 500 for missing bookingdates', async () => {
    const bookingData = testData.createMissingDatesBookingTestData() as unknown as Booking;
    const response = await bookingService.createBookingResponse(bookingData);

    expect(response.status()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });

  test('should return 500 for empty request body', async () => {
    const response = await bookingService.createBookingResponse({} as unknown as Booking);

    expect(response.status()).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
  });
});
