    // import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
    // import { provideRouter } from '@angular/router';
    
    
    // import { routes } from './app.routes';
    
    // export const appConfig: ApplicationConfig = {
    
    //   providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes)]
    // };
    import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
    import { provideRouter } from '@angular/router';
    import { LocationStrategy, PathLocationStrategy } from '@angular/common';  // Import these
    
    import { routes } from './app.routes';
    
    export const appConfig: ApplicationConfig = {
      providers: [
        provideZoneChangeDetection({ eventCoalescing: true }),
        provideRouter(routes),
        { provide: LocationStrategy, useClass: PathLocationStrategy }  // Provide PathLocationStrategy here
      ]
    };
    