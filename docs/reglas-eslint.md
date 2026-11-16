# Fase B · Configuración de ESLint y justificación de reglas

## Entorno

| Herramienta | Versión |
|-------------|---------|
| Node.js | v24.22.1 |
| npm | 11.21.1 |
| ESLint | v10.15.0 (formato *flat config*, `eslint.config.js`) |
| Editor | Visual Studio Code con la extensión oficial de ESLint |

Pasos realizados:

```bash
npm init -y
npm install --save-dev eslint @eslint/js globals
# se crea eslint.config.js (configuración equivalente a npx eslint --init)
# se añade el script "lint": "eslint src/" en package.json
npm run lint > evidencias/lint-inicial.txt
```

Se parte de `js.configs.recommended` (reglas base que detectan errores probables, p. ej. `no-undef`) y se añaden reglas explícitas para el estilo y la seguridad del módulo.

## Reglas activadas y justificación

| Regla | Nivel | Qué detecta | Justificación para este módulo |
|-------|-------|-------------|--------------------------------|
| `no-var` | error | Declaraciones con `var`. | `var` tiene ámbito de función y *hoisting*; puede reutilizarse por accidente una variable dentro del bloque. `let`/`const` limitan el ámbito al bloque y hacen explícita la intención. |
| `eqeqeq` | error (`always`) | Uso de `==` / `!=`. | `==` aplica coerción de tipos: `esVip == true` es verdadero también con `1` o `"1"`, por lo que un dato mal tipado podría otorgar el beneficio VIP. `===` exige el tipo correcto. |
| `no-unused-vars` | error | Variables, funciones o parámetros declarados y no usados. | En código de cálculo una variable sin uso suele indicar un paso olvidado (p. ej. calcular un tope y no aplicarlo). En el código inicial no hubo infracciones, pero la regla se mantiene como control preventivo para las correcciones. |
| `curly` | error (`all`) | `if`/`else`/bucles sin llaves. | Un `if` de una línea sin llaves invita a añadir una segunda instrucción que quedaría fuera de la condición (defecto clásico tipo *goto fail*). |
| `prefer-const` | error | `let` que nunca se reasigna. | Complementa a `no-var`: lo que no cambia se declara `const` y el lector sabe que el valor es fijo. |
| `no-console` | warn | Uso de `console.*`. | Un módulo de negocio no debe comunicar errores por consola: el llamador no se entera y la ejecución continúa. Se deja como *warning* porque la consola sí es válida en scripts de apoyo. |
| `no-magic-numbers` | warn | Literales numéricos sin nombre (se ignoran 0, 1, 2 y 100). | El `10` del bono VIP no tiene nombre ni unidad, lo cual oculta una decisión de negocio. Se ignora 100 porque es la base natural de un porcentaje. |
| `no-implicit-coercion` | error | Conversiones implícitas (`!!x`, `+x`, `"" + x`). | En cálculos monetarios las conversiones deben ser explícitas. |
| `complexity` | warn (máx. 5) | Funciones con complejidad ciclomática alta. | Mantiene la función pequeña y fácil de revisar en una inspección. |

## Resultado del análisis inicial

Archivo: [`evidencias/lint-inicial.txt`](../evidencias/lint-inicial.txt)

```
✖ 7 problems (5 errors, 2 warnings)
```

| Línea:col | Regla | Severidad ESLint |
|-----------|-------|------------------|
| 2:3 | `no-var` | error |
| 3:13 | `eqeqeq` | error |
| 3:22 | `curly` | error |
| 3:46 | `no-magic-numbers` (10) | warning |
| 4:25 | `curly` | error |
| 4:25 | `no-console` | warning |
| 5:3 | `no-var` | error |

## Limitaciones observadas

ESLint revisa la **forma** del código, no su **significado**. No detectó que el total puede quedar negativo, que no se validan las entradas, que el bono VIP mezcla un monto fijo con un porcentaje, que falta el redondeo de moneda ni que el nombre de la función no coincide con lo que devuelve. Estos defectos se encontraron en la inspección humana (`docs/inspeccion.md`).
