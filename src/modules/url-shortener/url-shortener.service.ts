import type { CRUD } from "@lib/crud";
import type { UrlId, UrlItem, UrlItemNoId, UrlItemNoIdUpdate } from "./url-shortener.domain";
import { NotFoundError } from "@lib/errors";
import IDService from "@lib/id-service";

export const dummyDataCount = 6;

/**
 * The "UrlShortenerService" implements the CRUD interface for the UrlItem objects.
 */
class UrlShortenerService implements CRUD<UrlId, UrlItem, UrlItemNoId, UrlItemNoIdUpdate> {
  /**
   * This is a "in-memory" storage for all the "shortened URLs".
   *
   * !!! **REPLACE THIS TRANSIENT STORAGE WITH A PERSISTING ONE FOR PRODUCTION USE** !!!
   */
  private readonly storage: Map<UrlId, UrlItem> = new Map<UrlId, UrlItem>();

  /**
   * ADD AN INITIAL ITEM FOR TESTING PURPOSE - TO BE REMOVED
   */
  private LoadDummyData() {
    //
    const id = <UrlId>("testid");
    const url = "https://github.com/khatastroffik/express-poc";
    this.storage.set(id, { id, url });
    for (let index = 1; index < dummyDataCount; index++) {
      this.create({ url: `https://www.example-${index}.com` });
    }
  }

  constructor() {
    this.LoadDummyData();
  }

  async list(): Promise<UrlItem[]> {
    return [...this.storage].map(([_id, item]) => (item));
  };

  async create(item: UrlItemNoId): Promise<UrlItem> {
    const newId = IDService.generateId<UrlId>();
    const newItem = { id: newId, ...item };
    this.storage.set(newId, newItem);
    return newItem;
  };

  async read(id: UrlId): Promise<UrlItem> {
    const existingItem = this.storage.get(id);
    if (!existingItem) {
      throw new NotFoundError("Read item failed: URL item could not be found");
    }
    return existingItem;
  };

  async delete(id: UrlId): Promise<void> {
    if (!this.storage.delete(id)) {
      throw new NotFoundError("Delete item failed: URL item could not be found");
    };
  };

  async update(id: UrlId, item: UrlItemNoIdUpdate): Promise<UrlItem> {
    const currentItem = this.storage.get(id);
    if (!currentItem) {
      throw new NotFoundError("Update item failed: URL item could not be found");
    }
    const updatedItem = { ...currentItem, ...item };
    this.storage.set(id, updatedItem);
    return updatedItem;
  };
}

/**
 * ES6 Module Singleton Pattern
 */
export default new UrlShortenerService();
