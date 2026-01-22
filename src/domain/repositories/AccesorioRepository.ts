import { AccesorioEntity } from "../entities/Accesorio";

export interface AccesorioRepository {
  getAccesorios(): Promise<AccesorioEntity[]>;
  getAccesoriosPorFase(fase: string): Promise<AccesorioEntity[]>;
}
