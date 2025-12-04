import { CategoriaEntity } from '../entities/Categoria';

export interface CategoriaRepository {
  getCategorias(): Promise<CategoriaEntity[]>;
}