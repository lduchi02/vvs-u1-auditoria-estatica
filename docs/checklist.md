# Checklist de revisión estática

Checklist usado en la Fase A (requisitos) y en la Fase C (inspección del código). Cada pregunta se responde **Sí / No / N/A** con evidencia.

## A. Requisitos

| # | Pregunta | R-01 | R-02 | R-03 | R-04 |
|---|----------|------|------|------|------|
| 1 | ¿El requisito tiene un criterio de aceptación medible (valor, unidad, umbral)? | No | No | No | No |
| 2 | ¿Todos los términos están definidos sin ambigüedad (p. ej. «rápido», «importante», «promoción», «correcto»)? | No | No | No | No |
| 3 | ¿Especifica el comportamiento ante entradas inválidas o casos límite? | N/A | No | No | No |
| 4 | ¿Es consistente con los demás requisitos (sin contradicciones ni excepciones abiertas)? | Sí | Sí | No (la excepción de promociones contradice el límite) | Sí |
| 5 | ¿Indica unidades (porcentaje vs. monto, moneda, decimales)? | No | No | No | No |
| 6 | ¿Puede trazarse a una parte concreta del código o a una prueba? | No | Parcial (línea 3) | Parcial (líneas 4–5) | Parcial (línea 6) |
| 7 | ¿Los supuestos de negocio están explícitos y tienen responsable? | No | No | No | No |

## B. Código (`src/descuentos.js`)

| # | Pregunta | Resultado inicial | Hallazgo |
|---|----------|-------------------|----------|
| 8 | ¿Se validan tipos y rangos de los parámetros (`precio`, `porcentaje`, `esVip`)? | No | H-09 |
| 9 | ¿Los errores detienen el flujo o se informan al llamador (no solo se imprimen en consola)? | No, solo `console.log` y continúa | H-06, H-10 |
| 10 | ¿Existen números mágicos sin nombre ni unidad? | Sí, `10` en la línea 3 | H-08 |
| 11 | ¿Se usan comparaciones estrictas (`===`) y declaraciones `const`/`let`? | No | H-01, H-02, H-03 |
| 12 | ¿Todas las estructuras de control usan llaves? | No | H-04, H-05 |
| 13 | ¿El resultado puede ser negativo o fuera del dominio esperado? | Sí | H-11 |
| 14 | ¿Se controla el redondeo de valores monetarios? | No | H-12 |
| 15 | ¿El nombre de la función describe lo que devuelve? | No (devuelve el total, no el descuento) | H-13 |
| 16 | ¿El código está documentado (JSDoc: parámetros, retorno, errores)? | No | H-14 |

Total: **16 preguntas** (7 de requisitos y 9 de código).
