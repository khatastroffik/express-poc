const DIGITAL_DATA_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
const BYTE_UNIT = DIGITAL_DATA_SIZE_UNITS[0];
const MAX_UNIT_INDEX = DIGITAL_DATA_SIZE_UNITS.length - 1;

/**
 * Formats a 'digital data size' value (in bytes) using adequate 'display friendly' units of measures.
 * @param digitalDataSize the digital data size value  in bytes.
 * @param precision the precision of the output representation.
 * @param addSpace add a space between the formated value and the unit of measure.
 * @returns formated digital data size with units dynamically set.
 */
export function prettyBytes(digitalDataSize: number, precision: number = 3, addSpace = true): string {
  const space = addSpace ? " " : "";
  const size = Math.abs(digitalDataSize);
  if (size < 1) {
    return `0${space}${BYTE_UNIT}`;
  }
  const exponent = Math.min(Math.floor(Math.log10(size) / 3), MAX_UNIT_INDEX);
  const value = Number(((size) / 1000 ** exponent).toPrecision(precision));
  return `${digitalDataSize < 0 ? "-" : ""}${value}${space}${DIGITAL_DATA_SIZE_UNITS[exponent]}`;
}
