import { localDateToUtcIso, todayForDateInput } from './local-date';

describe('localDateToUtcIso', () => {
  it('should convert a calendar day to the UTC instant of its local midnight', () => {
    const iso = localDateToUtcIso('2026-01-15');

    expect(iso).toBe(new Date(2026, 0, 15).toISOString());
    const readBack = new Date(iso);
    expect([readBack.getFullYear(), readBack.getMonth(), readBack.getDate()]).toEqual([2026, 0, 15]);
  });

  it.each(['', '15/01/2026', '2026-1-5'])('should reject "%s"', value => {
    expect(() => localDateToUtcIso(value)).toThrow(RangeError);
  });
});

describe('todayForDateInput', () => {
  it('should format today in the local calendar as yyyy-mm-dd', () => {
    const now = new Date();

    expect(todayForDateInput()).toBe(
      `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`);
  });
});
