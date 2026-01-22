import { PantallaEntity, PantallaData, TipoPantalla } from "../../domain/entities/Pantalla";
import { VariableCapturaEntity } from "../../domain/entities/VariableCaptura";
import { OpcionMapper } from "./OpcionMapper";

export class PantallaMapper {
  static toDomain(data: PantallaData): PantallaEntity {
    let variableCaptura: VariableCapturaEntity | undefined;

    if (data.variable_captura) {
      variableCaptura = new VariableCapturaEntity(
        data.variable_captura.nombre || "cantidad",
        data.variable_captura.label || "Ingresa la cantidad",
        data.variable_captura.tipo || "number",
        data.variable_captura.min || data.variable_captura.minimo || 1,
        data.variable_captura.max || data.variable_captura.maximo || 500
      );
    }

    const opciones = data.opciones
      ? OpcionMapper.toDomainList(data.opciones)
      : [];

    return new PantallaEntity(
      data.id,
      data.tipo as TipoPantalla,
      data.pregunta,
      data.titulo,
      data.mensaje,
      data.recomendacion,
      data.imagen,
      data.tipo_selector,
      data.boton_continuar || false,
      data.siguiente_pantalla,
      opciones,
      variableCaptura,
      data.mostrar_accesorios || false
    );
  }

  static toDomainList(dataList: PantallaData[]): PantallaEntity[] {
    return dataList.map((data) => this.toDomain(data));
  }
}
