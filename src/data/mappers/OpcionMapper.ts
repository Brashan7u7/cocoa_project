import { OpcionEntity, OpcionData } from "../../domain/entities/Opcion";

export class OpcionMapper {
  static toDomain(data: OpcionData): OpcionEntity {
    return new OpcionEntity(
      data.id,
      data.titulo,
      data.subtitulo,
      data.icono,
      data.imagen,
      data.color_alerta,
      data.mensaje_alerta,
      data.mensaje_info,
      data.siguiente_pantalla,
      data.fase_destino,
      data.rango,
      data.detalle,
      data.consumo_esperado
    );
  }

  static toDomainList(dataList: OpcionData[]): OpcionEntity[] {
    return dataList.map((data) => this.toDomain(data));
  }
}
