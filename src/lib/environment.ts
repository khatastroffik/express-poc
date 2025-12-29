import { exit } from "node:process";
import z from "zod";
import "dotenv/config";

const LAN = z.string().nonempty().regex(/^(https?:\/\/)(?:localhost|127.0.0.1|0.0.0.0|192.168.\d{1,3}.\d{1,3})$/, "Invalid input: expected a protocol + LAN address");
const WAN = z.url({ protocol: /^https?$/, hostname: z.regexes.domain, error: "Invalid input: expected a protocol + WAN host/domain name" });
const LAN_OR_WAN = z.union([WAN, LAN], "Invalid input: expected an URL (protocol + LAN or WAN hostname/IP)");

const EnvironmentInput = z.object({
  NODE_ENV: z.enum(["development", "test", "staging", "production"]).default("development"),
  HOST: LAN_OR_WAN.default("http://localhost"),
  PORT: z.coerce.number().int().min(1024).max(49151).default(3000),
  BASE_URL: LAN_OR_WAN,
});

const Environment = EnvironmentInput
  .transform(schema => ({
    ...EnvironmentInput.omit({ NODE_ENV: true }).parse(schema),
    NODE_DEV: schema.NODE_ENV === "development",
    NODE_TEST: schema.NODE_ENV === "test",
    NODE_STAGING: schema.NODE_ENV === "staging",
    NODE_PROD: schema.NODE_ENV === "production",
  }))
;
export type Environment = z.infer<typeof Environment>;

function parseEnv(): Environment {
  const result = Environment.safeParse(/* eslint-disable node/prefer-global/process */ process.env /* eslint-enable node/prefer-global/process */);
  if (!result.success) {
    result.error.issues.forEach(issue => console.error(`[Environment.${issue.path}] ${issue.message}`));
    exit(1);
  }

  return result.data;
}
export const env = parseEnv();
