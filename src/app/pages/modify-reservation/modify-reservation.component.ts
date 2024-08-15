import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modify-reservation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modify-reservation.component.html',
  styleUrl: './modify-reservation.component.css'
})
export class ModifyReservationComponent implements OnInit {
  reservationForm: FormGroup;
  reservationId: number | null = null;
  reservationNotFound = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private toastr: ToastrService
  ) {
    this.reservationForm = this.fb.group({
      id: [''],
      reservationDate: ['', Validators.required],
      userEmail: ['', Validators.required],
      newRoom: [''],
      roomIds: this.fb.array([]),
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.reservationId = params['id'];
      if (this.reservationId) {
        this.loadReservation(this.reservationId);
      }
    });
  }

  loadReservation(id: number): void {
    this.reservationService.getReservationById(id).subscribe({
      next: (reservation) => {
        this.reservationForm.patchValue({
          id: reservation.data.id,
          reservationDate: reservation.data.reservationDate,
          userEmail: reservation.data.user.email,
        });

        const roomsArray = this.reservationForm.get('roomIds') as FormArray;
        roomsArray.clear();

        reservation.data.rooms.forEach(room => {
          roomsArray.push(this.fb.control(room.id));
        });

        this.reservationNotFound = false;
      },
      error: (error) => {
        this.reservationNotFound = true;
        this.toastr.error('No se encontró la reserva.');
      }
    });
  }

  onSubmit(): void {
    if (this.reservationForm.valid) {
      this.reservationService.updateReservation(this.reservationForm.value.id, this.reservationForm.value).subscribe({
        next: () => {
          this.toastr.success('Se modifico la reserva con exito.');
          this.router.navigate(['/view-reservations']);
        },
        error: (error) => {
          this.toastr.error('No es posible modificar la reserva.');
        }
      });
    }
  }

  searchById(): void {
    const id = this.reservationForm.get('id')?.value;
    if (id) {
      this.loadReservation(id);
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

  clearForm(): void {
    console.log(this.reservationId)
    if (this.reservationId) {
      this.router.navigate(['/view-reservations']);
    } else if (!this.reservationForm.get('id')?.value) {
      this.router.navigate(['/']);
    } else {
      this.reservationForm.reset();
      this.reservationId = null;
      this.reservationNotFound = false;
      this.router.navigate(['/modify-reservation']);
    }
  }
}
