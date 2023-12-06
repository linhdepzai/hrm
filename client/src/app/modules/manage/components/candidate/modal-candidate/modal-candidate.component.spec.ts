import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCandidateComponent } from './modal-candidate.component';

describe('ModalCandidateComponent', () => {
  let component: ModalCandidateComponent;
  let fixture: ComponentFixture<ModalCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModalCandidateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
