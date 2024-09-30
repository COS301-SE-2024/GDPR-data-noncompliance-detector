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
import { FaqPageComponent } from './faq-page/faq-page.component';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { OutlookInboxComponent } from './outlook-inbox/outlook-inbox.component';



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
      FaqPageComponent,
      HttpClientModule,
      OutlookInboxComponent
  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
