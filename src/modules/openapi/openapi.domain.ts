import type { ZodOpenApiContentObject, ZodOpenApiOperationObject, ZodOpenApiResponseObject } from "zod-openapi";

const OasJsonFile: ZodOpenApiContentObject = {
  "application/openapi+json": {
    schema: {
      type: "string",
      format: "binary",
    },
    example:
{
  openapi: "3.1.1",
  info: {
    title: "EXPRESS-POC API",
    contact: {
      name: "Contact: khatastroffik @ GitHub",
      url: "https://github.com/khatastroffik",
    },
    license: {
      name: "License: MIT",
      identifier: "MIT",
      url: "https://github.com/khatastroffik/express-poc?tab=MIT-1-ov-file#",
    },
    description: "An API demonstrating the express-poc functionality",
    version: "1.0.0",
  },
},
  },
};

const OasYamlFile: ZodOpenApiContentObject = {
  "application/openapi+yaml": {
    schema: {
      type: "string",
      format: "binary",
    },
    example: `
openapi: 3.1.1
info:
  title: EXPRESS-POC API
  contact:
    name: "Contact: khatastroffik @ GitHub"
    url: https://github.com/khatastroffik
  license:
    name: "License: MIT"
    identifier: MIT
    url: https://github.com/khatastroffik/express-poc?tab=MIT-1-ov-file#
  description: An API demonstrating the express-poc functionality
  version: 1.0.0`,
  },
};

const OasJsonFileResponse: ZodOpenApiResponseObject = {
  id: "OAS JSON file",
  description: "OAS JSON file download",
  content: OasJsonFile,
};

const OasYamlFileResponse: ZodOpenApiResponseObject = {
  id: "OAS YAML file",
  description: "OAS YAML file download",
  content: OasYamlFile,
};

/**
 * OpenApi operation to download the OAS as JSON file
 */
export const getJsonSpecification: ZodOpenApiOperationObject = {
  operationId: "get JSON spec",
  summary: "Download the OAS as JSON",
  description: "Download the OpenApi specification as JSON file.",
  tags: ["OAS"],
  responses: {
    200: OasJsonFileResponse,
  },
};

/**
 * OpenApi operation to download the OAS as YAML file
 */
export const getYamlSpecification: ZodOpenApiOperationObject = {
  operationId: "get YAML spec",
  summary: "Download the OAS as YAML",
  description: "Download the OpenApi specification as YAML file.",
  tags: ["OAS"],
  responses: {
    200: OasYamlFileResponse,
  },
};
