import type { Router } from "express";
import express from "express";
import swaggerUi from "swagger-ui-express";
import { openApiJsonSpec, openApiYamlSpec } from "./openapi.controller";

const BasePath = "/swagger";
const router: Router = express.Router();
const swaggeruiOptions = {
  explorer: true, // allow the user to select the specification file to be used from a dropdown
  swaggerOptions: {
    urls: [
      {
        url: `${BasePath}/openapi.json`,
        name: "express-poc JSON API specification",
      },
      {
        url: `${BasePath}/openapi.yaml`,
        name: "express-poc YAML API specification",
      },
    ],
  },
};

router.get("/openapi.json", openApiJsonSpec);
router.get("/openapi.yaml", openApiYamlSpec);
router.use("/", swaggerUi.serve, swaggerUi.setup(null, swaggeruiOptions));

export default { router, BasePath };
