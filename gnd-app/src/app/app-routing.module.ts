import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { ViolationsComponent } from './violations/violations.component';

const routes: Routes = [
  { path: 'inbox', component: InboxComponent},
  { path: 'violations', component: ViolationsComponent } // route for violation page defined here
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
