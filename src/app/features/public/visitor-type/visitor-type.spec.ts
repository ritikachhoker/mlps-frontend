import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitorType } from './visitor-type';

describe('VisitorType', () => {
  let component: VisitorType;
  let fixture: ComponentFixture<VisitorType>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitorType],
    }).compileComponents();

    fixture = TestBed.createComponent(VisitorType);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
