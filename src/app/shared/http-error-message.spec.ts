import { HttpErrorResponse } from '@angular/common/http';

import { describeHttpError } from './http-error-message';

describe('describeHttpError', () => {
  const fallback = 'Something went wrong.';
  const httpError = (status: number, error: unknown = null) => new HttpErrorResponse({ status, error });

  it('should leave 401s to the auth interceptor', () => {
    expect(describeHttpError(httpError(401), fallback)).toBeNull();
  });

  it('should explain an unreachable server', () => {
    expect(describeHttpError(httpError(0), fallback)).toContain('Can\'t reach the server');
  });

  it('should list the field messages of a Web API validation response', () => {
    const body = {
      Message: 'The request is invalid.',
      ModelState: {
        'oFuelDetail.TotalPrice': ['TotalPrice must be greater than 0.'],
        'oFuelDetail.MeterReading': ['', 'MeterReading must be a positive whole number.']
      }
    };

    expect(describeHttpError(httpError(400, body), fallback))
      .toBe('TotalPrice must be greater than 0. MeterReading must be a positive whole number.');
  });

  it('should use the message of a 400 without field errors', () => {
    expect(describeHttpError(httpError(400, { Message: 'A fuel detail is required.' }), fallback))
      .toBe('A fuel detail is required.');
  });

  it('should fall back for other failures', () => {
    expect(describeHttpError(httpError(500, { Message: 'An error has occurred.' }), fallback)).toBe(fallback);
    expect(describeHttpError(httpError(400, 'plain text'), fallback)).toBe(fallback);
    expect(describeHttpError(new Error('not HTTP'), fallback)).toBe(fallback);
  });
});
