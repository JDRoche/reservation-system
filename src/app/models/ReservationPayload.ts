export interface ReservationPayload {
    bookingDate: string;
    reservationDate: string;
    userId: number;
    roomIds: number[];
}