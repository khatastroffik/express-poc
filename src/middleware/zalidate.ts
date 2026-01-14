import type { NextFunction, Request, Response } from "express";
import type { z } from "zod";
import { ZodError } from "zod";
import { BadRequestError } from "../lib/errors";
import { valize } from "../lib/valize";

export interface zalidateArgs {
  paramSchema?: z.ZodObject;
  bodySchema?: z.ZodObject;
  querySchema?: z.ZodObject;
  headersSchema?: z.ZodObject;
}

export function zalidate(schemas: zalidateArgs) {
  return async (req: Request<unknown, unknown, unknown, unknown>, _res: Response, next: NextFunction) => {
    try {
      if (schemas.paramSchema) {
        const validParams = valize(req.params, schemas.paramSchema);
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
      // if (schemas.headersSchema) {
      //   const validHeaders = valize(req.headers, schemas.headersSchema);
      //   req.headers = validHeaders;
      // }

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
