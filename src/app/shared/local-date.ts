const DATE_INPUT_FORMAT = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * Converts a date input's value (`yyyy-mm-dd`, a day in the user's calendar) to the UTC instant of
 * that day's local midnight, e.g. `2026-01-15` in India becomes `2026-01-14T18:30:00.000Z`.
 * The API stores instants in UTC, so the entry shows on the same day when read back in this time zone.
 * @param value The date input's value.
 * @returns The ISO-8601 UTC timestamp.
 * @throws RangeError When `value` is not a `yyyy-mm-dd` date.
 */
export function localDateToUtcIso(value: string): string {
  const match = DATE_INPUT_FORMAT.exec(value);
  if (!match) {
    throw new RangeError(`Expected a yyyy-mm-dd date, got "${value}".`);
  }
  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day)).toISOString();
}

/**
 * Today's date in the user's calendar, formatted for a date input's `max` attribute.
 */
export function todayForDateInput(): string {
  const now = new Date();
  const pad = (part: number) => String(part).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}
