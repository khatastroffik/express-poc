import antfu from "@antfu/eslint-config";
import tsParser from "@typescript-eslint/parser";
import jest from "eslint-plugin-jest";
import jestExtended from "eslint-plugin-jest-extended";

import j from "jest/package.json" with { type: "json" };

export default antfu(
  {
    gitignore: true,
    typescript: true,
    pnpm: true,
    stylistic: {
      indent: 2,
      quotes: "double",
      semi: true,
    },
    rules: {
      "ts/no-redeclare": "off", // "@typescript-eslint/no-redeclare": "off",
    },
    settings: {
      jest: {
        version: j.version,
      },
    },
    linterOptions: {
      noInlineConfig: false,
      reportUnusedDisableDirectives: "warn",
      reportUnusedInlineConfigs: "error",
    },
  },
  {
    files: ["**/*.test.ts"],

    ...jest.configs["flat/recommended"],
    ...jest.configs["flat/style"],
    ...jestExtended.configs["flat/recommended"],
    plugins: { jestExtended, jest },
    rules: {
      ...jest.configs["flat/recommended"].rules,
      ...jest.configs["flat/style"].rules,
      ...jestExtended.configs["flat/recommended"].rules,

      "jest/prefer-to-be": "error",
      "jest/prefer-expect-assertions": "off",
    },
    languageOptions: {
      globals: jest.environments.globals.globals,
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        parser: tsParser,
      },
    },
  },
);
