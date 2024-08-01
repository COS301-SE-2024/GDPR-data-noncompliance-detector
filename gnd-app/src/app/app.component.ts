import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import {WalkthroughService} from './services/walkthrough.service'
import * as introJs from 'intro.js/intro.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = "gnd-app";

  constructor(private walkthroughService: WalkthroughService) {
  }

  toggleWalkthrough(){
    this.walkthroughService.requestwalkthrough();
  }
  ngOnInit():void {
    initFlowbite();
  }
}
