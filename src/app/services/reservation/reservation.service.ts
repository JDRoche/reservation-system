import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationApiResponse } from '../../models/ReservationResponse ';
import { ReservationPayload } from '../../models/ReservationPayload';
import { Reservation } from '../../models/Reservation';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) { }

  // Get all reservations with optional filters
  getReservations(params?: { startDate?: string, endDate?: string, roomType?: string, userId?: number }): Observable<ReservationApiResponse<Reservation[]>> {
    let httpParams = new HttpParams();

    if (params?.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params?.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }
    if (params?.roomType) {
      httpParams = httpParams.set('roomType', params.roomType);
    }
    if (params?.userId) {
      httpParams = httpParams.set('userId', params.userId.toString());
    }

    return this.http.get<ReservationApiResponse<Reservation[]>>(this.apiUrl, { params: httpParams });
  }

  // Get a reservation by Id
  getReservationById(id: number): Observable<ReservationApiResponse<Reservation>> {
    return this.http.get<ReservationApiResponse<Reservation>>(`${this.apiUrl}/${id}`);
  }

  // Create a new reservation
  createReservation(reservation: ReservationPayload): Observable<ReservationApiResponse<Reservation>> {
    return this.http.post<ReservationApiResponse<Reservation>>(this.apiUrl, reservation);
  }

  // Update an existing reservation
  updateReservation(id: number, reservation: ReservationPayload): Observable<ReservationApiResponse<Reservation>> {
    return this.http.put<ReservationApiResponse<Reservation>>(`${this.apiUrl}/${id}`, reservation);
  }

  // Cancel a reservation
  cancelReservation(id: number): Observable<ReservationApiResponse<null>> {
    return this.http.delete<ReservationApiResponse<null>>(`${this.apiUrl}/${id}`);
  }
}
