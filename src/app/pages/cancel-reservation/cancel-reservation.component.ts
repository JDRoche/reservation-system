import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { Reservation } from '../../models/Reservation';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cancel-reservation',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, FormsModule],
  templateUrl: './cancel-reservation.component.html',
  styleUrl: './cancel-reservation.component.css'
})
export class CancelReservationComponent {
  reservation: Reservation | null = null;
  selectedReservationId: number | null = null;
  totalPrice: number = 0;
  id: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.loadReservationById(this.id);
      }
    });
  }

  loadReservation(): void {
    if (this.selectedReservationId) {
      this.loadReservationById(this.selectedReservationId);
    }
  }

  loadReservationById(id: number): void {
    this.reservationService.getReservationById(id).subscribe({
      next: res => {
        this.reservation = res.data;
        this.calculateTotalPrice();
      },
      error: err => {
        this.toastr.info('No se pudo obtener la reserva.');
      }
    }
    );
  }

  calculateTotalPrice(): void {
    if (this.reservation) {
      this.totalPrice = this.reservation.rooms.reduce((sum, room) => sum + room.price, 0);
    }
  }

  cancel(): void {
    if (this.id) {
      this.router.navigate(['/view-reservations']);
    } else if (!this.selectedReservationId) {
      this.router.navigate(['/']);
    } else {
      this.reservation = null;
      this.selectedReservationId = null;
      this.router.navigate(['/cancel-reservation']);
    }

  }

  confirmDelete(): void {
    if (this.reservation) {
      this.reservationService.cancelReservation(this.reservation.id).subscribe(() => {
        this.toastr.success('Reserva cancelada con exito.');
        if (this.id) {
          this.router.navigate(['/view-reservations']);
        } else {
          this.router.navigate(['/']);
        }
      });
    }
  }
}
