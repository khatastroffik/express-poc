import { exit } from "node:process";
import { format } from "node:util";
import z from "zod";
import { FILEEXT_LOG, LAN_OR_WAN } from "./zod-schemas";
import "dotenv/config";

/**
 * This schema defines the environment variables LOADED by
 * the express server application process e.g. in an ".env" file.
 * Some variables may be optional or may have a replacement/default
 * value when not provided to the application process.
 */
const EnvironmentInput = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  HOST: LAN_OR_WAN.default("http://localhost"),
  PORT: z.coerce.number().int().min(1024).max(49151).default(3000),
  BASE_URL: LAN_OR_WAN,
  LOG_LEVEL: z.enum(["error", "warn", "info", "http", "verbose", "debug", "silly"]).optional(),
  LOG_FILE: FILEEXT_LOG.default("./logs/express-poc.log"),
});

/**
 * This schema defines the environment variables PROVIDED within
 * the express server application.
 * It is adapted from the EnvironmentInput schema to enhance the env information.
 */
const EnvironmentSchema = EnvironmentInput
  .transform(schema => ({
    ...EnvironmentInput.omit({ NODE_ENV: true }).parse(schema),
    NODE_DEV: schema.NODE_ENV === "development",
    NODE_TEST: schema.NODE_ENV === "test",
    NODE_STAGING: schema.NODE_ENV === "staging",
    NODE_PROD: schema.NODE_ENV === "production",
  }))
;

/**
 * Parse and validate the environment information provided to the application process.
 * @emits exit In case of a failed validation, the process/app terminates synchronously with an error code.
 * @returns The parsed and validated Environment data as used within the app or NEVER in case of a failed validation.
 */
function parseEnv(): Environment | never {
  const parseResult = EnvironmentSchema.safeParse(/* eslint-disable node/prefer-global/process */ process.env /* eslint-enable node/prefer-global/process */);
  if (!parseResult.success) {
    parseResult.error.issues.forEach(issue => console.error(`[Environment.${issue.path}] ${issue.message}`));
    exit(1);
  }
  const result = {
    ...parseResult.data,
    toString: () => {
      return `${format("%s", parseResult.data)}`;
    },
  };
  return result;
}

/**
 * The type of the enhanced environment information
 */
export type Environment = z.infer<typeof EnvironmentSchema>;

/**
 * The enhanced environment information made available to the application
 */
export const env: Environment = parseEnv();
