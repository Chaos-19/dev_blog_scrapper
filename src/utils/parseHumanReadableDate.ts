import logger from "./logger.js"

/**
 * Converts a human-readable date like "Jul 12 (2 days ago)" to a Date object or ISO string.
 * Assumes current year if year is not provided.
 *
 * @param input - A string like "Jul 12 (2 days ago)"
 * @param options - Optional: { returnISO: boolean, yearOverride: number }
 * @returns Date object or ISO string
 */
export function parseHumanReadableDate(
  input: string,
  options?: { returnISO?: boolean; yearOverride?: number }
): Date | string {
  const { returnISO = false, yearOverride } = options || {};

  // Extract the month and day from "Jul 12 (2 days ago)"
  const match = input.match(/^([A-Za-z]{3})\s+(\d{1,2})/);
  if (!match) throw new Error(`Invalid date format: ${input}`);

  const [, monthStr, dayStr] = match;
  const year = yearOverride ?? new Date().getFullYear(); // Use current year if not provided

  // Create date string: e.g., "Jul 12 2025"
  const fullDateStr = `${monthStr} ${dayStr} ${year}`;

  // Parse to Date object
  const date = new Date(fullDateStr);

  if (isNaN(date.getTime())) {
    logger.info(`Unable to parse date: ${fullDateStr}`);
    throw new Error(`Unable to parse date: ${fullDateStr}`);
  }

  return returnISO ? date.toISOString() : date;
}
