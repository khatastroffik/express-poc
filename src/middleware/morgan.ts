import type { IncomingMessage, ServerResponse } from "node:http";
import morgan from "morgan";
import { colorize, statusColor } from "../lib/ansi-colors";
import logger from "../lib/logger";
import { prettyBytes } from "../lib/pretty-bytes";

const log = logger("APP");

/**
 * "coloredStatus" message token returning an ANSI-colored statuscode.
 */
morgan.token("coloredStatus", (_req, res: ServerResponse<IncomingMessage>): string => {
  return colorize(res.statusCode, statusColor(res.statusCode));
});

/**
 * "contentLength" message token returning a prettified 'response content-length' using adequate units.
 */
morgan.token("contentLength", (_req, res: ServerResponse<IncomingMessage>): string | undefined => {
  const length = res.getHeaders()["content-length"];
  return `(${prettyBytes(Number(length ?? 0))})`;
});

/**
 * "coloredUrl" message token returning the request URL ANSI-colored according to the response status.
 */
morgan.token("coloredUrl", (req: IncomingMessage, res: ServerResponse<IncomingMessage>): string | undefined => {
  return req.url ? colorize(req.url, statusColor(res.statusCode)) : undefined;
});

/**
 * Initialize and configure the morgan middleware:
 * define the format of the log-message and redirect the output to the Logger.
 */
const morganMiddleware = morgan(
  `:method :coloredStatus :response-time ms :contentLength\t:coloredUrl`,
  { stream: { write: message => log.http(message.trim()) } },
);

export default morganMiddleware;
