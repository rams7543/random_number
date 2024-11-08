import { Component, OnDestroy, signal, WritableSignal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnDestroy {
  title = 'Random Number Generator';

  favoriteNumbersList:  number[] = Array.from({ length: 10 }).map((value: any, index: number) => index);
  randomForm: FormGroup;
  randomNumber: WritableSignal<string> = signal('');
  intervalSubscription: Subscription = Subscription.EMPTY;
  timers: number = 0;

  constructor() {
    this.randomForm = new FormGroup({
      favorite : new FormControl(null,   [Validators.required]),
      numberLength : new FormControl(null,[Validators.required, Validators.min(1)])
     });
  }

  formSubmit(formData: any) : void {
    this.generateRandomNumber(formData);
    this.intervalSubscription.unsubscribe();
    this.intervalSubscription = interval(5000).subscribe(() => this.generateRandomNumber(formData));
  }

  generateRandomNumber(formData: any): void {
    const numLength: number = formData.numberLength ?? 1;
    const randomDigits: string = Array.from({ length: numLength - 1 }, () => Math.floor(Math.random() * 10)).join('');
    this.randomNumber.set(randomDigits + formData.favorite);
}

ngOnDestroy(): void {
  this.intervalSubscription.unsubscribe();
}

}
