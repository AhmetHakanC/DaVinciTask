import js from "@eslint/js"
import tseslint from "typescript-eslint"
import react from "eslint-plugin-react"

export default tseslint.config(
    {
        ignores: ["dist", "node_modules", "*.config.js", "*.config.cjs", "*.config.mjs"]
    },
    js.configs.recommended,
    {
        files: ["**/*.{ts,tsx}"],
        plugins: { react },
        extends: [
            ...tseslint.configs.recommendedTypeChecked
        ],
        languageOptions: {
            parserOptions: {
                ecmaVersion: "latest",
                sourceType: "module",
                tsconfigRootDir: import.meta.dirname,
                project: ["./tsconfig.app.json", "./tsconfig.node.json"]
            }
        },
        rules: {
            "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
            "react/react-in-jsx-scope": "off"
        }
    }
)
