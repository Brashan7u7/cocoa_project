export interface OpcionData {
  id: string;
  titulo: string;
  subtitulo?: string;
  icono?: string;
  imagen?: string;
  color_alerta?: string;
  mensaje_alerta?: string;
  mensaje_info?: string;
  siguiente_pantalla?: string;
  fase_destino?: string;
  rango?: string;
  detalle?: string;
  consumo_esperado?: string;
}

export class OpcionEntity {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly subtitulo: string | undefined,
    public readonly icono: string | undefined,
    public readonly imagen: string | undefined,
    public readonly colorAlerta: string | undefined,
    public readonly mensajeAlerta: string | undefined,
    public readonly mensajeInfo: string | undefined,
    public readonly siguientePantalla: string | undefined,
    public readonly faseDestino: string | undefined,
    public readonly rango: string | undefined,
    public readonly detalle: string | undefined,
    public readonly consumoEsperado: string | undefined
  ) {}

  tieneMensaje(): boolean {
    return !!(this.mensajeAlerta || this.mensajeInfo);
  }

  esAlerta(): boolean {
    return !!this.mensajeAlerta;
  }
}
