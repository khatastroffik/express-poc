/**
 * Shared/common zod-schema definitions
 */
import z from "zod";

const LAN = z.string().nonempty().regex(/^(https?:\/\/)(?:localhost|127.0.0.1|0.0.0.0|192.168.\d{1,3}.\d{1,3})$/, "Invalid input: expected a protocol + LAN address");
const WAN = z.url({ protocol: /^https?$/, hostname: z.regexes.domain, error: "Invalid input: expected a protocol + WAN host/domain name" });

export const LAN_OR_WAN = z.union([WAN, LAN], "Invalid input: expected an URL (protocol + LAN or WAN hostname/IP)");
export const FILEEXT_LOG = z.stringFormat("LOG-FILE-NAME", /[^/]+\.log$/i, "Invalid input: log-file name must end with '.log'");

// export const RequestParamId = z.string();
export const RequestParamId = z.string().normalize().trim().length(6).nonempty().nonoptional();
