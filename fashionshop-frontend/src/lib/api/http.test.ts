import { describe, expect, it } from 'vitest';
import { parseApiError } from './errors';

describe('parseApiError', () => {
  it('returns fallback message for unknown values', () => {
    expect(parseApiError(null).message).toBe('An unexpected error occurred');
  });

  it('extracts error message from an Error instance', () => {
    expect(parseApiError(new Error('boom')).message).toBe('boom');
  });

  it('extracts api message and code from axios-style error payload', () => {
    const parsed = parseApiError({
      message: 'Request failed with status code 401',
      response: {
        status: 401,
        data: {
          code: 'ACCOUNT_DELETED',
          message: 'Tài khoản đã bị xóa',
        },
      },
    });

    expect(parsed.status).toBe(401);
    expect(parsed.code).toBe('ACCOUNT_DELETED');
    expect(parsed.message).toBe('Tài khoản đã bị xóa');
  });
});
