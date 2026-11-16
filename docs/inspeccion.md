# Fase C · Acta de inspección por pares

| Campo | Detalle |
|-------|---------|
| Artefacto inspeccionado | `src/descuentos.js` (versión inicial, commit `59ab063`) |
| Documentos de apoyo | `docs/requisitos.md`, `docs/checklist.md`, `evidencias/lint-inicial.txt` |
| Fecha | 15 de noviembre de 2026 |
| Tipo de revisión | Inspección estática (basada en Fagan, 1976) con roles rotados, sin ejecución del código |
| Duración total | 85 minutos en tres sesiones con *time-box* (ver tabla de sesiones) |

## Participantes y roles

| Rol | Participante | Responsabilidad |
|-----|--------------|-----------------|
| Autor | Luis Duchi | Presenta el código y el contexto, responde dudas y aplica las correcciones aprobadas. |
| Revisor | Luis Duchi | Lee el código línea por línea con el checklist y los requisitos reformulados, buscando defectos. |
| Registrador | Luis Duchi | Registra cada hallazgo con severidad, evidencia, acción y estado; consolida las decisiones. |

### Nota metodológica

La actividad se realizó de forma **individual**, por lo que los tres roles fueron asumidos por la misma persona en **sesiones separadas y con tiempo limitado** (inspección individual con roles rotados / *self-review*). La principal limitación de este enfoque es el **sesgo del autor**: quien escribió o conoce el código tiende a leer lo que *quiso* escribir y no lo que realmente está escrito. Para reducir ese sesgo se aplicaron tres medidas:

1. **Checklist escrito** (`docs/checklist.md`): obliga a responder preguntas concretas en lugar de hacer una lectura libre.
2. **ESLint como segundo revisor automático**: aporta una revisión objetiva de las reglas de estilo y seguridad, independiente del criterio del autor.
3. **Pausa entre sesiones**: se dejó un descanso entre el rol de autor y el de revisor para leer el código "con ojos frescos".

Aun así, una inspección con otra persona habría aportado otra interpretación de los requisitos de negocio; por eso los hallazgos que dependen de negocio se dejan **pendientes de confirmación**.

### Sesiones

| Sesión | Rol asumido | Time-box | Actividad |
|--------|-------------|----------|-----------|
| 1 | Autor | 20 min | Preparación: contexto del módulo, requisitos R-01 a R-04, ejecución de `npm run lint` (análisis estático, no pruebas funcionales). |
| — | — | Pausa | Descanso antes de revisar. |
| 2 | Revisor | 45 min | Lectura línea por línea con el checklist (preguntas 8–16) y contraste con RF-01 a RF-04. |
| 3 | Registrador | 20 min | Registro y clasificación de hallazgos, decisión de qué se corrige y qué queda pendiente. |

## Escala de severidad

- **Alta:** puede producir un resultado económico incorrecto o aceptar datos inválidos.
- **Media:** dificulta el mantenimiento o puede derivar en defectos al modificar el código.
- **Baja:** estilo o documentación, sin impacto directo en el resultado.

## Hallazgos

Origen: **ESLint** = reportado por el análisis automático (`evidencias/lint-inicial.txt`); **Humano** = encontrado por el revisor y no detectable por las reglas configuradas.

