import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingParent } from './existing-parent';

describe('ExistingParent', () => {
  let component: ExistingParent;
  let fixture: ComponentFixture<ExistingParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExistingParent],
    }).compileComponents();

    fixture = TestBed.createComponent(ExistingParent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
