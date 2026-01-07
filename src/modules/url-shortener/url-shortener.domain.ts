declare const UrlIdBrand: unique symbol;

/**
 * Domain types, interfaces and constants
 */
export type UrlId = string & { [UrlIdBrand]: true };
export interface UrlItem {
  id: UrlId;
  url: string;
}
export type UrlList = UrlItem[];

/**
 * DTO types, interfaces and constants
 */
export type UrlItemPostDTO = Omit<UrlItem, "id">;
export type UrlItemPutDTO = UrlItem;
export type UrlItemDeleteDTO = Omit<UrlItem, "url">;
export type UrlItemGetDTO = UrlItem;

/**
 * DAO types, interfaces and constants
 */
export type UrlItemSaveDAO = Omit<UrlItem, "id">;
export type UrlItemRetrieveDAO = UrlItem;
export type UrlItemDeleteDAO = Omit<UrlItem, "url">;
