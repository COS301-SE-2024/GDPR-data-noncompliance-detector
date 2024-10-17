import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { WalkthroughService } from '../services/walkthrough.service';
import { IntroService, IntroStep } from '../services/intro.service';
import { Subscription, Subject } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let mockWalkthroughService: Partial<WalkthroughService>;
  let mockIntroService: jasmine.SpyObj<IntroService>;
  let walkthroughSubject: Subject<void>;

  const expectedSteps: IntroStep[] = [
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
      element: '#upload-document',
      intro: 'This button will navigate you to the upload document page. Where you can upload a document.'
    },
    {
      element: '#inbox',
      intro: 'This button will navigate you to the inbox page. Where you can see all the attachments in the received inbox.'
    },
    {
      element: '#help',
      intro: 'This button will navigate you to the help page. Where you will see how to use the app.'
    },
    {
      element: '#FAQ',
      intro: 'This button will navigate you to the FAQ page. Where you will see the most frequently asked questions.'
    }
  ];

  beforeEach(async () => {
    walkthroughSubject = new Subject<void>();

    mockWalkthroughService = {
      walkthroughRequested$: walkthroughSubject.asObservable()
    };

    mockIntroService = jasmine.createSpyObj('IntroService', ['startIntro']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [
        { provide: WalkthroughService, useValue: mockWalkthroughService },
        { provide: IntroService, useValue: mockIntroService },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    //Mock localStorage.getItem
    spyOn(localStorage, 'getItem').and.callFake((key: string) => {
      if (key === 'hasSeenIntro') {
        return null; // Intro has not been seen
      }
      return null;
    });

    spyOn(localStorage, 'setItem').and.callFake(() => {});


    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component['walkthroughSubscription']) {
      component['walkthroughSubscription'].unsubscribe();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should start intro and set localStorage if intro has not been seen', () => {
      expect(mockIntroService.startIntro).toHaveBeenCalledWith(expectedSteps);

      expect(localStorage.setItem).toHaveBeenCalledWith('hasSeenIntro', 'true');
    });
  });

  describe('WalkthroughService Subscription', () => {
    it('should start intro when walkthroughRequested$ emits', () => {
      walkthroughSubject.next();
      expect(mockIntroService.startIntro).toHaveBeenCalledWith(expectedSteps);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from walkthroughSubscription', () => {
      const unsubscribeSpy = spyOn(component['walkthroughSubscription'] as Subscription, 'unsubscribe');

      component.ngOnDestroy();

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('toggleWalkthrough', () => {
    it('should start intro when toggleWalkthrough is called', () => {
      component.toggleWalkthrough();
      expect(mockIntroService.startIntro).toHaveBeenCalledWith(expectedSteps);
    });
  });
});

