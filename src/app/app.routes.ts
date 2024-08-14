import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewReservationComponent } from './pages/new-reservation/new-reservation.component';
import { ModifyReservationComponent } from './pages/modify-reservation/modify-reservation.component';
import { CancelReservationComponent } from './pages/cancel-reservation/cancel-reservation.component';
import { ViewReservationsComponent } from './pages/view-reservations/view-reservations.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'view-reservations', component: ViewReservationsComponent },
    { path: 'create-reservation', component: NewReservationComponent },
    { path: 'modify-reservation', component: ModifyReservationComponent },
    { path: 'cancel-reservation', component: CancelReservationComponent },
    { path: '**', redirectTo: '' }
];
