import type { NextFunction, Request, Response } from "express";
import type { UrlId, UrlItemGetAllRequestQuery } from "./url-shortener.domain";
import status from "http-status";
import UrlShortenerService from "./url-shortener.service";

class UrlShortenerController {
  constructor() {
  }

  async list(_req: Request<never, never, any, UrlItemGetAllRequestQuery>, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await UrlShortenerService.list();
      res.json(list);
    }
    catch (error) {
      next(error);
    }
  }

  async get(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = <UrlId>req.params.id;
      const item = await UrlShortenerService.read(id);
      res.json(item);
    }
    catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = await UrlShortenerService.create({ url: req.body.url });
      res.status(status.CREATED).json(newItem);
    }
    catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = <UrlId>req.params.id;
      await UrlShortenerService.delete(id);
      res.status(status.NO_CONTENT).send();
    }
    catch (error) {
      next(error);
    }
  }
}

/**
 * ES6 Module Singleton Pattern
 */
export default new UrlShortenerController();
