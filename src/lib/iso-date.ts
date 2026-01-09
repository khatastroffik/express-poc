/**
 * Checks if a string is a valid ISO 8601 formatted date string
 * @param {string} isoDateString The date string to check
 * @return {boolean} Returns true if the string is in ISO format, false otherwise
 */
export default function isISOString(isoDateString: string) {
  try {
    const d = new Date(isoDateString);
    return !Number.isNaN(d.valueOf()) && d.toISOString() === isoDateString;
  }
  catch {
    return false;
  }
}
