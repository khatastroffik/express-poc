import { exit } from "node:process";
import app from "./app";
import { env } from "./lib/environment";
import logger from "./lib/logger";
import { simulateUncaughtExceptionsOrRejections } from "./lib/simulations";

const log = logger("MAIN");

/**
 * Start the express server:
 * accept new connections and handle new requests.
 */
const server = app.listen(env.PORT, () => {
  log.info(`Server is running at ${env.HOST}:${env.PORT}`);

  /**
   * Simulate an unhandled "exception" or "rejection" using the
   * corresponding function parameter.
   * Disable the simulation using the "noop" value.
   */
  simulateUncaughtExceptionsOrRejections("noop");
});

/**
 * Catch the SIGINT process event triggered at OS-level:
 * cleanup/teardown the server and ressources.
 */
process.once("SIGINT", () => { // eslint-disable-line node/prefer-global/process
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
