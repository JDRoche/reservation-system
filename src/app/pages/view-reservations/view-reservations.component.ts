import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation/reservation.service';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../models/Reservation';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Room } from '../../models/Room';

@Component({
  selector: 'app-view-reservations',
  standalone: true,
  imports: [FormsModule, DatePipe, CurrencyPipe],
  templateUrl: './view-reservations.component.html',
  styleUrl: './view-reservations.component.css'
})
export class ViewReservationsComponent implements OnInit {

  reservations: Reservation[] = [];
  filters = {
    startDate: '',
    endDate: '',
    roomType: '',
    userEmail: ''
  }


  roomTypes: string[] = ['SINGLE', 'DOUBLE', 'SUITE', 'DELUXE'];

  constructor(private reservationService: ReservationService, private router: Router) { }

  ngOnInit() {
    this.reservationService.getReservations().subscribe(response => {
      if (response.success) {
        this.reservations = response.data;
      }
    })
  }

  filterReservations() {
    this.reservationService.getReservations(this.filters)
      .subscribe((response) => {
        if (response.success) {
          this.reservations = response.data;
        }
      });
  }

  navigateToDeleteReservation(id: number) {
    this.router.navigate(['/cancel-reservation', id]);
  }
  navigateToEditReservation(id: number) {
    this.router.navigate(['/modify-reservation', id]);
  }
  navigateToCreateReservation() {
    this.router.navigate(['/create-reservation']);
  }

  clearFilters() {
    this.filters = {
      startDate: '',
      endDate: '',
      roomType: '',
      userEmail: ''
    }
    this.filterReservations();
  }

  getRooms(rooms: Room[]): string {
    return rooms.map(room => `${room.roomNumber} - ${room.type}`).join(', ');
  }

  getTotalPrice(rooms: Room[]): number {
    return rooms.reduce((total, room) => total + room.price, 0);
  }

}
