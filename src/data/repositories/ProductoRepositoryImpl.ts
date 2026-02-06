import { ProductoEntity } from "../../domain/entities/Producto";
import { ProductoRepository } from "../../domain/repositories/ProductoRepository";
import { dataSource } from "../datasources";
import { ProductoMapper } from "../mappers/ProductoMapper";

export class ProductoRepositoryImpl implements ProductoRepository {
  async getAll(): Promise<ProductoEntity[]> {
    const productos = await dataSource.getProductos();
    const allProducts = [
      ...productos.lechones,
      ...productos.engorda,
      ...productos.reproductores,
    ];
    return ProductoMapper.toDomainList(allProducts);
  }

  async getById(id: string): Promise<ProductoEntity | null> {
    const data = await dataSource.getProductoById(id);
    if (!data) return null;
    return ProductoMapper.toDomain(data);
  }

  async getByFase(fase: string): Promise<ProductoEntity[]> {
    const data = await dataSource.getProductosPorFase(fase);
    return ProductoMapper.toDomainList(data);
  }
}
