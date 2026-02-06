import { ProductoEntity } from "@/src/domain/entities/Producto";

export class ProductoMapper {
  static toDomain(data: any): ProductoEntity {
    return new ProductoEntity(
      data.id,
      data.nombre,
      data.descripcion,
      data.presentacion_kg,
      data.precio_bulto,
      data.imagen,
    );
  }

  static toDomainList(dataList: any[]): ProductoEntity[] {
    return dataList.map((data) => this.toDomain(data));
  }
}
