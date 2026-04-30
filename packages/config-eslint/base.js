import js from "@eslint/js";
import tseslint from "typescript-eslint";
import security from "eslint-plugin-security";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx,mts,cts}"],
  })),
  security.configs.recommended,
  prettier,
  {
    files: ["**/*.{ts,tsx,mts,cts}"],
    ignores: ["**/.contentlayer/**"],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": "error",
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
    },
  },
];
