import { exit } from "node:process";
import { format } from "node:util";
import app from "./app";
import { env } from "./lib/environment";
import logger from "./lib/logger";

const log = logger("APP");

/**
 * Start the express server:
 * accept new connections and handle new requests.
 */
const server = app.listen(env.PORT, () => {
  log.info(`Server is running at ${env.HOST}:${env.PORT}`);
  log.info(`Log level is '${log.level}'`);
  log.debug(`Environment is\n${format("%s", env)}`, { environment: env });
  const dummyError = new Error("This error has been generated for testing purpose and do not affect the API server.");
  log.error(dummyError as unknown);
});

/**
 * Catch the SIGINT process event triggered at OS-level:
 * cleanup/teardown the server and ressources.
 */
// eslint-disable-next-line node/prefer-global/process
process.once("SIGINT", () => {
  log.info("Closing server...");
  if (server.listening) {
    log.info("Tearing services down...");
    server.close((err) => {
      if (err) {
        log.error(err);
        exit(1);
      }
      log.info("Exiting server process...");
      exit(0);
    });
  }
});
