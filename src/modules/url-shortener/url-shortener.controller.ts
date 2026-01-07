import type { NextFunction, Request, Response } from "express";
import type { UrlId } from "./url-shortener.domain";
import status from "http-status";
import UrlShortenerService from "./url-shortener.service";

class UrlShortenerController {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.getOne = this.getOne.bind(this);
    this.create = this.create.bind(this);
  }

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const list = await UrlShortenerService.retrieveAll();
      res.json(list);
    }
    catch (error) {
      next(error);
    }
  }

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as UrlId;
      const item = await UrlShortenerService.retrieveOne(id);
      res.json(item);
    }
    catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const newItem = await UrlShortenerService.save({ url: req.body.url });
      res.status(status.CREATED).json(newItem);
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
