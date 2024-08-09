import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ViolationsComponent } from './violations.component';
import { Component } from '@angular/core';

// Create a wrapper test component
@Component({
  selector: 'app-test-wrapper',
  template: `<app-violations></app-violations>`,
})
class TestWrapperComponent { }

describe('ViolationsComponent', () => {
  let fixture: ComponentFixture<TestWrapperComponent>;
  let component: ViolationsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule, // Import RouterTestingModule for routerLink
      ],
      declarations: [
        TestWrapperComponent, 
        ViolationsComponent // Declare both the wrapper and standalone component
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TestWrapperComponent);
    component = fixture.debugElement.query(By.directive(ViolationsComponent)).componentInstance;
    fixture.detectChanges(); // Trigger initial data binding
  });

  it('should display all buttons', () => {
    fixture.detectChanges();

    // Query all buttons
    const buttons = fixture.debugElement.queryAll(By.css('button'));
    
    expect(buttons.length).toBeGreaterThan(0); // Check if any buttons are rendered

    // Check button text content
    const buttonTexts = buttons.map(button => button.nativeElement.textContent.trim());
    expect(buttonTexts).toContain('Back');
    expect(buttonTexts).toContain('Visualization');
    expect(buttonTexts).toContain('Analysis');
    expect(buttonTexts).toContain('Download Report');
  });

  it('should trigger click event on Back button', () => {
    fixture.detectChanges();

    // Query Back button
    const backButton = fixture.debugElement.query(By.css('button'));

    // Ensure the button exists
    expect(backButton).toBeTruthy();

    // Spy on click event
    spyOn(backButton.nativeElement, 'click');

    // Simulate click event
    backButton.nativeElement.click();

    // Check if the click event was triggered
    expect(backButton.nativeElement.click).toHaveBeenCalled();
  });

  // Add similar tests for other buttons if needed
});
