import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentRequestDetails } from './agent-request-details';

describe('AgentRequestDetails', () => {
  let component: AgentRequestDetails;
  let fixture: ComponentFixture<AgentRequestDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentRequestDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentRequestDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
