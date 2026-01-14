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
