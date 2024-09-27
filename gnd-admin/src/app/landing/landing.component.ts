// import { Component,  OnInit  } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-landing',
//   standalone: true,
//   imports: [CommonModule, RouterModule],
//   templateUrl: './landing.component.html',
//   styleUrls: ['./landing.component.css']
// })
// export class LandingComponent implements OnInit {
//   constructor() {}

//   ngOnInit() {
    
//   }

  

  
// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  
  // Object to keep track of the expanded state of each card
  expandedCards: { [key: string]: boolean } = {};

  constructor() {}

  ngOnInit() {
    // Initialize all cards to be collapsed
    this.expandedCards = {
      gdpr1: false,
      gdpr2: false,
      gdpr3: false,
      gdpr4: false,
      gdpr5: false
    };
  }

  // Method to toggle the expansion of cards
  toggleExpand(cardId: string) {
    this.expandedCards[cardId] = !this.expandedCards[cardId];
  }
}
