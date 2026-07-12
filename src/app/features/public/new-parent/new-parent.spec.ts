import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewParent } from './new-parent';

describe('NewParent', () => {
  let component: NewParent;
  let fixture: ComponentFixture<NewParent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewParent],
    }).compileComponents();

    fixture = TestBed.createComponent(NewParent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
