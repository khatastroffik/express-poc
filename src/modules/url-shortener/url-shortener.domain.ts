import type { ZodOpenApiOperationObject } from "zod-openapi";
import { ClientErrorBadRequestSchema, ClientErrorSchema, GetAllRequestQuerySchema, IdSchema, LAN_OR_WAN, QueryLimit, QueryPage, QuerySort, RequestParamId, ServerErrorSchema } from "@lib/zod-schemas";
import z from "zod";

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
}).meta({ id: "NewUrlItem", description: "A schema containing the url of an item to be created." });

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

export const UrlItemGetAllRequestQuerySchema = GetAllRequestQuerySchema;
export type UrlItemGetAllRequestQuery = z.infer<typeof UrlItemGetAllRequestQuerySchema>;

export const UrlIdSchema = IdSchema.brand("UrlIdBrand").meta({ id: "UrlId", description: "the ID of an URL item. This ID can be safelly used as a **slug**." });

export const UrlItemSchema = z.object({
  id: UrlIdSchema.meta({ description: "ID of the item.", example: "testid" }),
  url: LAN_OR_WAN.meta({ description: "url of the item.", example: "https://github.com/khatastroffik/express-poc" }),
}).meta({ id: "UrlItem", description: "A url-item containing both the original url and its **slug** ID." });

export const UrlItemsSchema = z.array(UrlItemSchema).meta({ id: "UrlItems", description: "A list of url-items." });

export const getUrlItems: ZodOpenApiOperationObject = {
  operationId: "get URL Items",
  summary: "List URL items",
  description: "Lists all URL items in the database.",
  tags: ["URL Shortener"],
  parameters: [QuerySort, QueryPage, QueryLimit],
  responses: {
    200: {
      description: "The URL items were retrieved successfully.",
      content: { "application/json": { schema: UrlItemsSchema },
      },
    },
  },
};

export const getOneUrlItem: ZodOpenApiOperationObject = {
  operationId: "get one URL Item",
  summary: "Retriev a single URL item",
  description: "Gets a URL item from the database.",
  tags: ["URL Shortener"],
  requestParams: {
    path: z.object({ id: UrlIdSchema }),
  },
  responses: {
    "200": {
      description: "The URL item was retrieved successfully.",
      content: { "application/json": { schema: UrlItemSchema },
      },
    },
    "400": {
      description: "Bad request",
      content: { "application/json": { schema: ClientErrorBadRequestSchema.meta({ example: "{ \"status\": \"error\", \"statuscode\": 400, \"message\": \"Bad Request\"}" }) },
      },
    },
    "404": {
      description: "Not Found",
      content: { "application/json": { schema: ClientErrorSchema.meta({ example: "{ \"status\": \"error\", \"statuscode\": 404, \"message\": \"Not Found\"}" }) },
      },
    },
    "5XX": {
      description: "Server error",
      content: { "application/json": { schema: ServerErrorSchema },
      },
    },

  },
};

export const createUrlItem: ZodOpenApiOperationObject = {
  operationId: "create URL Item",
  summary: "Create a new URL item",
  description: "Generate an ID and create/save a new URL item into the database.",
  tags: ["URL Shortener"],
  requestBody: {
    description: "JSON containing the URL of the item that should be created.",
    content: { "application/json": { schema: UrlItemRequestBodySchema } },
  },
  responses: {
    "201": {
      description: "The URL item was created successfully.",
      content: { "application/json": { schema: UrlItemSchema },
      },
    },
    "400": {
      description: "Bad request",
      content: { "application/json": { schema: ClientErrorBadRequestSchema.meta({ example: "{ \"status\": \"error\", \"statuscode\": 400, \"message\": \"Bad Request\",  \"formErrors\": [ \"Unrecognized key: 'extraKey\"],  \"fieldErrors\": {}}" }) },
      },
    },
    "409": {
      description: "Conflict",
      content: { "application/json": { schema: ClientErrorSchema.meta({ example: "{ \"status\": \"error\", \"statuscode\": 409, \"message\": \"Conflict\"}" }) },
      },
    },
    "5XX": {
      description: "Server error",
      content: { "application/json": { schema: ServerErrorSchema },
      },
    },

  },
};
