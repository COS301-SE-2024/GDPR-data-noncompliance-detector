import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InboxComponent } from './inbox/inbox.component';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home/home.component';
import { ReportComponent } from './report/report.component';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { ViolationsComponent } from './violations/violations.component';



@NgModule({
  declarations: [
    AppComponent,    
    ViolationsComponent,
    ],
    imports: [
      BrowserModule,
      AppRoutingModule,
      CommonModule,
      InboxComponent,
      HomeComponent,
      ReportComponent,
      UploadDocumentComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
