import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReportComponent } from './report.component';
import { By } from '@angular/platform-browser';

describe('ReportComponent', () => {
  let component: ReportComponent;
  let fixture: ComponentFixture<ReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportComponent]  // Import instead of declare
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render step 1 correctly', () => {
    const step1Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[0].nativeElement;
    expect(step1Element.textContent.trim()).toBe('1.Click on the "Upload a File" button');
  });

  it('should render step 2 correctly', () => {
    const step2Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[1].nativeElement;
    expect(step2Element.textContent.trim()).toBe('2. Click on the "Upload a File" pane');
  });

  it('should render step 3 correctly', () => {
    const step3Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[2].nativeElement;
    expect(step3Element.textContent.trim()).toBe('3.Click "Press here to upload a file" icon');
  });

  it('should render step 4 correctly', () => {
    const step4Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[3].nativeElement;
    expect(step4Element.textContent.trim()).toBe('4. Select the file you want to upload');
  });

  it('should render step 5 correctly', () => {
    const step5Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[4].nativeElement;
    expect(step5Element.textContent.trim()).toBe('5. Click on the "Open" button after selecting a file to Upload');
  });

  it('should render step 6 correctly', () => {
    const step6Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[5].nativeElement;
    expect(step6Element.textContent.trim()).toBe("6. The uploaded File's Analysis");
  });

  it('should render step 7 correctly', () => {
    const step7Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[6].nativeElement;
    expect(step7Element.textContent.trim()).toBe('7. After you click the inbox button');
  });

  it('should render step 8 correctly', () => {
    const step8Element = fixture.debugElement.queryAll(By.css('h3.text-3xl'))[7].nativeElement;
    expect(step8Element.textContent.trim()).toBe('8. This is what you will see when you click on the FAQ');
  });

  it('should render images correctly', () => {
    const images = fixture.debugElement.queryAll(By.css('img'));
    expect(images.length).toBe(8); // Make sure there are 8 images
    images.forEach((img, index) => {
      expect(img.nativeElement.src).toContain('assets/images/Help/');
      expect(img.nativeElement.alt).toBe('image description');
    });
  });
});
