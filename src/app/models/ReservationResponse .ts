export interface ReservationApiResponse<T> {
    success: boolean;
    message: string;
    statusCode: number;
    data: T;
}