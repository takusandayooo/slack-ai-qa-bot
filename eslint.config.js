import { ESLint } from "eslint";
import typescriptEslintParser from "@typescript-eslint/parser";
import typescriptEslintPlugin from "@typescript-eslint/eslint-plugin";
import importPlugin from "eslint-plugin-import";

export default [
  {
    files: ["**/*.ts"],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
      }
    },
    plugins: {
      "@typescript-eslint": typescriptEslintPlugin,
      "import": importPlugin
    },
    rules: {
      "sort-imports": [
        "error",
        {
          "ignoreCase": true,
          "ignoreDeclarationSort": true
        }
      ],
      "import/order": [
        "error",
        {
          "groups": [
            "builtin",
            "external",
            "internal",
            [
              "sibling",
              "parent"
            ],
            "object"
          ],
          "pathGroups": [
            {
              "pattern": "react",
              "group": "builtin",
              "position": "before"
            }
          ],
          "newlines-between": "always",
          "alphabetize": {
            "order": "asc",
            "caseInsensitive": true
          }
        }
      ]
    },
    ignores: ["build.js"],
    settings: {
      env: {
        browser: false,
        es6: true,
        node: true
      },
      extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "prettier" //  Make sure to put it last, so it gets the chance to override other configs.
      ]
    }
  }
];