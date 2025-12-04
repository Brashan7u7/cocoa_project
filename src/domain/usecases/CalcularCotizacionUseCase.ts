import { ProductoEntity } from '../entities/Producto';

export interface CotizacionResult {
  producto: ProductoEntity;
  cantidadCerdos: number;
  kilogramosNecesarios: number;
  bultosNecesarios: number;
  costoTotal: number;
  costoPorCerdo: number;
}

export class CalcularCotizacionUseCase {
  execute(producto: ProductoEntity, cantidadCerdos: number): CotizacionResult {
    if (cantidadCerdos <= 0) {
      throw new Error('La cantidad de cerdos debe ser mayor a 0');
    }

    const kilogramosNecesarios = producto.calcularKilogramosNecesarios(cantidadCerdos);
    const bultosNecesarios = producto.calcularBultosNecesarios(cantidadCerdos);
    const costoTotal = producto.calcularCostoTotal(cantidadCerdos);
    const costoPorCerdo = costoTotal / cantidadCerdos;

    return {
      producto,
      cantidadCerdos,
      kilogramosNecesarios,
      bultosNecesarios,
      costoTotal,
      costoPorCerdo,
    };
  }
}