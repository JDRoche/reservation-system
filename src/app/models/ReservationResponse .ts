import { Reservation } from "./Reservation";

export interface ReservationResponse {
    success: boolean;
    message: string;
    statusCode: number;
    data: Reservation[];
}