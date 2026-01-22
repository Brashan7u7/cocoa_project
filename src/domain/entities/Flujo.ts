import { PantallaEntity } from "./Pantalla";

export interface FlujoData {
  id: string;
  titulo: string;
  subtitulo?: string;
  descripcion?: string;
  icono?: string;
  imagen?: string;
  pantalla_inicial: string;
  pantallas: any[];
}

export class FlujoEntity {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly subtitulo: string | undefined,
    public readonly descripcion: string | undefined,
    public readonly icono: string | undefined,
    public readonly imagen: string | undefined,
    public readonly pantallaInicial: string,
    public readonly pantallas: PantallaEntity[]
  ) {}

  getPantallaById(pantallaId: string): PantallaEntity | undefined {
    return this.pantallas.find((p) => p.id === pantallaId);
  }

  getPantallaInicial(): PantallaEntity | undefined {
    return this.getPantallaById(this.pantallaInicial);
  }

  getCantidadPantallas(): number {
    return this.pantallas.length;
  }

  getPantallasDelTipo(tipo: string): PantallaEntity[] {
    return this.pantallas.filter((p) => p.tipo === tipo);
  }
}
