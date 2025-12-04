import { EtapaEntity } from './Etapa';

export interface CategoriaData {
  id: string;
  titulo: string;
  descripcion: string;
  etapas: EtapaEntity[];
}

export class CategoriaEntity {
  constructor(
    public readonly id: string,
    public readonly titulo: string,
    public readonly descripcion: string,
    public readonly etapas: EtapaEntity[]
  ) {}

  getEtapaById(etapaId: string): EtapaEntity | undefined {
    return this.etapas.find(etapa => etapa.id === etapaId);
  }

  getCantidadEtapas(): number {
    return this.etapas.length;
  }
}