import { Injectable } from '@angular/core';
import { environment } from '../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) { }

  // Get all reservations with optional filters
  getReservations(params?: { startDate?: string, endDate?: string, serviceType?: string, userId?: number }): Observable<ReservationResponse> {
    let httpParams = new HttpParams();

    if (params?.startDate) {
      httpParams = httpParams.set('startDate', params.startDate);
    }
    if (params?.endDate) {
      httpParams = httpParams.set('endDate', params.endDate);
    }
    if (params?.serviceType) {
      httpParams = httpParams.set('serviceType', params.serviceType);
    }
    if (params?.userId) {
      httpParams = httpParams.set('userId', params.userId.toString());
    }

    return this.http.get<ReservationResponse>(this.apiUrl, { params: httpParams });
  }

  // Create a new reservation
  createReservation(reservation: ReservationPayload): Observable<ReservationResponse> {
    return this.http.post<ReservationResponse>(this.apiUrl, reservation);
  }

  // Update an existing reservation
  updateReservation(id: number, reservation: ReservationPayload): Observable<ReservationResponse> {
    return this.http.put<ReservationResponse>(`${this.apiUrl}/${id}`, reservation);
  }

  // Cancel a reservation
  cancelReservation(id: number): Observable<ReservationResponse> {
    return this.http.delete<ReservationResponse>(`${this.apiUrl}/${id}`);
  }
}
