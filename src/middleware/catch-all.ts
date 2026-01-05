import type { NextFunction, Request, Response } from "express";
import { status } from "http-status";
import { env } from "../lib/environment";
import { HTTPError } from "../lib/errors";
import logger from "../lib/logger";

const log = logger("CALL");

/**
 * Catch-All error handler - to be "use"d as the last middleware of the express app.
 */
export function catchAll(err: Error, req: Request, res: Response, next: NextFunction) {
  const errorStack = env.NODE_DEV && env.LOG_LEVEL === "debug" && err.stack ? `\n${err.stack}` : "";
  const errIdentifier = `[${err instanceof HTTPError ? err.statuscode : err.name ?? "Error"}]`;
  const requestDetails = `${req.method} ${req.path ?? req.url}`;
  const logMessage = `[UNCAUGHT ERROR] ${errIdentifier} ${requestDetails} - ${err.message}${errorStack}`;
  if (res.headersSent) {
    log.debug(`[HEADERS ALREADY SENT] ${logMessage}`);
    return next(err);
  }
  log.error(logMessage);
  const statusCode = status.INTERNAL_SERVER_ERROR;
  const message = err.message || status[statusCode];
  res.status(statusCode).json({ status: "error", statusCode, message });
};
