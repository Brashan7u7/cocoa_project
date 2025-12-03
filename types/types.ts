// types.ts
export interface Producto {
  nombre: string;
  descripcion: string;
  presentacion_kg: number;
  precio_bulto: number;
  consumo_total_fase_kg: number;
  nota_tecnica?: string;
}

export interface Etapa {
  id: string;
  titulo: string;
  imagen_ref: string;
  rango_edad_dias?: string;
  rango_peso?: string;
  producto_recomendado: Producto;
}

export interface Categoria {
  id: string;
  titulo: string;
  descripcion?: string;
  etapas: Etapa[];
}

export interface NutricionData {
  categorias: Categoria[];
}
