import { dataSource } from "../datasources";
import { FlujoMapper } from "../mappers/FlujoMapper";
import { FlujoEntity } from "../../domain/entities/Flujo";
import { FlujoRepository } from "../../domain/repositories/FlujoRepository";

export class FlujoRepositoryImpl implements FlujoRepository {
  async getFlujos(): Promise<FlujoEntity[]> {
    const data = await dataSource.getFlujos();
    return FlujoMapper.toDomainList(data);
  }

  async getFlujoById(id: string): Promise<FlujoEntity | null> {
    const data = await dataSource.getFlujoById(id);
    if (!data) return null;
    return FlujoMapper.toDomain(data);
  }
}
