import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { loggedinguardGuard } from './loggedinguard.guard';

describe('loggedinguardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => loggedinguardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
