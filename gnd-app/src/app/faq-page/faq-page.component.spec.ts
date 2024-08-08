import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FaqPageComponent } from './faq-page.component';
import { By } from '@angular/platform-browser';

describe('FAQPageComponent', () => {
  let component: FaqPageComponent;
  let fixture: ComponentFixture<FaqPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqPageComponent] // Import the standalone FAQPageComponent
    }).compileComponents();

    fixture = TestBed.createComponent(FaqPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the FAQ header correctly', () => {
    const headerElement = fixture.debugElement.query(By.css('.header')).nativeElement;
    expect(headerElement.textContent).toContain('FAQ');
  });

  it('should render GND FAQ section', () => {
    const gndFaqHeader = fixture.debugElement.query(By.css('.grid-gnd h1')).nativeElement;
    expect(gndFaqHeader.textContent).toContain('GND FAQ');
    
    const gndFaqQuestions = fixture.debugElement.queryAll(By.css('.grid-gnd h3'));
    expect(gndFaqQuestions.length).toBeGreaterThan(0); // Ensure there are FAQ questions
  });

  it('should render GDPR FAQ section', () => {
    const gdprFaqHeader = fixture.debugElement.query(By.css('.grid-gdpr h1')).nativeElement;
    expect(gdprFaqHeader.textContent).toContain('GDPR FAQ');
    
    const gdprFaqQuestions = fixture.debugElement.queryAll(By.css('.grid-gdpr h3'));
    expect(gdprFaqQuestions.length).toBeGreaterThan(0); // Ensure there are GDPR FAQ questions
  });

  it('should have the correct HTML structure for GND FAQ section', () => {
    const faqSection = fixture.debugElement.query(By.css('.grid-gnd'));
    expect(faqSection).toBeTruthy();

    const headings = faqSection.queryAll(By.css('h3'));
    expect(headings.length).toBeGreaterThan(0);
    
    const paragraphs = faqSection.queryAll(By.css('p'));
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it('should have the correct HTML structure for GDPR FAQ section', () => {
    const faqSection = fixture.debugElement.query(By.css('.grid-gdpr'));
    expect(faqSection).toBeTruthy();

    const headings = faqSection.queryAll(By.css('h3'));
    expect(headings.length).toBeGreaterThan(0);
    
    const paragraphs = faqSection.queryAll(By.css('p'));
    expect(paragraphs.length).toBeGreaterThan(0);
  });

  it('should contain the question "What is GND?" in the GND FAQ section', () => {
    const questionElement = fixture.debugElement.query(By.css('.grid-gnd h3')).nativeElement;
    expect(questionElement.textContent).toContain('What is GND?');
  });

  it('should contain the question "What is GDPR?" in the GDPR FAQ section', () => {
    const questionElement = fixture.debugElement.query(By.css('.grid-gdpr h3')).nativeElement;
    expect(questionElement.textContent).toContain('What is GDPR?');
  });
});
