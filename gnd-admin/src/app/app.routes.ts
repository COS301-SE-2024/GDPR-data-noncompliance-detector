import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { LandingComponent } from './landing/landing.component';
import {RegisterComponent} from './register/register.component';
import { TermsComponent } from './terms/terms.component';
import { AuthGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', component: LandingComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'landing', component: LandingComponent },
  {path: 'register', component: RegisterComponent},
  {path: 'terms', component: TermsComponent}

];