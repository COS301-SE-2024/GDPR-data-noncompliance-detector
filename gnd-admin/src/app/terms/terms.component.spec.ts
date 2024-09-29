import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TermsComponent } from './terms.component';

describe('TermsComponent', () => {
  let component: TermsComponent;
  let fixture: ComponentFixture<TermsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should close the modal when closeModal is called', () => {
    // Set up a mock modal element in the document
    const modal = document.createElement('div');
    modal.id = 'termsModal';
    modal.style.display = 'block'; // Initially, the modal is visible
    document.body.appendChild(modal);
  
    // Call the closeModal function
    component.closeModal();
  
    // Detect changes to ensure the DOM updates are processed
    fixture.detectChanges();
  
    // Check that the modal's display is set to 'none'
    expect(modal.style.display).toBe('none');
  
    // Clean up after the test
    document.body.removeChild(modal);
  });

  it('should not throw an error if modal is not found', () => {
    // No modal is present in the DOM
    expect(() => component.closeModal()).not.toThrow();
  });
});
