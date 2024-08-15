import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-reservation.component.html',
  styleUrl: './new-reservation.component.css'
})
export class NewReservationComponent {
  reservationForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private router: Router,
    private toastr: ToastrService,
  ) {
    this.reservationForm = this.fb.group({
      reservationDate: [null, Validators.required],
      userEmail: [null, Validators.required],
      newRoom: [''],
      roomIds: this.fb.array([]),
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      const formData = this.reservationForm.value;
      this.reservationService.createReservation({ ...formData }).subscribe({
        next: response => {
          this.toastr.success('Reserva creada exitosamente!');
          this.router.navigate(['/view-reservations']);
        },
        error: error => {
          this.toastr.error('Error al crear la reserva.');
        }
      }
      );
    } else {
      this.toastr.warning('Por favor, complete todos los campos.');
    }
  }

  addRoom(): void {
    const roomControl = this.reservationForm.get('newRoom');
    const roomValue = roomControl?.value;
    if (roomValue && !this.reservationForm.get('roomIds')?.value.includes(roomValue)) {
      const roomsArray = this.reservationForm.get('roomIds') as FormArray;
      roomsArray.push(this.fb.control(roomValue));
      roomControl?.reset();
    }
  }

  removeRoom(index: number): void {
    const roomsArray = this.reservationForm.get('roomIds') as FormArray;
    roomsArray.removeAt(index);
  }

  cancelCreation() {
    this.router.navigate(['/view-reservations']);
  }
}
