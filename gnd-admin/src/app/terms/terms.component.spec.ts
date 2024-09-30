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
    // Mock the document.getElementById method
    const modal = document.createElement('div');
    modal.id = 'termsModal';
    modal.style.display = 'block'; // Initially visible
    spyOn(document, 'getElementById').and.returnValue(modal);
  
    // Calling the closeModal function from the component
    component.closeModal();
  
    // Asserting that the modal's display is now 'none'
    expect(modal.style.display).toBe('none');
  });
  
  
  it('should not throw an error if modal is not found', () => {
    // No modal is present in the DOM
    expect(() => component.closeModal()).not.toThrow();
  });
});
