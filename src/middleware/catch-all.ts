import type { NextFunction, Request, Response } from "express";
import { env } from "@lib/environment";
import { HTTPError } from "@lib/errors";
import logger from "@lib/logger";
import { status } from "http-status";

const log = logger("CALL");

/**
 * Catch-All error handler - to be "use"d as the last middleware of the express app.
 */
export function catchAll(err: Error | HTTPError, req: Request, res: Response, next: NextFunction) {
  const errorStack = env.NODE_DEV && env.LOG_LEVEL === "debug" && err.stack ? `\n${err.stack}` : "";
  const errIdentifier = `[${err instanceof HTTPError ? err.statuscode : err.name ?? "Error"}]`;
  const requestDetails = `${req.method} ${req.path ?? req.url}`;
  const logMessage = `[UNCAUGHT ERROR] ${errIdentifier} ${requestDetails} - ${err.message}${errorStack}\n++++++++++++++++++++++++++++++++`;
  if (res.headersSent) {
    log.debug(`[HEADERS ALREADY SENT] ${logMessage}`);
    return next(err);
  }
  const statusCode = err instanceof HTTPError ? err.statuscode : status.INTERNAL_SERVER_ERROR;
  // const details = (err instanceof HTTPError && err.details) ? { details: err.details } : {};

  const message = err.message || status[statusCode];

  const payload = { status: "error", statusCode, message, ...((err instanceof HTTPError && err.details) ? err.details : {}) };
  log.debug(payload);
  res.status(statusCode).json(payload);
};
