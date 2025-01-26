import globals from "globals";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    ...compat.extends("airbnb", "prettier"),
    {
        files: ["src/**/*.js", "src/**/*.jsx"]
    },
    {
        languageOptions: {
            globals: {
                ...globals.browser,
            },

            ecmaVersion: "latest",
            sourceType: "module",

            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },

        rules: {
            "import/no-extraneous-dependencies": "off",
            "react/no-array-index-key": "off",
            "react/prop-types": "off",
            "no-shadow": "off",

            "no-unused-vars": ["warn", {
                argsIgnorePattern: "^_",
                varsIgnorePattern: "^_",
                caughtErrorsIgnorePattern: "^_",
            }],

            "no-plusplus": "off",
            "react/jsx-props-no-spreading": "off",
            "no-underscore-dangle": "off",
            "jsx-a11y/click-events-have-key-events": "off",
            "jsx-a11y/no-noninteractive-element-interactions": "off",
            "no-param-reassign": "off",
            "no-restricted-syntax": "off",
        },
    }];