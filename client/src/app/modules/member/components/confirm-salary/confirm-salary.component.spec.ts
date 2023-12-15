import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmSalaryComponent } from './confirm-salary.component';

describe('ConfirmSalaryComponent', () => {
  let component: ConfirmSalaryComponent;
  let fixture: ComponentFixture<ConfirmSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmSalaryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
