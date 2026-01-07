import type { Express } from "express";
import bodyParser from "body-parser";
import express from "express";
import helmet from "helmet";
import { discloseEnvironment, simpleEndpoint, simulateErrorLogs, simulateException, simulateRejection } from "./lib/simulations";
import { catchAll } from "./middleware/catch-all";
import morganMiddleware from "./middleware/morgan";
import urlShortener from "./modules/url-shortener/url-shortener.router";

const app: Express = express();

app.use(morganMiddleware);
app.use(helmet());
app.use(bodyParser.json());

// START OF DEMO ----------------------------------------------------------
app.get("/", simpleEndpoint);
app.get("/environment", discloseEnvironment);
app.get("/simulations/logs", simulateErrorLogs);
app.get("/simulations/exception", simulateException);
app.get("/simulations/rejection", simulateRejection);
// END OF DEMO ------------------------------------------------------------

// URL-Shortener Endpoint
app.use(urlShortener.BasePath, urlShortener.router);

app.use(catchAll); // MUST BE LAST IN THE CHAIN

export default app;
