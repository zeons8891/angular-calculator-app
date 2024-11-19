import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CalculatorAppComponent } from './calculator-app/calculator-app.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,CalculatorAppComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'angular-calculator-app';
}
