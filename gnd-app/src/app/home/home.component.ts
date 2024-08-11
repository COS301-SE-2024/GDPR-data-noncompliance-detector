import {Component, OnDestroy, OnInit} from '@angular/core';
import { RouterModule } from '@angular/router';
import * as introJs from 'intro.js/intro.js';
import {WalkthroughService} from '../services/walkthrough.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {
  private walkthroughSubscription?: Subscription;

  constructor(private walkthroughService: WalkthroughService) {
  }

  ngOnInit() {
    // Check if the user has seen the intro before
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro) {
      this.startIntro();
      // Mark that the user has seen the intro
      localStorage.setItem('hasSeenIntro', 'true');
    }
    this.walkthroughSubscription = this.walkthroughService.walkthroughRequested$.subscribe(()=>{
      this.startIntro();
    })
  }
  ngOnDestroy() {
    if(this.walkthroughSubscription)
      this.walkthroughSubscription.unsubscribe();
  }

  startIntro() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          element: '#UploadButton',
          intro: 'Click here to upload a document'
        },
        {
          element: '#InboxButton',
          intro: 'Click here to see all the new attachments in the received inbox'
        },
        {
          element: '#home',
          intro: 'This button will always navigate you back to the home page'
        },
        {
          element:'#upload-document',
          intro:'This button will navigate you to the upload document page. Where you can upload a document.'
        },
        {
          element: '#inbox',
          into: 'This button will navigate you to the inbox page. Where you can see all the attachments in the received inbox.'
        },
        {
          element: '#help',
          intro: 'This button will navigate you to the help page. Where you will see how to use the app.'
        },
        {
          element: '#FAQ',
          intro: 'This button will navigate you to the FAQ page. Where you will see the most frequently asked questions.'
        }
      ],
    });
    intro.start();
  }
  toggleWalkthrough() {
    this.startIntro();
  }
}

