import type { NextFunction, Request, Response } from "express";
import { env } from "./environment";
import { Im_A_Teapot, InternalServerError } from "./errors";
import logger from "./logger";

const log = logger("SIMU");

/**
 * A simple API endpoint for demo purpose.
 */
export function simpleEndpoint(req: Request, res: Response, next: NextFunction) {
  const base = `${req.protocol}://${req.host}`;
  try {
    res.status(200).json({
      title: "This is a **khatastroffik service** Proof-of-Concept!",
      hello: "Bonjour!",
      requestUrl: `${base}${req.url}`,
      currentTime: `${new Date().toISOString()}`,
    });
  }
  catch (err) {
    next(err);
  }
}

/**
 * An endpoint DISCLOSING ENV for demo purpose. [NOT FOR PRODUCTION ENVIRONMENT]
 */
export function discloseEnvironment(_req: Request, res: Response, next: NextFunction) {
  try {
    log.info(`Environment is\n${env.toString()}`, { environment: env });
    res.status(200).json(env);
  }
  catch (err) {
    next(err);
  }
}

/**
 * Simulate different error-logging use cases.
 */
export function simulateErrorLogs(_req: Request, res: Response, _next: NextFunction) {
  const err1 = "[Error #1] This is a dummy Error that should be indirectly logged. It won't be thrown!";
  const err2 = "[Error #2] This error log has been generated for testing purpose and do not affect the API server. It won't be thrown!";
  const err3 = "[Error #3] This is a standard Error! It won't be thrown!";
  const dummyError = new InternalServerError(err1);
  log.error(new Im_A_Teapot(err2));
  log.error(new Error(err3));
  log.error(dummyError);
  res.status(200).json({ simulatedErrors: [err1, err2, err3] });
}

/**
 * Simulate an unhandled exception within an express handler.
 */
export function simulateException(_req: Request, _res: Response) {
  simulateUncaughtExceptionsOrRejections("exception");
}

/**
 * Simulate an unhandled rejection within an express handler.
 */
export function simulateRejection(_req: Request, _res: Response) {
  simulateUncaughtExceptionsOrRejections("rejection");
}

/**
 * Simulate an unhandled exception or a promise rejection at
 * server setup time (e.g. in the index.ts or app.ts file).
 * Either case should be automatically logged to file. Choose which
 * case should be simulated through commenting the corresponding code out.
 * The server may exit automatically (see the exitOnError property of the logger)
 * @param cause used to select the type of issue: either "exception", "rejection" or "noop" (disabled)
 */
export function simulateUncaughtExceptionsOrRejections(cause: "exception" | "rejection" | "noop") {
  const error = new Im_A_Teapot(`[KHATASTROFFIK ${cause.toUpperCase()}] Catch me if you can!`);
  switch (cause) {
    case "exception":
      throw error;
      break;
    case "rejection":
      Promise.reject(error);
      break;
    default:
      break;
  }
}
