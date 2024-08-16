import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReservationService } from '../../services/reservation/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Room } from '../../models/Room';
import { RoomService } from '../../services/room/room.service';

@Component({
  selector: 'app-new-reservation',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-reservation.component.html',
  styleUrl: './new-reservation.component.css'
})
export class NewReservationComponent implements OnInit {
  reservationForm: FormGroup;
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  selectedRooms: Room[] = [];
  isRoomListVisible: boolean = false;

  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private roomService: RoomService,
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

  ngOnInit(): void {
    this.getAvailableRooms();
    this.reservationForm.get('newRoom')?.valueChanges.subscribe(value => {
      this.filterRooms(value);
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

  addRoom(room: Room): void {
    this.isRoomListVisible = false;
    if (!this.selectedRooms.includes(room)) {
      this.selectedRooms.push(room);
      this.reservationForm.get('newRoom')?.setValue('');
      const roomsArray = this.reservationForm.get('roomIds') as FormArray;
      roomsArray.push(this.fb.control(room.id));
      this.isRoomListVisible = false;
      this.rooms = this.rooms.filter(r => r !== room);
      this.filteredRooms = this.rooms;
    }
  }

  removeRoom(room: Room): void {
    const roomsArray = this.reservationForm.get('roomIds') as FormArray;
    const roomArrayValue = roomsArray.value;
    const index = roomArrayValue.indexOf(room.id);
    roomsArray.removeAt(index);
    this.selectedRooms = this.selectedRooms.filter(r => r !== room);
    this.rooms.push(room);
  }

  cancelCreation() {
    this.router.navigate(['/view-reservations']);
  }

  getAvailableRooms(): void {
    this.roomService.getRooms().subscribe({
      next: (rooms) => {
        this.rooms = rooms.data.filter(room => room.status == "AVAILABLE");
        this.filteredRooms = this.rooms;
      },
      error: (error) => {
        console.error('Error fetching rooms:', error);
      }
    });
  }

  filterRooms(query: string): void {
    if (!query) {
      this.filteredRooms = this.rooms;
    } else {
      this.filteredRooms = this.rooms.filter(room =>
        room.roomNumber.toLowerCase().includes(query.toLowerCase()) ||
        room.type.toLowerCase().includes(query.toLowerCase()) ||
        room.price.toString().includes(query.toLowerCase())
      );
    }
  }
}
