import { TestBed } from '@angular/core/testing';

import { Tokeninterceptor } from './token.interceptor';

describe('TokeninterceptorInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      Tokeninterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: Tokeninterceptor = TestBed.inject(Tokeninterceptor);
    expect(interceptor).toBeTruthy();
  });
});
