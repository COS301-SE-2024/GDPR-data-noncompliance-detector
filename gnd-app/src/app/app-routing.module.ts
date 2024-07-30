import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InboxComponent } from './inbox/inbox.component';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { ViolationsComponent } from './violations/violations.component';
import { FaqPageComponent } from './faq-page/faq-page.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'inbox', component: InboxComponent},
  { path: 'home', component: HomeComponent},
  { path: 'report', component: ReportComponent},
  { path: 'upload', component: UploadDocumentComponent},
  { path: 'violations/:fileType', component: ViolationsComponent}, 
  { path: 'violations', component: ViolationsComponent},
  { path: 'faq-page', component: FaqPageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
