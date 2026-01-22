import type { oas31 } from "zod-openapi";
import { getOneUrlItem, getUrlItems } from "@modules/url-shortener/url-shortener.domain";
import yaml from "yaml";
import { createDocument } from "zod-openapi";

const openapiSpecificationDocument: oas31.OpenAPIObject = createDocument({
  openapi: "3.1.1",
  info: {
    title: "EXPRESS-POC API",
    contact: { name: "Contact: khatastroffik @ GitHub", url: "https://github.com/khatastroffik" },
    license: { name: "License: MIT", identifier: "MIT", url: "https://github.com/khatastroffik/express-poc?tab=MIT-1-ov-file#" },
    description: `
## An API demonstrating the "express-poc" functionality

- See the [**express-poc**](https://github.com/khatastroffik/express-poc) github repository for more information.
- this PoC does not implement fully functional endpoints i.e. some features are only *partially* implemented.  
e.g. the query parameters of the "**GET /shortener**" endpoint have no effect on the result. 

<pre>
┌─────────────────────────────────────────────┐
|                                             |
   ╭━┳━╭━╭━╮╮
   ┃┈┈┈┣▄╋▄┫
   ┃┈┃┈╰━╰━━━━━━╮            "K11K"
   ╰┳╯┈┈┈┈┈┈┈┈ ◢█◣    a very pragmatic dog
    ┃┈┈┈┈┈┈┈┈┈┈████
    ┃┈┈┈┈┈┈┈┈┈┈◥█◤
    ┃┈┈┈┈╭━┳━━━━╯
    ┣━━━━━━┫
|                                             |
└──────────── made by khatastroffik ──────────┘
</pre>
`,
    version: "1.0.0",
  },
  paths: {
    "/shortener": {
      get: getUrlItems,
    },
    "/shortener/{id}": {
      get: getOneUrlItem,
    },
  },
});

export const jsonOpenApiSpecificationDocument = JSON.stringify(openapiSpecificationDocument);
export const yamlOpenApiSpecificationDocument = yaml.stringify(openapiSpecificationDocument);
