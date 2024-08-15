import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation/reservation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-reservation.component.html',
  styleUrl: './new-reservation.component.css'
})
export class NewReservationComponent {
  selectedRooms: string[] = [];
  reservationForm: FormGroup;

  constructor(private fb: FormBuilder, private reservationService: ReservationService, private toastr: ToastrService,) {
    this.reservationForm = this.fb.group({
      reservationDate: [null, Validators.required],
      userId: [null, Validators.required],
      roomIds: [null, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const formData = this.reservationForm.value;
      this.reservationService.createReservation({ ...formData, roomIds: this.selectedRooms }).subscribe({
        next: response => {
          this.toastr.info('Reserva creada exitosamente!');
        },
        error: error => {
          this.toastr.error('Error al crear la reserva.');
        }
      }
      );
    } else {
      this.toastr.warning('Por favor, complete todos los campos obligatorios.');
    }
  }

  addRoom(roomId: string): void {
    if (!this.selectedRooms.includes(roomId)) {
      this.selectedRooms.push(roomId);
    }
  }
}
