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

export function zalidate(schemas: zalidateArgs) {
  return async (req: Request<any, never, any, any>, _res: Response, next: NextFunction): Promise<void> => {
    try {
      if (schemas.paramsSchema) {
        const validParams = valize(req.params, schemas.paramsSchema);
        req.params = validParams;
      }
      if (schemas.bodySchema) {
        const validBody = valize(req.body, schemas.bodySchema);
        req.body = validBody;
      }
      if (schemas.querySchema) {
        const validQuery = valize(req.query, schemas.querySchema);
        req.query = validQuery;
      }
      if (schemas.headersSchema) {
        const validHeaders = valizeLooze(req.headers, schemas.headersSchema); // DO NOT VALIDATE !! STRICTLY !!
        req.headers = { ...req.headers, ...validHeaders as any }; // merge incomming headers with validated headers
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
