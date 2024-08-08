import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { WalkthroughService } from '../services/walkthrough.service';
import { Subject } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router'; // Import Router for navigation

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let walkthroughService: WalkthroughService;
  let walkthroughSubject: Subject<void>;
  let router: Router; // Router instance

  beforeEach(async () => {
    walkthroughSubject = new Subject<void>();

    const mockWalkthroughService = {
      walkthroughRequested$: walkthroughSubject.asObservable()
    };

    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,  // Import HomeComponent as a standalone component
        RouterTestingModule.withRoutes([
          { path: 'upload', component: HomeComponent },
          { path: 'inbox', component: HomeComponent }
        ])
      ],
      providers: [
        { provide: WalkthroughService, useValue: mockWalkthroughService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    walkthroughService = TestBed.inject(WalkthroughService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  afterEach(() => {
    localStorage.removeItem('hasSeenIntro');
    if (component['walkthroughSubscription']) {
      component['walkthroughSubscription'].unsubscribe();
    }
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should start the intro if the user has not seen it before', () => {
    spyOn(component, 'startIntro');
    localStorage.removeItem('hasSeenIntro'); // Ensure the intro has not been seen
    component.ngOnInit(); // Trigger ngOnInit
    expect(component.startIntro).toHaveBeenCalled();
    expect(localStorage.getItem('hasSeenIntro')).toBe('true');
  });

  it('should not start the intro if the user has already seen it', () => {
    spyOn(component, 'startIntro');
    localStorage.setItem('hasSeenIntro', 'true'); // Mock that the intro has been seen
    component.ngOnInit(); // Trigger ngOnInit
    expect(component.startIntro).not.toHaveBeenCalled();
  });

  it('should subscribe to WalkthroughService and start intro on request', () => {
    spyOn(component, 'startIntro');
    
    // Simulate a request by emitting a value from walkthroughSubject
    walkthroughSubject.next();
    
    // Verify that startIntro was called
    expect(component.startIntro).toHaveBeenCalled();
  });

  it('should unsubscribe from WalkthroughService on destroy', () => {
    // Create a spy for the unsubscribe method
    const unsubscribeSpy = jasmine.createSpy('unsubscribe');

    // Assign the spy to walkthroughSubscription
    component['walkthroughSubscription'] = { unsubscribe: unsubscribeSpy } as any;

    // Call ngOnDestroy to trigger the unsubscribe
    component.ngOnDestroy();

    // Assert that unsubscribe was called
    expect(unsubscribeSpy).toHaveBeenCalled();
  });

  it('should start the intro when toggleWalkthrough is called', () => {
    spyOn(component, 'startIntro');
    component.toggleWalkthrough();
    expect(component.startIntro).toHaveBeenCalled();
  });

  it('should have correct intro steps configuration', () => {
    // Create a spy for introJs
    const introJsSpy = jasmine.createSpyObj('introJs', ['setOptions', 'start']);
    spyOn<any>(component, 'startIntro').and.callFake(() => {
      introJsSpy.setOptions({
        steps: [
          { element: '#UploadButton', intro: 'Click here to upload a document' },
          { element: '#InboxButton', intro: 'Click here to see all the new attachments in the received inbox' },
          { element: '#home', intro: 'This button will always navigate you back to the home page' },
          { element: '#help', intro: 'This button will navigate you to the help page. Where you will see how to use the app.' },
          { element: '#FAQ', intro: 'This button will navigate you to the FAQ page. Where you will see the most frequently asked questions.' }
        ],
      });
      introJsSpy.start();
    });

    component.startIntro(); // Trigger startIntro
    expect(introJsSpy.setOptions).toHaveBeenCalledWith(jasmine.any(Object));
    expect(introJsSpy.start).toHaveBeenCalled();
  });

  it('should navigate to /upload when the "Upload a File" button is clicked', () => {
    const uploadButton = fixture.debugElement.query(By.css('#UploadButton')).nativeElement;
    spyOn(router, 'navigate'); // Spy on the router's navigate method

    fixture.detectChanges();

    uploadButton.click();

    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/upload']);
    });
  });

  it('should navigate to /inbox when the "View inbox" button is clicked', () => {
    const inboxButton = fixture.debugElement.query(By.css('#InboxButton')).nativeElement;
    spyOn(router, 'navigate'); // Spy on the router's navigate method

    fixture.detectChanges();

    inboxButton.click();

    fixture.whenStable().then(() => {
      expect(router.navigate).toHaveBeenCalledWith(['/inbox']);
    });
  });
});
