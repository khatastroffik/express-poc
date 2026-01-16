import z from "zod";
import { LAN_OR_WAN, RequestParamId } from "../../lib/zod-schemas";

/**
 * Branding the UrlItem with the UrlId property
 */
declare const UrlIdBrand: unique symbol;

/**
 * Domain types, interfaces and constants
 */
export type UrlId = string & { [UrlIdBrand]: true };

export interface UrlItem {
  id: UrlId;
  url: string;
}
export type UrlList = UrlItem[];

/**
 * DTO types, interfaces and constants
 */
export type UrlItemPostDTO = Omit<UrlItem, "id">;
export type UrlItemPutDTO = UrlItem;
export type UrlItemDeleteDTO = Omit<UrlItem, "url">;
export type UrlItemGetDTO = UrlItem;

/**
 * DAO types, interfaces and constants
 */
export type UrlItemSaveDAO = Omit<UrlItem, "id">;
export type UrlItemRetrieveDAO = UrlItem;
export type UrlItemDeleteDAO = Omit<UrlItem, "url">;

/**
 * Zod Request Validation Schemas - to be used with "zalidate(...)" function
 */
export const UrlItemRequestParamSchema = z.object({
  id: RequestParamId,
});

export const UrlItemRequestBodySchema = z.object({
  url: LAN_OR_WAN,
});

export const UrlItemRequestHeadersSchema = z.object({
  // for DEMO purpose
  "accept-encoding": z.string(),
  "authorization": z.string().default("none"),
  "x-one-of-a-kind": z.string().default("khatastroffik API client"),
  "x-special": z.boolean().default(true),
  "x-timestamp": z.date().default(new Date()),
  "x-array": z.array(z.string()).default(["A", "B", "C"]),
  "x-list": z.string().default("A, B, C"),
});
