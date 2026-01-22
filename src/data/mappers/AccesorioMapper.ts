import { AccesorioEntity, AccesorioData } from "../../domain/entities/Accesorio";

export class AccesorioMapper {
  static toDomain(data: AccesorioData): AccesorioEntity {
    return new AccesorioEntity(
      data.id,
      data.nombre,
      data.descripcion,
      data.presentacion,
      data.presentacion_kg,
      data.precio,
      data.imagen,
      data.recomendado_para || []
    );
  }

  static toDomainList(dataList: AccesorioData[]): AccesorioEntity[] {
    return dataList.map((data) => this.toDomain(data));
  }
}
