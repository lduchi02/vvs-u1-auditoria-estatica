// Configuración de ESLint (flat config) para la auditoría estática del módulo de descuentos.
// La justificación de cada regla está en docs/reglas-eslint.md
const js = require("@eslint/js");
const globals = require("globals");

module.exports = [
  {
    ignores: ["node_modules/**", "evidencias/**"],
  },
  js.configs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "commonjs",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      // Reglas solicitadas en la actividad
      "no-var": "error",
      eqeqeq: ["error", "always"],
      "no-unused-vars": ["error", { args: "after-used" }],
      curly: ["error", "all"],

      // Reglas complementarias
      "prefer-const": "error",
      "no-console": "warn",
      "no-magic-numbers": ["warn", { ignore: [0, 1, 2, 100], ignoreDefaultValues: true }],
      "no-implicit-coercion": "error",
      complexity: ["warn", 5],
    },
  },
];
