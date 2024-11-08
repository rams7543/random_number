import { ComponentFixture, discardPeriodicTasks, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let component: AppComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppModule],
      declarations: [AppComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title as "Random Number Generator"', () => {
    expect(component.title).toBe('Random Number Generator');
  });

  it('should initialize randomForm with default values', () => {
    expect(component.randomForm.value).toEqual({ favorite: null, numberLength: null });
  });

  it('should generate random numbers on form submit', () => {
    component.randomForm.setValue({ favorite: 5, numberLength: 3 });
    component.formSubmit(component.randomForm.value);
    expect(component.randomNumber().length).toBe(3);
    expect(component.randomNumber().endsWith('5')).toBeTrue();
  });

  it('should call generateRandomNumbers on form submit', fakeAsync(() => {
    const spy = spyOn(component, 'generateRandomNumber').and.callThrough();
    component.formSubmit(component.randomForm.value);
    tick(5000);
    discardPeriodicTasks();
    expect(spy).toHaveBeenCalledTimes(2);
  }));

  it('should unsubscribe from previous interval on form submit', () => {
    const spy = spyOn(component.intervalSubscription, 'unsubscribe').and.callThrough();
    component.formSubmit(component.randomForm.value);
    expect(spy).toHaveBeenCalled();
  });

  it('should set up a new interval subscription on form submit', () => {
    component.formSubmit(component.randomForm.value);
    expect(component.intervalSubscription.closed).toBeFalse();
  });

  it('should unsubscribe from interval on destroy', () => {
    spyOn(component.intervalSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.intervalSubscription.unsubscribe).toHaveBeenCalled();
  });
});
