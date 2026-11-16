# Fase D · Acta de revisión del pull request

| Campo | Detalle |
|-------|---------|
| Pull request | [#1 – Correcciones de la inspección estática en el módulo de descuentos](https://github.com/lduchi02/vvs-u1-auditoria-estatica/pull/1) |
| Rama | `fix/correcciones-inspeccion` → `main` |
| Fecha | 15 de noviembre de 2026 |
| Autor de los cambios | Luis Duchi (rol autor) |
| Revisor | Luis Duchi (rol revisor, sesión separada; ver nota metodológica en `docs/inspeccion.md`) |
| Registrador | Luis Duchi (rol registrador) |
| Artefacto revisado | `src/descuentos.js`, `evidencias/lint-final.txt` |

> Como la actividad es individual, la revisión se hizo desde la misma cuenta de GitHub en una pasada separada con el rol de revisor. Por eso la revisión es de tipo *comentario* (GitHub no permite aprobar un PR propio); la aprobación se registra en esta acta.

## Comentarios técnicos de la revisión

| # | Línea | Comentario | Respuesta del autor | Estado |
|---|-------|------------|---------------------|--------|
| C-1 | `src/descuentos.js` L72 | `PORCENTAJE_MAXIMO` se usaba como divisor: mezcla el límite de validación con la base porcentual; si cambia el tope, el cálculo cambiaría sin querer. Sugerencia: constante `BASE_PORCENTUAL`. | Corregido en el commit *Separa BASE_PORCENTUAL del límite de validación*. Lint sigue en 0 problemas. | Resuelto |
| C-2 | `src/descuentos.js` L74 | El bono VIP sigue siendo un monto fijo sobre un descuento porcentual (H-08); con precio < 10 y VIP el total queda en 0. | Se mantiene sin cambios hasta confirmar SUPUESTO-3. | Pendiente de confirmación (negocio) |
| C-3 | `src/descuentos.js` L80 | El tope con `Math.min` cumple R-03 (H-11); sin redondeo (H-12) y la excepción de promociones (H-15) tendría que entrar en este punto. | Se deja el tope aislado; H-12 y H-15 siguen pendientes. | Pendiente de confirmación (negocio) |
| C-4 | General | Las reglas de ESLint confirmadas (H-01 a H-07) están corregidas y `npm run lint` queda en 0 problemas. | — | Verificado |

## Verificación realizada

- `npm run lint` en la rama: 0 errores, 0 advertencias (`evidencias/lint-final.txt`).
- Contraste del diff con la tabla de hallazgos de `docs/inspeccion.md`: cada cambio corresponde a un hallazgo con estado *Corregido*.
- No se ejecutaron pruebas funcionales (verificación estática).

## Decisión

**Aprobado para integrar a `main`** (merge commit), con H-08, H-12, H-13 y H-15 registrados como pendientes para la siguiente iteración.
