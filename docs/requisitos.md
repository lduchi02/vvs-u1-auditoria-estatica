# Fase A · Revisión de requisitos y trazabilidad

**Proyecto:** Módulo de descuentos – tienda digital
**Artefactos revisados:** requisitos originales R-01 a R-04 y `src/descuentos.js` (versión inicial)
**Técnica:** revisión estática de requisitos guiada por checklist (`docs/checklist.md`), sin ejecutar el software.

## 1. Requisitos originales

| ID | Texto original |
|----|----------------|
| R-01 | «El descuento debe calcularse rápidamente» |
| R-02 | «Los clientes importantes obtendrán un descuento especial» |
| R-03 | «El descuento no puede superar el precio, excepto en promociones» |
| R-04 | «Se debe mostrar el resultado correcto» |

## 2. Problemas detectados

| ID | Problema | Tipo de defecto | Por qué no es verificable |
|----|----------|-----------------|---------------------------|
| R-01 | «rápidamente» no tiene métrica, ni condición de carga, ni entorno de medición. | Ambigüedad / requisito no funcional sin métrica | No existe un criterio de aceptación que permita decir «pasa» o «no pasa». |
| R-02 | «clientes importantes» no está definido (¿VIP?, ¿por compras?, ¿por antigüedad?) y «descuento especial» no indica valor, tipo (porcentaje o monto fijo) ni si se acumula con el descuento normal. | Ambigüedad / incompletitud | El código implementa `+10` sin unidad; no se puede saber si es correcto porque el requisito no dice qué esperar. |
| R-03 | No dice qué ocurre si el descuento supera el precio (¿error?, ¿se limita?). «promociones» no está definido, y la excepción permitiría totales negativos. | Ambigüedad / contradicción potencial | La excepción contradice la regla principal y deja el comportamiento sin definir. |
| R-04 | «resultado correcto» no define qué resultado (descuento o total), dónde se muestra, ni el formato (decimales, moneda, redondeo). | Ambigüedad / requisito circular | «Correcto» depende de una especificación que no existe. |

## 3. Requisitos reformulados (verificables)

> Los valores marcados como **[SUPUESTO-n]** son propuestas del equipo técnico y quedan **pendientes de confirmación** por el responsable de negocio.

**RF-01 – Tiempo de cálculo.**
La función `calcularDescuento` debe devolver el resultado en **≤ 1 ms por invocación (percentil 95)**, medido con 10 000 invocaciones consecutivas en Node.js LTS sobre el equipo de referencia del proyecto. **[SUPUESTO-1]** umbral de 1 ms y entorno de medición.
*Criterio de aceptación:* el informe de la prueba de rendimiento muestra p95 ≤ 1 ms.

**RF-02 – Descuento adicional para clientes VIP.**
Un cliente se considera VIP cuando el sistema recibe `esVip === true` (la clasificación la entrega el módulo de clientes **[SUPUESTO-2]**). A un cliente VIP se le suman **10 puntos porcentuales** al porcentaje de descuento ingresado **[SUPUESTO-3]** (no 10 unidades monetarias), y el porcentaje acumulado nunca supera el 100 %.
*Criterio de aceptación:* precio 100, porcentaje 20, VIP → descuento 30, total 70.

**RF-03 – Límite del descuento.**
El porcentaje de descuento debe ser un número entre **0 y 100** (incluidos). El descuento calculado nunca puede ser mayor que el precio, por lo que el total final nunca es negativo. Si el porcentaje está fuera de rango, el precio no es un número finito mayor o igual a 0, o `esVip` no es booleano, la función **lanza un error** (`RangeError`/`TypeError`) y no devuelve un valor. **[SUPUESTO-4]** Las «promociones» no tienen excepción en este módulo: si negocio requiere promociones con precio 0 o reembolso, se especificarán en un requisito aparte.
*Criterio de aceptación:* porcentaje 120 → error; precio −5 → error; ningún caso válido devuelve total < 0.

**RF-04 – Resultado y formato.**
La función devuelve el **total a pagar** (precio − descuento) como número **redondeado a 2 decimales** (centavos, redondeo half-up) en la moneda del precio de entrada (USD **[SUPUESTO-5]**). La presentación en pantalla (símbolo de moneda, separadores) es responsabilidad de la capa de interfaz.
*Criterio de aceptación:* precio 19.99, porcentaje 15, no VIP → total 16.99.

## 4. Supuestos de negocio pendientes de confirmación

| Supuesto | Descripción | Responsable | Estado |
|----------|-------------|-------------|--------|
| SUPUESTO-1 | Umbral de rendimiento de 1 ms (p95) y entorno de medición. | Product owner | Pendiente de confirmación |
| SUPUESTO-2 | La condición VIP la decide el módulo de clientes y llega como booleano. | Product owner | Pendiente de confirmación |
| SUPUESTO-3 | El beneficio VIP es +10 puntos porcentuales (no un monto fijo de 10) y es acumulable con el descuento normal. | Product owner / Marketing | Pendiente de confirmación |
| SUPUESTO-4 | No existe excepción por «promociones» en este módulo; el total nunca es negativo. | Product owner / Marketing | Pendiente de confirmación |
| SUPUESTO-5 | Moneda USD, redondeo a 2 decimales half-up. | Finanzas | Pendiente de confirmación |

## 5. Matriz de trazabilidad

| ID | Problema | Impacto | Propuesta | Artefacto | Estado |
|----|----------|---------|-----------|-----------|--------|
| R-01 → RF-01 | «Rápidamente» sin métrica ni entorno. | Medio: no se puede aceptar ni rechazar el rendimiento; discusiones subjetivas en la entrega. | Umbral p95 ≤ 1 ms con 10 000 invocaciones (SUPUESTO-1). | `docs/requisitos.md`, futura prueba de rendimiento | Reformulado · pendiente de confirmación |
| R-02 → RF-02 | «Clientes importantes» y «descuento especial» indefinidos; el código suma 10 sin unidad. | Alto: cobros incorrectos a clientes VIP (el `+10` se interpreta como monto fijo). | VIP = `esVip === true`; +10 puntos porcentuales con tope de 100 % (SUPUESTO-2, SUPUESTO-3). | `src/descuentos.js` (líneas 3 y 6 de la versión inicial), `docs/inspeccion.md` H-08 | Reformulado · pendiente de confirmación |
| R-03 → RF-03 | No define comportamiento si el descuento supera el precio; excepción «promociones» ambigua. | Alto: totales negativos (la tienda «paga» al cliente) y datos inválidos aceptados. | Porcentaje 0–100, precio ≥ 0, error ante entradas inválidas, total nunca negativo (SUPUESTO-4). | `src/descuentos.js` (líneas 4 y 5), `docs/inspeccion.md` H-09, H-10, H-11 | Reformulado · validación implementada; excepción de promociones pendiente |
| R-04 → RF-04 | «Resultado correcto» sin definición de qué se devuelve ni formato. | Medio: errores de redondeo con decimales y confusión entre descuento y total. | Devuelve el total redondeado a 2 decimales en la moneda de entrada (SUPUESTO-5). | `src/descuentos.js` (línea 6), `docs/inspeccion.md` H-12, H-13 | Reformulado · pendiente de confirmación |
