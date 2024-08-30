import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { initFlowbite } from 'flowbite';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

 export class AppComponent implements OnInit {
    title = 'gnd-admin';
  
    ngOnInit(): void {
      initFlowbite();
    }
  }
