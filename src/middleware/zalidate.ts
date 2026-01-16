/* /// <reference types="express-serve-static-core" /> */
import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ZodError } from "zod";
import { BadRequestError } from "../lib/errors";
import { valize, valizeLooze } from "../lib/valize";

export interface zalidateArgs {
  paramsSchema?: z.ZodObject;
  bodySchema?: z.ZodObject;
  querySchema?: z.ZodObject;
  headersSchema?: z.ZodObject;
}

/**
 * Middleware used to parse, validate and typecast an express
 * Request (params, body, headers, query) as defined by Zod-Schemas.
 * @param schemas pre-defined (optional) schemas used to parse,
 *                validate and typecast the request url-path parameters,
 *                body, headers and query-parameters.
 * @returns an asynchronous express-middleware function.
 * @throws a client "400: Bad-Request" error (containg ZodError details)
 *         is thrown i.e. forwarded whenever the request is not fulfilling
 *         one of the provided zod-schema. Other errors are thrown as-is.
 */
export function zalidate(schemas: zalidateArgs) {
  return async (req: Request<any, never, any, any>, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.paramsSchema) {
        req.params = valize(req.params, schemas.paramsSchema);
      }
      if (schemas.bodySchema) {
        req.body = valize(req.body, schemas.bodySchema);
      }
      if (schemas.querySchema) {
        const validQuery = valize(req.query, schemas.querySchema);
        // OVERRIDE GETTER PROP WITH STANDARD OBJECT PROP DEFINITION TO ALLOW TYPCASTING OF REQ.QUERY
        Object.defineProperty(req, "query", { configurable: false, writable: false, value: validQuery });
      }
      if (schemas.headersSchema) {
        // !! DO NOT VALIDATE STRICTLY TO NOT THROW ON RECEIVED HEADERS NOT DEFINED IN THE SCHEMA !!
        const validHeaders = valizeLooze(req.headers, schemas.headersSchema);
        req.headers = { ...req.headers, ...validHeaders as any };
      }
      return next();
    }
    catch (err) {
      if (err instanceof ZodError) {
        return next(new BadRequestError(err.message));
      }
      else {
        return next(err);
      }
    }
  };
};

// see also https://nicnocquee.github.io/zod-request/
