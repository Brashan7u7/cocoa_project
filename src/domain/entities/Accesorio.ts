export interface AccesorioData {
  id: string;
  nombre: string;
  descripcion: string;
  presentacion?: string;
  presentacion_kg?: number;
  precio: number;
  imagen?: string;
  recomendado_para?: string[];
}

export class AccesorioEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly descripcion: string,
    public readonly presentacion: string | undefined,
    public readonly presentacionKg: number | undefined,
    public readonly precio: number,
    public readonly imagen: string | undefined,
    public readonly recomendadoPara: string[]
  ) {}

  esRecomendadoPara(faseId: string): boolean {
    return this.recomendadoPara.includes(faseId);
  }

  calcularCantidadSugerida(cantidadAnimales: number, formulaMultiplicador: number = 0.2): number {
    return cantidadAnimales * formulaMultiplicador;
  }
}
