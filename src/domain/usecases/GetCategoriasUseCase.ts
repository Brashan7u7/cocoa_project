import { CategoriaEntity } from '../entities/Categoria';
import { CategoriaRepository } from '../respositories/CategoriaRepository';


export class GetCategoriasUseCase {
  constructor(private categoriaRepository: CategoriaRepository) {}

  async execute(): Promise<CategoriaEntity[]> {
    return await this.categoriaRepository.getCategorias();
  }
}