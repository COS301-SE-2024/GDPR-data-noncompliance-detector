import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {WalkthroughService} from './services/walkthrough.service'
import * as introJs from 'intro.js/intro.js';
import { Subscription } from 'rxjs';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
private walkthroughSubscription?: Subscription;

  title = "gnd-app";
  showQuestionIcon = true;

  constructor(private walkthroughService: WalkthroughService, private router: Router) {
  }

  toggleWalkthrough(){
    this.walkthroughService.requestwalkthrough();
  }
  ngOnInit():void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateQuestionIconVisibility(event.urlAfterRedirects);
      }
    });
    initFlowbite();
    const hasSeenIntro = localStorage.getItem('hasSeenIntro');
    if (!hasSeenIntro){
      setTimeout(()=>{
        this.startIntro()
        localStorage.setItem('hasSeenIntro', 'true');
      }, 1000);
    }
    this.walkthroughSubscription = this.walkthroughService.walkthroughRequested$.subscribe(()=>{
      this.startIntro();
    })
  }
  ngOnDestroy(){
    if(this.walkthroughSubscription)
      this.walkthroughSubscription.unsubscribe();
  }

  updateQuestionIconVisibility(currentUrl: string): void {
    const hideOnPages = ['/upload', '/report', '/faq-page']; 
    this.showQuestionIcon = !hideOnPages.includes(currentUrl);
  }

  startIntro() {
    const intro = introJs();
    intro.setOptions({
      steps: [
        // {
        //   element: '#home',
        //   intro: 'This button will always navigate you back to the home page'
        // },
        // // {
        // //   element: '#InboxButton',
        // //   intro: 'Click here to see all the new attachments in the received inbox'
        // // },
        // {
        //   element: '#help',
        //   intro: 'This button will navigate you to the help page. Where you will see how to use the app.'
        // },
        // {
        //   element: '#FAQ',
        //   intro: 'This button will navigate you to the FAQ page. Where you will see the most frequently asked questions.'
        // }

      ],
    });
    intro.start();
  }
}
