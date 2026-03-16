import { test, expect } from '../common/fixtures';
import { StatusCodes } from 'http-status-codes';
import { BookingSchema, Booking } from '../src/types/booking.types';
import { BookingService } from '../src/services/booking.service';
import { TestDataFactory } from '../common/utils/testdata.factory';

let bookingService: BookingService;
let testData: TestDataFactory;
let authToken: string;

test.beforeAll(({ serviceFactory, testDataFactory, authToken: token }) => {
  bookingService = serviceFactory.createBookingService();
  testData = testDataFactory;
  authToken = token;
});

test.afterAll(async () => {
  await bookingService.cleanup(authToken);
});

test.describe('UpdateBooking - schema validation', () => {
  test('should return valid schema for updated booking', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    const result = BookingSchema.safeParse(response);
    expect(result.success).toBe(true);
  });

  test('should return booking object matching updated data after updating all fields', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.firstname).toBe(updatedData.firstname);
    expect(response.lastname).toBe(updatedData.lastname);
    expect(response.totalprice).toBe(updatedData.totalprice);
    expect(response.depositpaid).toBe(updatedData.depositpaid);
    expect(response.bookingdates.checkin).toBe(updatedData.bookingdates.checkin);
    expect(response.bookingdates.checkout).toBe(updatedData.bookingdates.checkout);
    expect(response.additionalneeds).toBe(updatedData.additionalneeds);
  });
});

test.describe('UpdateBooking - valid updates', () => {
  test('should return 200 after succesful update of fields', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBookingResponse(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.status()).toBe(StatusCodes.OK);
  });

  test('should update booking firstname and lastname only', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData({
      totalprice: bookingData.totalprice,
      depositpaid: bookingData.depositpaid,
      bookingdates: bookingData.bookingdates,
      additionalneeds: bookingData.additionalneeds,
    });
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.firstname).toBe(updatedData.firstname);
    expect(response.lastname).toBe(updatedData.lastname);
  });

  test('should update booking totalprice', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.totalprice).toBe(updatedData.totalprice);
  });

  test('should update booking depositpaid status', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData({ depositpaid: !bookingData.depositpaid });
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.depositpaid).toBe(!bookingData.depositpaid);
  });

  test('should update booking dates', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedDates = testData.createBookingDatesTestData();
    const updatedData = testData.createBookingTestData({ bookingdates: updatedDates });
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.bookingdates.checkin).toBe(updatedDates.checkin);
    expect(response.bookingdates.checkout).toBe(updatedDates.checkout);
  });

  test('should update additionalneeds', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.additionalneeds).toBe(updatedData.additionalneeds);
  });

  test('should update booking to zero price', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createZeroPriceBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.totalprice).toBe(0);
  });

  test('should update booking with special characters in name', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createSpecialCharsBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.firstname).toBe(updatedData.firstname);
    expect(response.lastname).toBe(updatedData.lastname);
  });

  test('should update booking with unicode characters in name', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createUnicodeNameBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.firstname).toBe(updatedData.firstname);
    expect(response.lastname).toBe(updatedData.lastname);
  });

  test('should update booking with empty additionalneeds', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createEmptyNeedsBookingTestData();
    const response = await bookingService.updateBooking(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.additionalneeds).toBe('');
  });
});

test.describe('UpdateBooking - invalid requests', () => {
  test('should return 403 without authentication token', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBookingResponse(
      createdBooking.bookingid,
      updatedData,
      ''
    );

    expect(response.status()).toBe(StatusCodes.FORBIDDEN);
  });

  test('should return 400 for missing firstname', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createMissingFirstnameBookingTestData() as unknown as Booking;
    const response = await bookingService.updateBookingResponse(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should return 400 for missing lastname', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createMissingLastnameBookingTestData() as unknown as Booking;
    const response = await bookingService.updateBookingResponse(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should return 400 for missing bookingdates', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const updatedData = testData.createMissingDatesBookingTestData() as unknown as Booking;
    const response = await bookingService.updateBookingResponse(
      createdBooking.bookingid,
      updatedData,
      authToken
    );

    expect(response.status()).toBe(StatusCodes.BAD_REQUEST);
  });

  test('should return 405 for non-existent booking', async () => {
    const nonExistentBookingId = testData.getNonExistentBookingId();
    const updatedData = testData.createBookingTestData();
    const response = await bookingService.updateBookingResponse(
      nonExistentBookingId,
      updatedData,
      authToken
    );

    expect([StatusCodes.NOT_FOUND, StatusCodes.METHOD_NOT_ALLOWED]).toContain(response.status());
  });
});
