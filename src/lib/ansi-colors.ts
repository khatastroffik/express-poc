// eslint-disable-next-line no-control-regex
const findColors = /[\u001B\u009B][[()#;?]*(?:\d{1,4}(?:;\d{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

/**
 * Add ANSI-Colors formating instructions to the input text
 * @param text input text that should be colored using ANSI-coloring instructions
 * @param color color to be applied to the input text
 * @returns colored input text
 */
export function colorize(text: unknown, color: number): string {
  return `\x1B[${color}m${text}\x1B[0m`;
}

/**
 * Removes ANSI-Colors formating instructions from the input text
 * @param text input text containing ANSI-coloring instruction
 * @returns input text without coloring instructions
 */
export function decolorize(text: string): string {
  return text.replace(findColors, "");
}

/**
 * Retrieves the color corresponding to a specific range of HTTP-Statuscodes
 * @param status HTTP-status code
 * @returns color matching the input statuscode
 */
export function statusColor(status: number): number {
  return status >= 500 ? 31 /* red */ : status >= 400 ? 33 /* yellow */ : status >= 300 ? 36 /* cyan */ : status >= 200 ? 32 /* green */ : 0;
}
