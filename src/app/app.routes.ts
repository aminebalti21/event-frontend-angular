import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { RouterModule } from '@angular/router';
import { EditEventComponent } from './edit-event/edit-event.component';
import { EventManagementComponent } from './event-management/event-management.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';


export const routes: Routes = [
        { path: 'register', component: RegisterComponent },
        { path: 'login', component: LoginComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        { path: 'event-management', component: EventManagementComponent }, // Par défaut, redirige vers l'inscription
        { path: 'event/edit/:id', component: EditEventComponent }
];
