import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetecImagePage } from './detec-image.page';

describe('DetecImagePage', () => {
  let component: DetecImagePage;
  let fixture: ComponentFixture<DetecImagePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DetecImagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
