import { dataSource } from "../datasources";
import { AccesorioMapper } from "../mappers/AccesorioMapper";
import { AccesorioEntity } from "../../domain/entities/Accesorio";
import { AccesorioRepository } from "../../domain/repositories/AccesorioRepository";

export class AccesorioRepositoryImpl implements AccesorioRepository {
  async getAccesorios(): Promise<AccesorioEntity[]> {
    const data = await dataSource.getAccesorios();
    return AccesorioMapper.toDomainList(data);
  }

  async getAccesoriosPorFase(fase: string): Promise<AccesorioEntity[]> {
    const data = await dataSource.getAccesoriosPorFase(fase);
    return AccesorioMapper.toDomainList(data);
  }
}
