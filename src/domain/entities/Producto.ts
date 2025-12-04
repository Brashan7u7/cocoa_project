export interface Producto {
  nombre: string;
  descripcion: string;
  presentacionKg: number;
  precioBulto: number;
  consumoTotalFaseKg: number;
  notaTecnica: string;
}

export class ProductoEntity {
  constructor(
    public readonly nombre: string,
    public readonly descripcion: string,
    public readonly presentacionKg: number,
    public readonly precioBulto: number,
    public readonly consumoTotalFaseKg: number,
    public readonly notaTecnica: string
  ) {}

  calcularBultosNecesarios(cantidadCerdos: number): number {
    const consumoTotal = this.consumoTotalFaseKg * cantidadCerdos;
    return Math.ceil(consumoTotal / this.presentacionKg);
  }

  calcularCostoTotal(cantidadCerdos: number): number {
    const bultos = this.calcularBultosNecesarios(cantidadCerdos);
    return bultos * this.precioBulto;
  }

  calcularKilogramosNecesarios(cantidadCerdos: number): number {
    return this.consumoTotalFaseKg * cantidadCerdos;
  }
}