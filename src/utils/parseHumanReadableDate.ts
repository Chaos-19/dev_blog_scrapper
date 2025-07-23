import logger from "./logger.js";

/**
 * Converts a human-readable date like "Jul 12 (2 days ago)" or relative times like "33 seconds ago" to a Date object or ISO string.
 * Assumes current year if year is not provided.
 *
 * @param input - A string like "Jul 12 (2 days ago)", "Jul 21 (33 seconds ago)", or "33 seconds ago"
 * @param options - Optional: { returnISO: boolean, yearOverride: number }
 * @returns Date object or ISO string
 */
export function parseHumanReadableDate(
  input: string,
  options?: { returnISO?: boolean; yearOverride?: number }
): Date | string {
  const { returnISO = false, yearOverride } = options || {};
  const now = new Date();
  const year = yearOverride ?? now.getFullYear();

  // Helper to validate and create Date object
  const createDate = (year: number, month: number, day: number): Date => {
    const date = new Date(year, month, day);
    if (
      isNaN(date.getTime()) ||
      date.getMonth() !== month ||
      date.getDate() !== day
    ) {
      logger.error(`Unable to parse date: ${year}-${month + 1}-${day}`);
      throw new Error(`Unable to parse date: ${year}-${month + 1}-${day}`);
    }
    return date;
  };

  // Handle relative time formats (e.g., "33 seconds ago", "2 days ago")
  const relativeMatch = input.match(
    /(\d+)\s*(seconds?|minutes?|hours?|days?|weeks?)\s*ago/
  );
  if (relativeMatch) {
    const [, value, unit] = relativeMatch;
    const num = parseInt(value, 10);
    const date = new Date(now);

    switch (unit) {
      case "second":
      case "seconds":
        date.setSeconds(now.getSeconds() - num);
        break;
      case "minute":
      case "minutes":
        date.setMinutes(now.getMinutes() - num);
        break;
      case "hour":
      case "hours":
        date.setHours(now.getHours() - num);
        break;
      case "day":
      case "days":
        date.setDate(now.getDate() - num);
        break;
      case "week":
      case "weeks":
        date.setDate(now.getDate() - num * 7);
        break;
      default:
        logger.info(`Unknown time unit: ${unit}`);
        throw new Error(`Unknown time unit: ${unit}`);
    }

    console.log(`Parsed relative date: ${date} from input: ${input}`);
    return returnISO ? date.toISOString() : date;
  }

  // Handle "Month Day" formats (e.g., "Jul 12", "Jul 12 (2 days ago)")
  const monthDayMatch = input.match(/^([A-Za-z]{3})\s+(\d{1,2})/);
  if (monthDayMatch) {
    const [, monthStr, dayStr] = monthDayMatch;
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = monthNames.findIndex(
      (m) => m.toLowerCase() === monthStr.toLowerCase()
    );
    const day = parseInt(dayStr, 10);

    if (month === -1 || day < 1 || day > 31) {
      logger.info(`Invalid month or day: ${monthStr} ${dayStr}`);
      throw new Error(`Invalid month or day: ${monthStr} ${dayStr}`);
    }

    const date = createDate(year, month, day);
    console.log(`Parsed date: ${date} from input: ${input}`);
    return returnISO ? date.toISOString() : date;
  }

  // Fallback for completely invalid formats
  logger.error(`Unable to parse date: ${input}`);
  throw new Error(`Unable to parse date: ${input}`);
}
