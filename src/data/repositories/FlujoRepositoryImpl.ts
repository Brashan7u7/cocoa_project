import { LocalDataSource } from "../datasources/LocalDataSource";
import { FlujoMapper } from "../mappers/FlujoMapper";
import { FlujoEntity } from "../../domain/entities/Flujo";
import { FlujoRepository } from "../../domain/repositories/FlujoRepository";

export class FlujoRepositoryImpl implements FlujoRepository {
  constructor(private localDataSource: LocalDataSource) {}

  async getFlujos(): Promise<FlujoEntity[]> {
    const data = await this.localDataSource.getFlujos();
    return FlujoMapper.toDomainList(data);
  }

  async getFlujoById(id: string): Promise<FlujoEntity | null> {
    const data = await this.localDataSource.getFlujoById(id);
    if (!data) return null;
    return FlujoMapper.toDomain(data);
  }
}
