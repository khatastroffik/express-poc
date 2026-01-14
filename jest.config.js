const { createDefaultPreset } = require("ts-jest");

const tsJestTransformCfg = createDefaultPreset().transform;

const isCI = require("node:process").env.CI;

/** @type {import("jest").Config} **/
module.exports = {
  verbose: !isCI,
  preset: "ts-jest/presets/js-with-ts",
  moduleFileExtensions: ["ts", "tsx", "js"],
  testEnvironment: "node",
  transform: {
    ...tsJestTransformCfg,
  },
  roots: ["<rootDir>/src/"],
  testMatch: ["**/?(*.)+(spec|test).?(ts)?"],
  setupFilesAfterEnv: ["jest-extended/all"],
  transformIgnorePatterns: [
    // "node_modules/(?!dependency-to-be-ignored-by-transformation/.*)",
  ],
};
