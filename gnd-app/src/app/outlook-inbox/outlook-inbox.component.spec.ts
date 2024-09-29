import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OutlookInboxComponent } from './outlook-inbox.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { WalkthroughService } from '../services/walkthrough.service';
import { ReportGenerationService } from '../services/report-generation.service';

describe('OutlookInboxComponent', () => {
  let component: OutlookInboxComponent;
  let fixture: ComponentFixture<OutlookInboxComponent>;
  let mockRouter: any;
  let mockWalkthroughService: any;
  let mockReportGenerationService: any;

  beforeEach(async () => {
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    
    // Mock the WalkthroughService with the observable.
    mockWalkthroughService = {
      walkthroughRequested$: of(true), // Provide a mock observable
    };
    
    mockReportGenerationService = jasmine.createSpyObj('ReportGenerationService', ['getSomeMethod']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        OutlookInboxComponent // Import the standalone component here
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: WalkthroughService, useValue: mockWalkthroughService },
        { provide: ReportGenerationService, useValue: mockReportGenerationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OutlookInboxComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize reports on ngOnInit', () => {
    const mockReports = [{ name: 'Report 1', modified: 1633072800 }];
    
    spyOn(component, 'getDataFolder').and.returnValue(of({ outlook_data_folder: '../backend/Reports' }));
    spyOn(component, 'fetchFiles').and.returnValue(of(mockReports));
    
    // Add this line to spy on getReports
    spyOn(component, 'getReports').and.callThrough(); // Use callThrough if you want to execute the original method

    component.ngOnInit();

    expect(component.path).toBe('../backend/Reports');
    expect(component.getReports).toHaveBeenCalled(); // This line should now work
    expect(component.reports.length).toBe(1);
    expect(component.reports[0].name).toBe('Report 1');
});

  it('should navigate to downloads when navigateToDownloads is called', () => {
    component.navigateToDownloads();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/inbox']);
  });

  it('should format the date correctly', () => {
    const date = new Date();
    const formattedDate = component.formatDate(date);
    const today = new Date();
    expect(formattedDate).toContain(today.getHours().toString().padStart(2, '0'));
    expect(formattedDate).toContain(today.getMinutes().toString().padStart(2, '0'));
  });

  it('should set document status correctly', () => {
    expect(component.docStatus(0.5)).toBe('Compliant');
    expect(component.docStatus(0.7)).toBe('Non-Compliant');
  });

  it('should set location status correctly', () => {
    expect(component.locationStatus(0)).toBe('Not EU');
    expect(component.locationStatus(1)).toBe('EU');
    expect(component.locationStatus(2)).toBe('Not Available');
  });

  afterEach(() => {
    fixture.destroy();
  });
});
