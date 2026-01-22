import { LocalDataSource } from "../datasources/LocalDataSource";
import { AccesorioMapper } from "../mappers/AccesorioMapper";
import { AccesorioEntity } from "../../domain/entities/Accesorio";
import { AccesorioRepository } from "../../domain/repositories/AccesorioRepository";

export class AccesorioRepositoryImpl implements AccesorioRepository {
  constructor(private localDataSource: LocalDataSource) {}

  async getAccesorios(): Promise<AccesorioEntity[]> {
    const data = await this.localDataSource.getAccesorios();
    return AccesorioMapper.toDomainList(data);
  }

  async getAccesoriosPorFase(fase: string): Promise<AccesorioEntity[]> {
    const data = await this.localDataSource.getAccesoriosPorFase(fase);
    return AccesorioMapper.toDomainList(data);
  }
}
