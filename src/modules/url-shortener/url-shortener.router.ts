import type { Router } from "express";
import { zalidate, zalidateAsync } from "@mw/zalidate";
import express from "express";
import UrlShortenerController from "./url-shortener.controller";
import { UrlItemGetAllRequestQuerySchema, UrlItemRequestBodySchema, UrlItemRequestHeadersSchema, UrlItemRequestParamSchema } from "./url-shortener.domain";

const BasePath = "/shortener";
const router: Router = express.Router();

// IN THIS DEMO, THE ASYNC ROUTES MUST BE REGISTERED FIRST -> DUE TO THE "/async/" ROUTE PATH PREFIX !

/**
 * Retrieve the list of url items and demonstrate ASYNCHRONOUS parsing, validating and typecasting request query parameters
 */
router.get("/async/", zalidateAsync({ querySchema: UrlItemGetAllRequestQuerySchema }), UrlShortenerController.getAll);

/**
 * Retrieve a single url item and demonstrate ASYNCHRONOUS parsing, validating and typecasting the request url "id" param as well as the request headers
 */
router.get("/async/:id", zalidateAsync({ paramsSchema: UrlItemRequestParamSchema, headersSchema: UrlItemRequestHeadersSchema }), UrlShortenerController.getOne);

/**
 * Create a new url-item object and demonstrate ASYNCHRONOUS parsing, validating and typecasting the request (json) body
 */
router.post("/async/", zalidateAsync({ bodySchema: UrlItemRequestBodySchema }), UrlShortenerController.create);

/**
 * Retrieve the list of url items and demonstrate SYNCHRONOUS parsing, validating and typecasting request query parameters
 */
router.get("/", zalidate({ querySchema: UrlItemGetAllRequestQuerySchema }), UrlShortenerController.getAll);

/**
 * Retrieve a single url item and demonstrate SYNCHRONOUSparsing, validating and typecasting the request url "id" param as well as the request headers
 */
router.get("/:id", zalidate({ paramsSchema: UrlItemRequestParamSchema, headersSchema: UrlItemRequestHeadersSchema }), UrlShortenerController.getOne);

/**
 * Create a new url-item object and demonstrate SYNCHRONOUS parsing, validating and typecasting the request (json) body
 */
router.post("/", zalidate({ bodySchema: UrlItemRequestBodySchema }), UrlShortenerController.create);

export default { router, BasePath };
