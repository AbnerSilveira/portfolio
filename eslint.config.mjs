import portfolio from "@portfolio/config-eslint";

export default [
  { ignores: ["**/node_modules/**", "**/dist/**", "**/.turbo/**", "**/coverage/**"] },
  ...portfolio,
];
