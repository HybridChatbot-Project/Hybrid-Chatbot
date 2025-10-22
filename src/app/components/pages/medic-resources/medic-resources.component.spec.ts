import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicResourcesComponent } from './medic-resources.component';

describe('MedicResourcesComponent', () => {
  let component: MedicResourcesComponent;
  let fixture: ComponentFixture<MedicResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
