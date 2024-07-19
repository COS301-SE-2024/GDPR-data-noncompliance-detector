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
          element: '#Help',
          intro: 'Click here to go to the help page on how to use the app'
        },
        {
          element: '#uploadButton',
          intro: 'Click here to start uploading documents'
        }
      ],
    });
    intro.start();
  }
  toggleWalkthrough() {
    this.startIntro();
  }
}

