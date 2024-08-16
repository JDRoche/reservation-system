import { Room } from "./Room";
import { User } from "./User";

export interface Reservation {
    id: number;
    bookingDate: string;
    reservationDate: string;
    user: User;
    rooms: Room[];
}