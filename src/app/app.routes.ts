import { Component, NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { LoginComponent } from './login/login.component';
import { ParticipantComponent } from './participant/participant.component';
import { PaymentCancelComponent } from './payment-cancel/payment-cancel.component';
import { PaymentSuccessComponent } from './payment-success/payment-success.component';
import { PaymentComponent } from './payment/payment.component';
import { RegisterParticipantComponent } from './register-participant/register-participant.component';
import { RegisterComponent } from './register/register.component';
import { ListOrgComponent } from './list-org/list-org.component';


export const routes: Routes = [
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'event-management', component: EventManagementComponent },
        {path:'list', component:ListOrgComponent}, // Par défaut, redirige vers l'inscription
        { path: 'event/edit/:id', component: EditEventComponent },
        { path: 'events', component: EventListComponent },
        {path: 'participant' , component:ParticipantComponent},
        {path:'payment' ,component:PaymentComponent},
        {path:'register-participant' ,component:RegisterParticipantComponent},
        { path: 'payment-success', component: PaymentSuccessComponent },
        { path: 'payment-cancel', component: PaymentCancelComponent },
];
