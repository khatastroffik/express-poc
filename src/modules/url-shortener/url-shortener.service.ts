import type { UrlId, UrlItem, UrlItemRetrieveDAO, UrlItemSaveDAO } from "./url-shortener.domain";
import { NotFoundError } from "../../lib/errors";
import IDService from "./../../lib/id-service";

class UrlShortenerService {
  private readonly storage: Map<UrlId, string> = new Map<UrlId, string>();

  constructor() {
    this.retrieveAll = this.retrieveAll.bind(this);
    this.retrieveOne = this.retrieveOne.bind(this);
    this.save = this.save.bind(this);
  }

  async retrieveAll(): Promise<UrlItemRetrieveDAO[]> {
    return [...this.storage].map(([id, url]) => ({ id, url }));
  }

  async retrieveOne(id: UrlId): Promise<UrlItemRetrieveDAO> {
    const url = this.storage.get(id);
    if (!url) {
      throw new NotFoundError("URL could not be found");
    }
    return { id, url };
  }

  async save(item: UrlItemSaveDAO): Promise<UrlItem> {
    const newId = IDService.generateId<UrlId>();
    this.storage.set(newId, item.url);
    return { id: newId, url: item.url };
  }
}

/**
 * ES6 Module Singleton Pattern
 */
export default new UrlShortenerService();
