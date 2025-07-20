import { parseHumanReadableDate } from '../../utils/parseHumanReadableDate.js';

describe('parseHumanReadableDate', () => {
  it('should correctly parse a human-readable date string', () => {
    const date = parseHumanReadableDate("Jul 12 (2 days ago)") as Date;
    expect(date.getMonth()).toBe(6); // 0-indexed month
    expect(date.getDate()).toBe(12);
  });

  it('should return an ISO string when returnISO is true', () => {
    const isoString = parseHumanReadableDate("Jul 12 (2 days ago)", { returnISO: true });
    expect(typeof isoString).toBe('string');
    expect(isoString).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/);
  });

  it('should use the current year by default', () => {
    const date = parseHumanReadableDate("Jan 1") as Date;
    expect(date.getFullYear()).toBe(new Date().getFullYear());
  });

  it('should use the year override when provided', () => {
    const date = parseHumanReadableDate("Jan 1", { yearOverride: 2023 }) as Date;
    expect(date.getFullYear()).toBe(2023);
  });

  it('should throw an error for an invalid date format', () => {
    expect(() => parseHumanReadableDate("Invalid Date")).toThrow('Invalid date format: Invalid Date');
  });
});
