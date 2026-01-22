import { PlanEntity, PlanData, TipoPlan } from "../../domain/entities/Plan";

export class PlanMapper {
  static toDomain(data: PlanData): PlanEntity {
    return new PlanEntity(
      data.id,
      data.nombre,
      data.tipo as TipoPlan,
      data.descripcion,
      data.producto_id,
      data.linea_producto,
      data.consumo_por_animal_kg,
      data.duracion_fase_dias,
      data.beneficios || []
    );
  }

  static toDomainList(dataList: PlanData[]): PlanEntity[] {
    return dataList.map((data) => this.toDomain(data));
  }
}
