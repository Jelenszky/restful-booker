import { test, expect } from '../common/fixtures';
import { StatusCodes } from 'http-status-codes';
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

test.describe('DeleteBooking - successful deletion', () => {
  test('should delete a booking successfully', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const response = await bookingService.deleteBookingResponse(
      createdBooking.bookingid,
      authToken
    );

    expect(response.status()).toBe(StatusCodes.CREATED);
  });

  test('should remove booking from bookings list', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const allBookingsBeforeDelete = await bookingService.getBookingIds();
    const bookingExistsBefore = allBookingsBeforeDelete.some(
      (b) => b.bookingid === createdBooking.bookingid
    );

    expect(bookingExistsBefore).toBeTruthy();

    await bookingService.deleteBooking(createdBooking.bookingid, authToken);

    const allBookingsAfterDelete = await bookingService.getBookingIds();
    const bookingExistsAfter = allBookingsAfterDelete.some(
      (b) => b.bookingid === createdBooking.bookingid
    );

    expect(bookingExistsAfter).toBeFalsy();
  });
});

test.describe('DeleteBooking - authentication errors', () => {
  test('should return 403 without authentication token', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const response = await bookingService.deleteBookingResponse(createdBooking.bookingid, '');

    expect(response.status()).toBe(StatusCodes.FORBIDDEN);
  });

  test('should return 403 with invalid token', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    const response = await bookingService.deleteBookingResponse(
      createdBooking.bookingid,
      'invalid-token'
    );

    expect(response.status()).toBe(StatusCodes.FORBIDDEN);
  });
});

test.describe('DeleteBooking - invalid requests', () => {
  test('should return 405 for non-existent booking', async () => {
    const nonExistentBookingId = testData.getNonExistentBookingId();
    const response = await bookingService.deleteBookingResponse(nonExistentBookingId, authToken);

    expect([StatusCodes.NOT_FOUND, StatusCodes.METHOD_NOT_ALLOWED]).toContain(response.status());
  });

  test('should return error when deleting already deleted booking', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await bookingService.createBooking(bookingData);

    await bookingService.deleteBooking(createdBooking.bookingid, authToken);

    const response = await bookingService.deleteBookingResponse(
      createdBooking.bookingid,
      authToken
    );

    expect([StatusCodes.NOT_FOUND, StatusCodes.METHOD_NOT_ALLOWED]).toContain(response.status());
  });
});
