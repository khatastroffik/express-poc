import type { Express } from "express";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import { InternalServerError, NotFoundError } from "./lib/errors";
import logger from "./lib/logger";
import morganMiddleware from "./middleware/morgan";

const log = logger("BAAAM");

const app: Express = express();

app.use(morganMiddleware);
app.use(helmet());
app.use(bodyParser.json());

setupSampleEndpoint();

/**
 * An example of a simple API endpoints setup for initial demo purpose
 */
function setupSampleEndpoint() {
  app.get("/", (req: express.Request, res: express.Response) => {
    simulateErrorLogs();
    res
      .setHeader("content-type", "text/html; charset=utf-8")
      .send(`
      <h1>Bonjour!</h1>
      <p>This is a <strong>khatastroffik service</strong> Proof-of-Concept!</p>
      <p>The full URL of this request is: <code>${req.protocol}://${req.host}${req.url}</code></p>
      <p>Current time is: <code>${new Date().toUTCString()}</code>
      <style>code { background-color: #f4f4f4; padding: 0.125em 0.25em; border: 1px solid #ccc; }</style>
      `);
  });
}

/**
 * A simulation of error-logging
 */
function simulateErrorLogs() {
  const dummyError = new InternalServerError("Dummy Error logged indirectly!");
  log.error(new NotFoundError("This error has been generated for testing purpose and do not affect the API server."));
  log.error(new Error("This is a standard Error!"));
  log.error(dummyError);
}

export default app;
