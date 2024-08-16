import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environments';
import { ReservationApiResponse } from '../../models/ReservationResponse ';
import { Room } from '../../models/Room';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private apiUrl = `${environment.apiUrl}/rooms`;

  constructor(private http: HttpClient) { }

  // Get all rooms
  getRooms(): Observable<ReservationApiResponse<Room[]>> {
    return this.http.get<ReservationApiResponse<Room[]>>(this.apiUrl)
  }
}
