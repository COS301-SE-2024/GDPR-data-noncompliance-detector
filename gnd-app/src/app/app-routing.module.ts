import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { ViolationsComponent } from './violations/violations.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';

const routes: Routes = [
  { path: 'inbox', component: InboxComponent},
  {path: 'home', component: HomeComponent},
  {path: 'report', component: ReportComponent},
  {path: 'upload', component: UploadDocumentComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
