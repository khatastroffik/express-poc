import type { Router } from "express";
import express from "express";
import { zalidate } from "../../middleware/zalidate";
import UrlShortenerController from "./url-shortener.controller";
import { UrlItemRequestBodySchema, UrlItemRequestParamSchema } from "./url-shortener.domain";

const BasePath = "/shortener";
const router: Router = express.Router();

router.get("/", UrlShortenerController.getAll);
router.get("/:id", zalidate({ paramSchema: UrlItemRequestParamSchema }), UrlShortenerController.getOne);
router.post("/", zalidate({ bodySchema: UrlItemRequestBodySchema }), UrlShortenerController.create);

export default {
  router,
  BasePath,
};
