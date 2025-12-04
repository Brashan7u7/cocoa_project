import { CategoriaEntity } from '../../domain/entities/Categoria';
import { EtapaEntity } from '../../domain/entities/Etapa';
import { ProductoEntity } from '../../domain/entities/Producto';

export class CategoriaMapper {
  static toDomain(data: any): CategoriaEntity {
    const etapas = data.etapas.map((etapaData: any) => {
      const producto = new ProductoEntity(
        etapaData.producto_recomendado.nombre,
        etapaData.producto_recomendado.descripcion,
        etapaData.producto_recomendado.presentacion_kg,
        etapaData.producto_recomendado.precio_bulto,
        etapaData.producto_recomendado.consumo_total_fase_kg,
        etapaData.producto_recomendado.nota_tecnica
      );

      return new EtapaEntity(
        etapaData.id,
        etapaData.titulo,
        etapaData.rango_edad_dias,
        etapaData.rango_peso,
        etapaData.imagen_ref,
        producto
      );
    });

    return new CategoriaEntity(
      data.id,
      data.titulo,
      data.descripcion,
      etapas
    );
  }

  static toDomainList(dataList: any[]): CategoriaEntity[] {
    return dataList.map(data => this.toDomain(data));
  }
}