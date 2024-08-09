import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { InboxComponent } from './inbox.component';
import { WalkthroughService } from '../services/walkthrough.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('InboxComponent', () => {
  let component: InboxComponent;
  let fixture: ComponentFixture<InboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        InboxComponent
      ],
      providers: [
        { provide: WalkthroughService, useValue: { walkthroughRequested$: of(null) } },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  // Test for "Download Report" Button
  it('should display Download Report button', () => {
    component.currentAnalysis = {}; // Ensure the button is visible
    fixture.detectChanges();

    const downloadButton = fixture.debugElement.query(By.css('button'));
    if (downloadButton) {
      expect(downloadButton.nativeElement.textContent.trim()).toBe('Download Report');
    } else {
      fail('Download Report button not found');
    }
  });

  // Test for "Clear" Button
  it('should call clearAnalysis() on Clear button click', () => {
    spyOn(component, 'clearAnalysis');
    component.currentAnalysis = {}; // Ensure the button is visible
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('button'));
    if (clearButton && clearButton.nativeElement.textContent.trim() === 'Clear') {
      clearButton.nativeElement.click();
      expect(component.clearAnalysis).toHaveBeenCalled();
    } else {
      fail('Clear button not found');
    }
  });

  // Test for "Violations" Button
  it('should display Violations button', () => {
    component.currentAnalysis = {}; // Ensure the button is visible
    fixture.detectChanges();

    const violationsButton = fixture.debugElement.query(By.css('button'));
    if (violationsButton) {
      expect(violationsButton.nativeElement.textContent.trim()).toBe('Violations');
    } else {
      fail('Violations button not found');
    }
  });

  // Test for "Visualisations" Button
  it('should display Visualisations button', () => {
    component.currentAnalysis = {}; // Ensure the button is visible
    fixture.detectChanges();

    const visualisationsButton = fixture.debugElement.query(By.css('button'));
    if (visualisationsButton) {
      expect(visualisationsButton.nativeElement.textContent.trim()).toBe('Visualisations');
    } else {
      fail('Visualisations button not found');
    }
  });
});
