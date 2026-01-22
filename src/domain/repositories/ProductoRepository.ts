import { ProductoEntity } from "../entities/Producto";

export interface ProductoRepository {
  getAll(): Promise<ProductoEntity[]>;
  getById(id: string): Promise<ProductoEntity | null>;
  getByFase(fase: string): Promise<ProductoEntity[]>;
}
