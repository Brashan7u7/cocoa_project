import { OpcionEntity } from "./Opcion";
import { VariableCapturaEntity } from "./VariableCaptura";

export type TipoPantalla =
  | "inicio"
  | "seleccion"
  | "selector_fase"
  | "input"
  | "alerta"
  | "resultado"
  | "seleccion_plan";

export interface PantallaData {
  id: string;
  tipo: TipoPantalla;
  pregunta?: string;
  titulo?: string;
  mensaje?: string;
  recomendacion?: string;
  imagen?: string;
  tipo_selector?: string;
  boton_continuar?: boolean;
  siguiente_pantalla?: string;
  opciones?: any[];
  variable_captura?: any;
  mostrar_accesorios?: boolean;
}

export class PantallaEntity {
  constructor(
    public readonly id: string,
    public readonly tipo: TipoPantalla,
    public readonly pregunta: string | undefined,
    public readonly titulo: string | undefined,
    public readonly mensaje: string | undefined,
    public readonly recomendacion: string | undefined,
    public readonly imagen: string | undefined,
    public readonly tipoSelector: string | undefined,
    public readonly botonContinuar: boolean,
    public readonly siguientePantalla: string | undefined,
    public readonly opciones: OpcionEntity[],
    public readonly variableCaptura: VariableCapturaEntity | undefined,
    public readonly mostrarAccesorios: boolean
  ) {}

  getTitulo(): string {
    return this.titulo || this.pregunta || "";
  }

  tieneOpciones(): boolean {
    return this.opciones.length > 0;
  }

  getOpcionById(opcionId: string): OpcionEntity | undefined {
    return this.opciones.find((op) => op.id === opcionId);
  }

  getSiguientePantalla(opcionSeleccionada?: OpcionEntity): string | undefined {
    if (opcionSeleccionada?.siguientePantalla) {
      return opcionSeleccionada.siguientePantalla;
    }
    return this.siguientePantalla;
  }
}
