export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  presentacionKg: number;
  precioBulto: number;
  imagen?: string;
}

export class ProductoEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion: string,
    public readonly presentacionKg: number,
    public readonly precioBulto: number,
    public readonly imagen?: string,
  ) {}

  // Antigulo
  // calcularBultosNecesarios(cantidadCerdos: number): number {
  //   const consumoTotal = this.consumoTotalFaseKg * cantidadCerdos;
  //   return Math.ceil(consumoTotal / this.presentacionKg);
  // }

  //Nuevo
  calcularBultosNecesarios(consumoTotalKg: number) {
    return Math.ceil(consumoTotalKg / this.presentacionKg);
  }

  // Antiguo
  // calcularCostoTotal(cantidadCerdos: number): number {
  //   const bultos = this.calcularBultosNecesarios(cantidadCerdos);
  //   return bultos * this.precioBulto;
  // }

  //Nuevo
  calcularCostoTotal(consumoTotalKg: number): number {
    const bultos = this.calcularBultosNecesarios(consumoTotalKg);
    return bultos * this.precioBulto;
  }

  //Eliminar
  // calcularKilogramosNecesarios(cantidadCerdos: number): number {
  //   return this.consumoTotalFaseKg * cantidadCerdos;
  // }
}
