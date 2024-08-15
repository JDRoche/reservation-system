import { Reservation } from "./Reservation";

export interface ReservationResponse<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
}