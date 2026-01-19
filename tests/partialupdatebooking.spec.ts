import { test, expect } from '../common/fixtures';
import { HttpStatus } from '../common/constants';
import { BookingSchema } from '../src/types';
import { PartialUpdateBookingService } from '../src/services/partialupdatebooking.service';
import { CreateBookingService } from '../src/services/createbooking.service';
import { TestDataFactory } from '../common/utils/testdata.factory';

let partialUpdateService: PartialUpdateBookingService;
let createService: CreateBookingService;
let testData: TestDataFactory;
let authToken: string;

test.beforeAll(({ serviceFactory, testDataFactory, authToken: token }) => {
  partialUpdateService = serviceFactory.createPartialUpdateBookingService();
  createService = serviceFactory.createCreateBookingService();
  testData = testDataFactory;
  authToken = token;
});

test.describe('PartialUpdateBooking - schema validation', () => {
  test('should return valid schema for partial updated booking', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const partialData = { firstname: testData.createBookingTestData().firstname };
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      partialData,
      authToken
    );

    const result = BookingSchema.safeParse(response);
    expect(result.success).toBeTruthy();
  });

  test('should return full booking object after partial update', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const partialData = { firstname: testData.createBookingTestData().firstname };
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      partialData,
      authToken
    );

    expect(response.firstname).toBe(partialData.firstname);
    expect(response.lastname).toBeTruthy();
    expect(response.totalprice).toBeTruthy();
    expect(response.depositpaid).toBeDefined();
    expect(response.bookingdates).toBeTruthy();
  });
});

test.describe('PartialUpdateBooking - single field updates', () => {
  test('should update only firstname', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const newFirstname = testData.createBookingTestData().firstname;
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      { firstname: newFirstname },
      authToken
    );

    expect(response.firstname).toBe(newFirstname);
    expect(response.lastname).toBe(bookingData.lastname);
    expect(response.totalprice).toBe(bookingData.totalprice);
  });

  test('should update only totalprice', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const newPrice = testData.createBookingTestData().totalprice;
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      { totalprice: newPrice },
      authToken
    );

    expect(response.totalprice).toBe(newPrice);
    expect(response.firstname).toBe(bookingData.firstname);
    expect(response.lastname).toBe(bookingData.lastname);
  });

  test('should update only depositpaid', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const newDepositPaid = !bookingData.depositpaid;
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      { depositpaid: newDepositPaid },
      authToken
    );

    expect(response.depositpaid).toBe(newDepositPaid);
    expect(response.firstname).toBe(bookingData.firstname);
    expect(response.totalprice).toBe(bookingData.totalprice);
  });

  test('should update only checkin date', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const newDates = testData.createBookingDatesTestData();
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      { bookingdates: { checkin: newDates.checkin, checkout: bookingData.bookingdates.checkout } },
      authToken
    );

    expect(response.bookingdates.checkin).toBe(newDates.checkin);
    expect(response.bookingdates.checkout).toBe(bookingData.bookingdates.checkout);
  });

  test('should update only additionalneeds', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const newNeeds = testData.createBookingTestData().additionalneeds;
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      { additionalneeds: newNeeds },
      authToken
    );

    expect(response.additionalneeds).toBe(newNeeds);
    expect(response.firstname).toBe(bookingData.firstname);
  });
});

test.describe('PartialUpdateBooking - multiple field updates', () => {
  test('should update firstname and lastname', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const newData = testData.createBookingTestData();
    const response = await partialUpdateService.partialUpdateBooking(
      createdBooking.bookingid,
      { firstname: newData.firstname, lastname: newData.lastname },
      authToken
    );

    expect(response.firstname).toBe(newData.firstname);
    expect(response.lastname).toBe(newData.lastname);
    expect(response.totalprice).toBe(bookingData.totalprice);
  });
});

test.describe('PartialUpdateBooking - invalid requests', () => {
  test('should return 403 without authentication token', async () => {
    const bookingData = testData.createBookingTestData();
    const createdBooking = await createService.createBooking(bookingData);

    const response = await partialUpdateService.partialUpdateBookingResponse(
      createdBooking.bookingid,
      { firstname: testData.createBookingTestData().firstname },
      ''
    );

    expect(response.status()).toBe(HttpStatus.FORBIDDEN);
  });

  test('should return 405 for non-existent booking', async () => {
    const nonExistentBookingId = testData.getNonExistentBookingId();
    const response = await partialUpdateService.partialUpdateBookingResponse(
      nonExistentBookingId,
      { firstname: testData.createBookingTestData().firstname },
      authToken
    );

    expect([HttpStatus.NOT_FOUND, HttpStatus.METHOD_NOT_ALLOWED]).toContain(response.status());
  });
});
