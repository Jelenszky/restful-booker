import { z } from 'zod';

export const BookingIdSchema = z.object({
  bookingid: z.number().int().positive(),
});

export const GetBookingIdsResponseSchema = z.array(BookingIdSchema);

export type BookingId = z.infer<typeof BookingIdSchema>;
export type GetBookingIdsResponse = z.infer<typeof GetBookingIdsResponseSchema>;

export interface GetBookingIdsParams {
  firstname?: string;
  lastname?: string;
  checkin?: string;
  checkout?: string;
}

export const BookingDatesSchema = z.object({
  checkin: z.string(),
  checkout: z.string(),
});

export const BookingSchema = z.object({
  firstname: z.string(),
  lastname: z.string(),
  totalprice: z.number(),
  depositpaid: z.boolean(),
  bookingdates: BookingDatesSchema,
  additionalneeds: z.string().optional(),
});

export const BookingWithIdSchema = z.object({
  bookingid: z.number().int().positive(),
  booking: BookingSchema,
});

export type BookingDates = z.infer<typeof BookingDatesSchema>;
export type Booking = z.infer<typeof BookingSchema>;
export type BookingWithId = z.infer<typeof BookingWithIdSchema>;
