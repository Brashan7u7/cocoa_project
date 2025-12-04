import { ProductoEntity } from './Producto';

export interface EtapaData {
  id: string;
  titulo: string;
  rangoEdadDias?: string;
  rangoPeso?: string;
  imagenRef: string;
  productoRecomendado: ProductoEntity;
}

export class EtapaEntity {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly rangoEdadDias: string | undefined,
    public readonly rangoPeso: string | undefined,
    public readonly imagenRef: string,
    public readonly productoRecomendado: ProductoEntity
  ) {}

  getRangoDescripcion(): string {
    return this.rangoEdadDias || this.rangoPeso || 'Sin rango especificado';
  }

  getTipoRango(): 'edad' | 'peso' | 'ninguno' {
    if (this.rangoEdadDias) return 'edad';
    if (this.rangoPeso) return 'peso';
    return 'ninguno';
  }
}