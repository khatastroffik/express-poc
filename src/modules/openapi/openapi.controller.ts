import type { Request, Response } from "express";
import { env } from "@lib/environment";
import { jsonOpenApiSpecificationDocument, yamlOpenApiSpecificationDocument } from "./openapi.service";

/**
 * An endpoint publishing the OpenApi specification as JSON document
 */
export function openApiJsonSpec(_req: Request, res: Response) {
  const contentType = "application/openapi+json; charset=utf-8";
  res.setHeader("content-type", contentType).status(200).send(jsonOpenApiSpecificationDocument);
}

/**
 * An endpoint publishing the OpenApi specification as YAML document
 */
export function openApiYamlSpec(_req: Request, res: Response) {
  const contentType = env.NODE_DEV ? "text/openapi+yaml; charset=utf-8" : "application/openapi+yaml";
  res.setHeader("content-type", contentType).status(200).send(yamlOpenApiSpecificationDocument);
}
