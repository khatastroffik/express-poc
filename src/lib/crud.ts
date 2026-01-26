/**
 * Generic CRUD Service Interface
 *
 * **EXAMPLE TO BE ADAPTED/IMPROVED**
 */
export abstract class CRUD<KEY, ITEM, CREATEITEM, UPDATEITEM> {
  abstract list(): Promise<ITEM[]>;
  abstract create(item: CREATEITEM): Promise<ITEM>;
  abstract read(id: KEY): Promise<ITEM>;
  abstract update(id: KEY, item: UPDATEITEM): Promise<ITEM>;
  abstract delete(id: KEY): Promise<void>;
  // abstract upsert(id: KEY, item: Partial<ITEM>): Promise<ITEM>;
}
