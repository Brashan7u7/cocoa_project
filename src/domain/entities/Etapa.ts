import { PlanEntity } from "./Plant";
import { VariableCapturaEntity } from "./VariableCaptura";

export interface EtapaData {
  id: string;
  titulo: string;
  rangoEdadDias?: string;
  rangoPeso?: string;
  imagenRef: string;
  //Nuevos
  requiereCaptura: boolean;
  variableCaptura?: VariableCapturaEntity;
  planes: PlanEntity[];
  //Eliminar
  // productoRecomendado: ProductoEntity;
}

export class EtapaEntity {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly rangoEdadDias: string | undefined,
    public readonly rangoPeso: string | undefined,
    public readonly imagenRef: string,

    // Nuevo
    public readonly requiereCaptura: boolean,
    public readonly variableCaptura: VariableCapturaEntity | undefined,
    public readonly planes: PlanEntity[],

    // Eliminar
    // public readonly productoRecomendado: ProductoEntity
  ) {}

  getRangoDescripcion(): string {
    return this.rangoEdadDias || this.rangoPeso || "Sin rango especificado";
  }

  getTipoRango(): "edad" | "peso" | "ninguno" {
    if (this.rangoEdadDias) return "edad";
    if (this.rangoPeso) return "peso";
    return "ninguno";
  }

  // Nuevo: Obtener plan por ID
  getPlanById(planId: string): PlanEntity | undefined {
    return this.planes.find((plan) => plan.id === planId);
  }

  // Nuevo: obtener plan por defecto (el primero)
  getPlanDefault(): PlanEntity | undefined {
    return this.planes[0];
  }
}
