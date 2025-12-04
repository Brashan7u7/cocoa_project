
import { CategoriaRepository } from '@/src/domain/respositories/CategoriaRepository';
import { CategoriaEntity } from '../../domain/entities/Categoria';
import { LocalDataSource } from '../datasources/LocalDataSource';
import { CategoriaMapper } from '../mappers/CategoriaMapper';

export class CategoriaRepositoryImpl implements CategoriaRepository {
  constructor(private localDataSource: LocalDataSource) {}

  async getCategorias(): Promise<CategoriaEntity[]> {
    const data = await this.localDataSource.getCategorias();
    return CategoriaMapper.toDomainList(data);
  }
}


