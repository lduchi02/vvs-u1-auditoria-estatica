/**
 * Bono adicional para clientes VIP.
 * Se mantiene el comportamiento original (se suma al monto del descuento).
 * PENDIENTE DE CONFIRMACIÓN (SUPUESTO-3, hallazgo H-08): negocio debe indicar
 * si son 10 unidades monetarias o 10 puntos porcentuales.
 */
const BONO_VIP = 10;

const PORCENTAJE_MINIMO = 0;
const PORCENTAJE_MAXIMO = 100;

/** Base para convertir un porcentaje en fracción (comentario de revisión del PR #1). */
const BASE_PORCENTUAL = 100;

/**
 * Valida que el precio sea un número finito mayor o igual a 0 (H-09).
 *
 * @param {number} precio - Precio original.
 * @throws {TypeError} Si el precio no es un número finito.
 * @throws {RangeError} Si el precio es negativo.
 */
function validarPrecio(precio) {
  if (typeof precio !== "number" || !Number.isFinite(precio)) {
    throw new TypeError("El precio debe ser un número finito");
  }
  if (precio < 0) {
    throw new RangeError("El precio no puede ser negativo");
  }
}

/**
 * Valida que el porcentaje esté entre 0 y 100 (H-09, H-10).
 *
 * @param {number} porcentaje - Porcentaje de descuento.
 * @throws {TypeError} Si el porcentaje no es un número finito.
 * @throws {RangeError} Si el porcentaje está fuera del rango permitido.
 */
function validarPorcentaje(porcentaje) {
  if (typeof porcentaje !== "number" || !Number.isFinite(porcentaje)) {
    throw new TypeError("El porcentaje debe ser un número finito");
  }
  if (porcentaje < PORCENTAJE_MINIMO || porcentaje > PORCENTAJE_MAXIMO) {
    throw new RangeError("Descuento inválido: el porcentaje debe estar entre 0 y 100");
  }
}

/**
 * Valida que la condición VIP sea booleana (H-03, H-09).
 *
 * @param {boolean} esVip - Indica si el cliente es VIP.
 * @throws {TypeError} Si esVip no es booleano.
 */
function validarVip(esVip) {
  if (typeof esVip !== "boolean") {
    throw new TypeError("esVip debe ser booleano");
  }
}

/**
 * Calcula el total a pagar después de aplicar el descuento.
 * Nota (H-13): aunque se llama calcularDescuento, devuelve el TOTAL a pagar.
 * El cambio de nombre queda diferido para no romper la interfaz pública.
 *
 * @param {number} precio - Precio original, número finito mayor o igual a 0.
 * @param {number} porcentaje - Porcentaje de descuento entre 0 y 100.
 * @param {boolean} esVip - Indica si el cliente es VIP.
 * @returns {number} Total a pagar (precio - descuento), nunca negativo.
 * @throws {TypeError|RangeError} Si las entradas no son válidas.
 */
function calcularDescuento(precio, porcentaje, esVip) {
  validarPrecio(precio);
  validarPorcentaje(porcentaje);
  validarVip(esVip);

  let descuento = precio * porcentaje / BASE_PORCENTUAL;
  if (esVip === true) {
    descuento = descuento + BONO_VIP;
  }

  // H-11: el descuento no puede superar el precio (R-03), el total nunca es negativo.
  // La excepción por promociones queda pendiente de confirmación (H-15, SUPUESTO-4).
  // El redondeo monetario queda pendiente de confirmación (H-12, SUPUESTO-5).
  const descuentoAplicado = Math.min(descuento, precio);
  const total = precio - descuentoAplicado;
  return total;
}

module.exports = { calcularDescuento };
