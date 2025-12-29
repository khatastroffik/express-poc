import antfu from "@antfu/eslint-config";

export default antfu({
  stylistic: {
    indent: 2,
    quotes: "double",
    semi: true,
  },
  rules: {
    "ts/no-redeclare": "off", // "@typescript-eslint/no-redeclare": "off",
  },
});
