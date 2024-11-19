import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalculatorAppComponent } from './calculator-app.component';

describe('CalculatorAppComponent', () => {
  let component: CalculatorAppComponent;
  let fixture: ComponentFixture<CalculatorAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalculatorAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
