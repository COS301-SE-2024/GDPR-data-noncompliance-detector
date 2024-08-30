import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

 export class AppComponent implements OnInit {
    title = 'gnd-admin';

    ngOnInit(): void {
      initFlowbite();
    }
  }
