import type { Router } from "express";
import express from "express";
import { zalidate } from "../../middleware/zalidate";
import UrlShortenerController from "./url-shortener.controller";
import { UrlItemGetAllRequestQuerySchema, UrlItemRequestBodySchema, UrlItemRequestHeadersSchema, UrlItemRequestParamSchema } from "./url-shortener.domain";

const BasePath = "/shortener";
const router: Router = express.Router();

/**
 * Retrieve the list of url items and demonstrate parsing, validating and typecasting request query parameters
 */
router.get("/", zalidate({ querySchema: UrlItemGetAllRequestQuerySchema }), UrlShortenerController.getAll);

/**
 * Retrieve a single url item and demonstrate parsing, validating and typecasting the request url "id" param as well as the request headers
 */
router.get("/:id", zalidate({ paramsSchema: UrlItemRequestParamSchema, headersSchema: UrlItemRequestHeadersSchema }), UrlShortenerController.getOne);

/**
 * Create a new url-item object and demonstrate parsing, validating and typecasting the request (json) body
 */
router.post("/", zalidate({ bodySchema: UrlItemRequestBodySchema }), UrlShortenerController.create);

export default { router, BasePath };
