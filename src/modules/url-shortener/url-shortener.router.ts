import type { Router } from "express";
import express from "express";
import UrlShortenerController from "./url-shortener.controller";

const BasePath = "/shortener";
const router: Router = express.Router();

router.get("/", UrlShortenerController.getAll);
router.get("/:id", UrlShortenerController.getOne);
router.post("/", UrlShortenerController.create);

export default {
  router,
  BasePath,
};
