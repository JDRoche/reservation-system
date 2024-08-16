import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../services/reservation/reservation.service';
import { ToastrService } from 'ngx-toastr';
import { Room } from '../../models/Room';
import { RoomService } from '../../services/room/room.service';

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
  rooms: Room[] = [];
  filteredRooms: Room[] = [];
  selectedRooms: Room[] = [];
  isRoomListVisible: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private roomService: RoomService,
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
    this.getAvailableRooms();
    this.reservationForm.get('newRoom')?.valueChanges.subscribe(value => {
      this.filterRooms(value);
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

        this.selectedRooms = reservation.data.rooms;

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
