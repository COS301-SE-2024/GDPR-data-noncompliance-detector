import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LandingComponent } from './landing.component';
import { By } from '@angular/platform-browser';

describe('LandingComponent', () => {
  let component: LandingComponent;
  let fixture: ComponentFixture<LandingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LandingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

    it('should display the main heading', () => {
    const headingElement = fixture.debugElement.query(By.css('.hero-section h1')).nativeElement;
    expect(headingElement.textContent).toContain('Welcome to GDPR Compliance Dashboard');
  });

    it('should display the call to action button with correct text and link', () => {
    const buttonElement = fixture.debugElement.query(By.css('.cta-button')).nativeElement;
    expect(buttonElement.textContent).toBe('Get Started');
    expect(buttonElement.getAttribute('href')).toBe('/register');
  });

  it('should display the correct feature titles', () => {
    const featureElements = fixture.debugElement.queryAll(By.css('.features-section .feature h2'));
    expect(featureElements.length).toBe(3);

    const titles = featureElements.map(el => el.nativeElement.textContent.trim());
    expect(titles).toEqual([
      'Enhanced Security',
      'Comprehensive Analytics',
      'Automated Compliance'
    ]);
  });

  it('should display GDPR information cards', () => {
    const gdprCards = fixture.debugElement.queryAll(By.css('.gdpr-card h3'));
    expect(gdprCards.length).toBe(5);

    const cardTitles = gdprCards.map(el => el.nativeElement.textContent.trim());
    expect(cardTitles).toEqual([
      'What is GDPR?',
      'Key Principles of GDPR',
      'Why is GDPR Important for Companies?',
      'Impact on Businesses Globally',
      'Non-Compliance Penalties'
    ]);
  });

  it('should display the CTA section with correct heading and button text', () => {
    const ctaHeading = fixture.debugElement.query(By.css('.cta-section h2')).nativeElement;
    expect(ctaHeading.textContent).toContain('Ready to Monitor your GDPR compliance Desktop App?');

    const ctaButton = fixture.debugElement.query(By.css('.cta-section .cta-button')).nativeElement;
    expect(ctaButton.textContent).toBe('Sign Up Now');
    expect(ctaButton.getAttribute('href')).toBe('/register');
  });

});
