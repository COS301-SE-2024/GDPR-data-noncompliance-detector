import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqPageComponent } from './faq-page.component';

describe('FaqPageComponent', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqPageComponent], // Change this to imports
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle dropdowns correctly', () => {
    // Initially, no dropdown is active
    expect(component.activeDropdown).toBeUndefined();

    // Toggle dropdown1
    component.toggleDropdown('dropdown1');
    expect(component.activeDropdown).toBe('dropdown1');

    // Toggle dropdown1 again (should close it)
    component.toggleDropdown('dropdown1');
    expect(component.activeDropdown).toBeUndefined();

    // Toggle dropdown2
    component.toggleDropdown('dropdown2');
    expect(component.activeDropdown).toBe('dropdown2');

    // Toggle dropdown1 (should close dropdown2)
    component.toggleDropdown('dropdown1');
    expect(component.activeDropdown).toBe('dropdown1');

    // Ensure dropdown2 is closed
    expect(component.activeDropdown).toBe('dropdown1');
  });

  it('should correctly render the FAQ titles', () => {
    const compiled = fixture.nativeElement;

    // Check if the header for GND FAQ is present
    expect(compiled.querySelector('.grid-gnd .header').textContent).toContain('GND FAQ');

    // Check if the header for GDPR FAQ is present
    expect(compiled.querySelector('.grid-gdpr .header').textContent).toContain('GDPR FAQ');
  });

  it('should show and hide dropdown content based on activeDropdown', () => {
    // Toggle dropdown1 to show it
    component.toggleDropdown('dropdown1');
    fixture.detectChanges();
    
    let dropdownContent = fixture.nativeElement.querySelector('#dropdown1');
    expect(dropdownContent.classList).toContain('show');

    // Toggle dropdown1 again to hide it
    component.toggleDropdown('dropdown1');
    fixture.detectChanges();

    dropdownContent = fixture.nativeElement.querySelector('#dropdown1');
    expect(dropdownContent.classList).not.toContain('show');
  });
});
