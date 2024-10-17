import { Injectable } from '@angular/core';
import * as introJs from 'intro.js/intro.js';

export interface IntroStep {
  element: string;
  intro: string;
}

@Injectable({
  providedIn: 'root'
})
export class IntroService {
  startIntro(steps: IntroStep[]) {
    const intro = introJs();
    intro.setOptions({ steps });
    intro.start();
  }
}
