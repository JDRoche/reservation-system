import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../services/reservation.service';
import { FormsModule } from '@angular/forms';
import { Reservation } from '../../models/Reservation';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

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
    userId: 0
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

  navigateToDeleteReservation(arg0: number) {
    this.router.navigate(['/cancel-reservation']);
  }
  navigateToEditReservation(arg0: number) {
    this.router.navigate(['/modify-reservation']);
  }
  navigateToCreateReservation() {
    this.router.navigate(['/create-reservation']);
  }

  clearFilters() {
    this.filters = {
      startDate: '',
      endDate: '',
      roomType: '',
      userId: 0
    }
    this.filterReservations();
  }

}
