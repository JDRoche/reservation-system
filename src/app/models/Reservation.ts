interface Reservation {
    id: number;
    bookingDate: string;
    reservationDate: string;
    user: User;
    rooms: Room[];
}