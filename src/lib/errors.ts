import type { HttpStatus } from "http-status";
import status from "http-status";

type OnlyNumberKeys<T> = T extends number ? T : never;
type StatusCodeKey = OnlyNumberKeys<keyof HttpStatus>;

class HTTPError extends Error {
  public statuscode: StatusCodeKey;
  public override message: string;
  constructor(statuscode: StatusCodeKey, message?: string) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    const msg = message || status[statuscode] as string;
    this.name = `[${status[`${statuscode}_CLASS`]}][${statuscode}]`; // this.constructor.name;
    this.statuscode = statuscode;
    this.message = msg;
  }
}

/**
 * ############################################################################
 * #####                     4xx - CLIENT ERRORS                          #####
 * ############################################################################
 */

/**
 * 400 - BAD_REQUEST
 */
export class BadRequestError extends HTTPError {
  constructor(message?: string) {
    super(status.BAD_REQUEST, message);
  }
}

/**
 * 401 - UNAUTHORIZED
 */
export class UnauthorizedError extends HTTPError {
  constructor(message?: string) {
    super(status.UNAUTHORIZED, message);
  }
}

/**
 * 403 - FORBIDDEN
 */
export class VorbiddenError extends HTTPError {
  constructor(message?: string) {
    super(status.FORBIDDEN, message);
  }
}

/**
 * 404 - NOT_FOUND
 */
export class NotFoundError extends HTTPError {
  constructor(message?: string) {
    super(status.NOT_FOUND, message);
  }
}

/**
 * 405 - METHOD_NOT_ALLOWED
 */
export class MethodNotAllowedError extends HTTPError {
  constructor(message?: string) {
    super(status.METHOD_NOT_ALLOWED, message);
  }
}

/**
 * 409 - CONFLICT
 */
export class ConflictError extends HTTPError {
  constructor(message?: string) {
    super(status.CONFLICT, message);
  }
}

/**
 * 418 - IM_A_TEAPOT
 */
export class Im_A_Teapot extends HTTPError {
  constructor(message?: string) {
    super(status.IM_A_TEAPOT, message);
  }
}

/**
 * 429 - TOO_MANY_REQUESTS
 */
export class TooManyRequestsError extends HTTPError {
  constructor(message?: string) {
    super(status.TOO_MANY_REQUESTS, message);
  }
}

/**
 * ############################################################################
 * #####                     5xx - SERVER ERRORS                          #####
 * ############################################################################
 */

/**
 * 500 - INTERNAL_SERVER_ERROR
 */
export class InternalServerError extends HTTPError {
  constructor(message?: string) {
    super(status.INTERNAL_SERVER_ERROR, message);
  }
}

/**
 * 501 - NOT_IMPLEMENTED
 */
export class NotImplementedError extends HTTPError {
  constructor(message?: string) {
    super(status.NOT_IMPLEMENTED, message);
  }
}
