import type { Express } from "express";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import morganMiddleware from "./middleware/morgan";

const app: Express = express();

app.use(morganMiddleware);
app.use(helmet());
app.use(bodyParser.json());

setupEndpoints();

/**
 * An example of a simple API endpoints setup for initial demo purpose
 */
function setupEndpoints() {
  app.get("/", (req: express.Request, res: express.Response) => {
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

export default app;
