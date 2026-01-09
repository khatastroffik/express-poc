const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  verbose: true,
  preset: "ts-jest/presets/js-with-ts",
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ["<rootDir>/src/"],
  testMatch: ["**/?(*.)+(spec|test).?(ts)?"],

  transformIgnorePatterns: [
    // "node_modules/(?!dependency-to-be-ignored-by-transformation/.*)",
  ],
};
