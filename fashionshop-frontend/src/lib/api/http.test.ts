import { describe, expect, it } from 'vitest';
import { parseApiError } from './errors';

describe('parseApiError', () => {
  it('returns fallback message for unknown values', () => {
    expect(parseApiError(null).message).toBe('An unexpected error occurred');
  });

  it('extracts error message from an Error instance', () => {
    expect(parseApiError(new Error('boom')).message).toBe('boom');
  });
});
