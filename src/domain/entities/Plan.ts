export type TipoPlan = "premium" | "economico";

export interface PlanData {
  id: string;
  nombre: string;
  tipo: TipoPlan;
  descripcion?: string;
  producto_id: string;
  linea_producto?: string;
  consumo_por_animal_kg?: number;
  duracion_fase_dias?: number;
  beneficios?: string[];
}

export class PlanEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly tipo: TipoPlan,
    public readonly descripcion: string | undefined,
    public readonly productoId: string,
    public readonly lineaProducto: string | undefined,
    public readonly consumoPorAnimalKg: number | undefined,
    public readonly duracionFaseDias: number | undefined,
    public readonly beneficios: string[]
  ) {}

  esPremium(): boolean {
    return this.tipo === "premium";
  }

  esEconomico(): boolean {
    return this.tipo === "economico";
  }

  calcularConsumoTotal(cantidadAnimales: number): number {
    if (!this.consumoPorAnimalKg) return 0;
    return cantidadAnimales * this.consumoPorAnimalKg;
  }

  getDescripcionCorta(): string {
    if (this.esPremium()) {
      return "Mayor desarrollo, mejor nutrición";
    }
    return "Desarrollo esperado, menor costo";
  }
}
