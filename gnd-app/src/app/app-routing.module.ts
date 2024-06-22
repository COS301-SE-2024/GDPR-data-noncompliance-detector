import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { ViolationsComponent } from './violations/violations.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'inbox', component: InboxComponent},
  { path: 'home', component: HomeComponent},
  { path: 'report', component: ReportComponent},
  { path: 'upload', component: UploadDocumentComponent},
  { path: 'violations/:fileType', component: ViolationsComponent}, //updated route for getting the email type
  {path: 'violations', component: ViolationsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }