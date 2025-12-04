import { CategoriaEntity } from '../entities/Categoria';
import { CategoriaRepository } from '../respositories/CategoriaRepository';


export class GetCategoriaByIdUseCase {
  constructor(private categoriaRepository: CategoriaRepository) {}

  async execute(categoriaId: string): Promise<CategoriaEntity | undefined> {
    const categorias = await this.categoriaRepository.getCategorias();
    return categorias.find(cat => cat.id === categoriaId);
  }
}