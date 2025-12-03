// utils/calculos.ts
export function calcularNecesidadBultos(consumoPorUnidadKg: number, cantidadCerdos: number, presentacionKg: number) {
  const totalKgNecesarios = consumoPorUnidadKg * cantidadCerdos;
  const bultos = Math.ceil(totalKgNecesarios / presentacionKg);
  return { totalKgNecesarios, bultos };
}

export function calcularTotalPrecio(bultos: number, precioBulto: number) {
  return bultos * precioBulto;
}