| ID | Origen | Severidad | Descripción | Evidencia (línea) | Acción | Estado |
|----|--------|-----------|-------------|-------------------|--------|--------|
| H-01 | ESLint (`no-var`) | Media | `var descuento` con ámbito de función. | L2:3 | Cambiar a `let` (se reasigna con el bono VIP). | Corregido |
| H-02 | ESLint (`no-var`) | Media | `var total`. | L5:3 | Cambiar a `const`. | Corregido |
| H-03 | ESLint (`eqeqeq`) | Alta | `esVip == true` acepta `1` o `"1"` por coerción y otorga el bono VIP a datos mal tipados. | L3:13 | Comparación estricta `esVip === true` y validación de tipo booleano. | Corregido |
| H-04 | ESLint (`curly`) | Media | `if` del bono VIP sin llaves. | L3:22 | Añadir llaves. | Corregido |
| H-05 | ESLint (`curly`) | Media | `if` de porcentaje inválido sin llaves. | L4:25 | Añadir llaves. | Corregido |
| H-06 | ESLint (`no-console`) | Media | El error se informa con `console.log`; el llamador no se entera. | L4:25 | Eliminar `console.log`; ver H-10. | Corregido |
| H-07 | ESLint (`no-magic-numbers`) | Baja | Literal `10` sin nombre. | L3:46 | Extraer a la constante `BONO_VIP`. | Corregido |
| H-08 | Humano | Alta | El bono VIP suma **10 unidades monetarias** al descuento, mientras el descuento normal es un **porcentaje**: mezcla unidades. Con precio 5 y VIP el descuento (≥10) ya supera el precio. R-02 no define el valor. | L3 | Mantener el comportamiento actual en una constante con nombre y documentar SUPUESTO-3 (+10 puntos porcentuales). | Pendiente de confirmación (negocio) |
| H-09 | Humano | Alta | No se valida ninguna entrada: `precio` negativo, `NaN`, texto o `porcentaje` negativo producen resultados sin sentido. | L1–L2 | Validar que `precio` sea número finito ≥ 0, `porcentaje` número entre 0 y 100 y `esVip` booleano; lanzar `TypeError`/`RangeError`. | Corregido |
| H-10 | Humano | Alta | Si `porcentaje > 100` solo se imprime un mensaje y **la ejecución continúa**, devolviendo un total calculado con el dato inválido. | L4 | Lanzar `RangeError` y detener el cálculo. | Corregido |
| H-11 | Humano | Alta | Cuando el descuento supera el precio el total es **negativo** (p. ej. precio 5, VIP), en contra de R-03. | L5 | Limitar el descuento al precio (`Math.min`) para que el total nunca sea negativo. | Corregido (la excepción de promociones queda en H-15) |
| H-12 | Humano | Media | No hay redondeo monetario; operaciones con decimales pueden dar valores como `16.9915`. | L2, L5 | Redondear a 2 decimales según RF-04. | Pendiente de confirmación (SUPUESTO-5: moneda y tipo de redondeo) |
| H-13 | Humano | Media | La función se llama `calcularDescuento` pero **devuelve el total a pagar**, no el descuento. | L1, L6 | Renombrar a `calcularTotalConDescuento` o devolver ambos valores. | Aceptado, diferido: cambiar el nombre rompe la interfaz pública; se documenta el retorno con JSDoc. |
| H-14 | Humano | Baja | No hay documentación de parámetros, retorno ni errores. | L1 | Añadir JSDoc. | Corregido |
| H-15 | Humano | Media | La excepción «excepto en promociones» de R-03 no está implementada ni definida; no se sabe cómo se identifica una promoción. | L5 (sin código) | No implementar hasta que negocio la defina (SUPUESTO-4). | Pendiente de confirmación (negocio) |

**Resumen:** 15 hallazgos: 7 de ESLint y 8 de revisión humana. 4 de severidad alta detectados solo por revisión humana (H-08, H-09, H-10, H-11).

| Origen | Alta | Media | Baja | Total |
|--------|------|-------|------|-------|
| ESLint | 1 | 5 | 1 | 7 |
| Humano | 4 | 3 | 1 | 8 |
| **Total** | **5** | **8** | **2** | **15** |

## Decisiones

1. Se corrigen **solo** los hallazgos confirmados: todas las reglas de ESLint (H-01 a H-07) y los defectos humanos que no dependen de una decisión de negocio (H-09, H-10, H-11, H-14).
2. H-08, H-12 y H-15 dependen de supuestos de negocio (SUPUESTO-3, 4 y 5 de `docs/requisitos.md`) y quedan **pendientes de confirmación**; no se cambia el comportamiento del bono VIP ni se agrega redondeo.
3. H-13 se acepta pero se difiere para no romper la interfaz pública del módulo.
4. Las correcciones se realizan en la rama `fix/correcciones-inspeccion` y se revisan mediante *pull request* antes de integrarse a `main`. Tras corregir se guarda `evidencias/lint-final.txt`.
5. No se ejecutaron pruebas funcionales: la verificación es estática (lectura y ESLint). Las pruebas dinámicas quedan para una siguiente iteración.

## Criterio de salida

- `npm run lint` sin errores ni advertencias.
- Todos los hallazgos con estado asignado.
- Pull request revisado con al menos dos comentarios técnicos.
