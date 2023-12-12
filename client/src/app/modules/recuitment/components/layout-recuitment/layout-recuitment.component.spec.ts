import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutRecuitmentComponent } from './layout-recuitment.component';

describe('LayoutRecuitmentComponent', () => {
  let component: LayoutRecuitmentComponent;
  let fixture: ComponentFixture<LayoutRecuitmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LayoutRecuitmentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutRecuitmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
