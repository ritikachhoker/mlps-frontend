import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessVisitor } from './business-visitor';

describe('BusinessVisitor', () => {
  let component: BusinessVisitor;
  let fixture: ComponentFixture<BusinessVisitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BusinessVisitor],
    }).compileComponents();

    fixture = TestBed.createComponent(BusinessVisitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
