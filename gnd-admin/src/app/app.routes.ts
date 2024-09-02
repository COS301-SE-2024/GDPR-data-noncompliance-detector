import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import {LandingComponent}  from "./landing/landing.component";
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

// @NgModule({
//   imports: [CommonModule, FormsModule],
//   declarations: [HomeComponent, LoginComponent, LandingComponent]
// })
// export class AppModule {}

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
];
