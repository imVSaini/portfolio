import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettierRecommended from "eslint-plugin-prettier/recommended";
import tailwindcss from "eslint-plugin-tailwindcss";

const tailwindRecommended =
  tailwindcss.configs["flat/recommended"] ?? tailwindcss.configs.recommended;

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  tailwindRecommended,
  {
    files: tailwindRecommended.files,
    settings: {
      tailwindcss: {
        cssConfigPath: "./src/app/globals.css",
      },
    },
    rules: {
      // Class order is owned by prettier-plugin-tailwindcss.
      "tailwindcss/classnames-order": "off",
      // The sketchbook's own component classes, defined in src/app/globals.css.
      "tailwindcss/no-custom-classname": [
        "warn",
        {
          whitelist: [
            "btn(--ghost|--small)?",
            "card(--lift|--taped)?",
            "chip(--featured)?",
            "clay",
            "display",
            "eyebrow",
            "ghost",
            "grain",
            "hl",
            "ink(-layer|-seal-mark|-seal-ring|-step-fill)?",
            "link-line",
            "logo-(draw|shadow|tile)",
            "specimen-(drop|ghost|line|tag)",
            "tap-area",
            "thin",
            "ticks",
            "title",
          ],
        },
      ],
    },
  },
  // Runs Prettier (incl. prettier-plugin-tailwindcss class sorting) as an ESLint rule
  // and disables stylistic rules that would conflict with it. Keep last.
  prettierRecommended,
  {
    rules: {
      "prettier/prettier": "warn",
      "@typescript-eslint/consistent-type-imports": ["warn", { fixStyle: "inline-type-imports" }],
    },
  },
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
