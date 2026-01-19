import { test, expect } from '../common/fixtures';
import { HttpStatus } from '../common/constants';
import { DeleteBookingService } from '../src/services/deletebooking.service';
import { CreateBookingService } from '../src/services/createbooking.service';
import { GetBookingIdsService } from '../src/services/getbookingids.service';
import { TestDataFactory } from '../common/utils/testdata.factory';

let deleteService: DeleteBookingService;
let createService: CreateBookingService;
let getBookingIdsService: GetBookingIdsService;
let testData: TestDataFactory;
let authToken: string;

test.beforeAll(({ serviceFactory, testDataFactory, authToken: token }) => {
  deleteService = serviceFactory.createDeleteBookingService();
  createService = serviceFactory.createCreateBookingService();
  getBookingIdsService = serviceFactory.createGetBookingIdsService();
  testData = testDataFactory;
  authToken = token;
});

test.describe('DeleteBooking - successful deletion', () => {
  test('should delete a booking successfully', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const response = await deleteService.deleteBookingResponse(createdBooking.bookingid, authToken);

    expect(response.status()).toBe(HttpStatus.CREATED);
  });

  test('should remove booking from bookings list', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const allBookingsBeforeDelete = await getBookingIdsService.getBookingIds();
    const bookingExistsBefore = allBookingsBeforeDelete.some(
      (b) => b.bookingid === createdBooking.bookingid
    );

    await deleteService.deleteBooking(createdBooking.bookingid, authToken);

    const allBookingsAfterDelete = await getBookingIdsService.getBookingIds();
    const bookingExistsAfter = allBookingsAfterDelete.some(
      (b) => b.bookingid === createdBooking.bookingid
    );

    expect(bookingExistsBefore).toBeTruthy();
    expect(bookingExistsAfter).toBeFalsy();
  });
});

test.describe('DeleteBooking - authentication errors', () => {
  test('should return 403 without authentication token', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const response = await deleteService.deleteBookingResponse(createdBooking.bookingid, '');

    expect(response.status()).toBe(HttpStatus.FORBIDDEN);
  });

  test('should return 403 with invalid token', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const response = await deleteService.deleteBookingResponse(
      createdBooking.bookingid,
      'invalid-token'
    );

    expect(response.status()).toBe(HttpStatus.FORBIDDEN);
  });
});

test.describe('DeleteBooking - invalid requests', () => {
  test('should return 405 for non-existent booking', async () => {
    const nonExistentBookingId = testData.getNonExistentBookingId();
    const response = await deleteService.deleteBookingResponse(nonExistentBookingId, authToken);

    expect([HttpStatus.NOT_FOUND, HttpStatus.METHOD_NOT_ALLOWED]).toContain(response.status());
  });

  test('should return error when deleting already deleted booking', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    await deleteService.deleteBooking(createdBooking.bookingid, authToken);

    const response = await deleteService.deleteBookingResponse(createdBooking.bookingid, authToken);

    expect([HttpStatus.NOT_FOUND, HttpStatus.METHOD_NOT_ALLOWED]).toContain(response.status());
  });
});
