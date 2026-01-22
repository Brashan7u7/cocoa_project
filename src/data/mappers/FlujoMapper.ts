import { FlujoEntity, FlujoData } from "../../domain/entities/Flujo";
import { PantallaMapper } from "./PantallaMapper";

export class FlujoMapper {
  static toDomain(data: FlujoData): FlujoEntity {
    const pantallas = data.pantallas
      ? PantallaMapper.toDomainList(data.pantallas)
      : [];

    return new FlujoEntity(
      data.id,
      data.titulo,
      data.subtitulo,
      data.descripcion,
      data.icono,
      data.imagen,
      data.pantalla_inicial,
      pantallas
    );
  }

  static toDomainList(dataList: FlujoData[]): FlujoEntity[] {
    return dataList.map((data) => this.toDomain(data));
  }
}
