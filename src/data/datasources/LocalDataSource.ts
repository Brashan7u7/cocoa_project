export const nutricionPorcinaData = {
  "categorias": [
    {
      "id": "reproduccion",
      "titulo": "Reproducción",
      "descripcion": "Machos y hembras reproductores",
      "etapas": [
        {
          "id": "hembra_gestacion",
          "titulo": "Hembra en Gestación",
          "rango_edad_dias": "Durante gestación (114 días)",
          "imagen_ref": "img_hembra_gestacion.png",
          "producto_recomendado": {
            "nombre": "Repro Gestación Plus",
            "descripcion": "Nutrición balanceada para hembras gestantes con minerales esenciales.",
            "presentacion_kg": 40,
            "precio_bulto": 1350.00,
            "consumo_total_fase_kg": 285.0,
            "nota_tecnica": "Consumo diario de 2.5kg durante los 114 días de gestación."
          }
        },
        {
          "id": "hembra_lactancia",
          "titulo": "Hembra en Lactancia",
          "rango_edad_dias": "Durante lactancia (21-28 días)",
          "imagen_ref": "img_hembra_lactancia.png",
          "producto_recomendado": {
            "nombre": "Lacta Forte Premium",
            "descripcion": "Alto contenido energético para producción de leche óptima.",
            "presentacion_kg": 40,
            "precio_bulto": 1450.00,
            "consumo_total_fase_kg": 168.0,
            "nota_tecnica": "Consumo diario de 6kg durante 28 días de lactancia."
          }
        },
        {
          "id": "macho_reproductor",
          "titulo": "Macho Reproductor",
          "rango_edad_dias": "Adulto en servicio",
          "imagen_ref": "img_macho_reproductor.png",
          "producto_recomendado": {
            "nombre": "Repro Macho Elite",
            "descripcion": "Fórmula especializada para mantener condición corporal y libido.",
            "presentacion_kg": 40,
            "precio_bulto": 1280.00,
            "consumo_total_fase_kg": 90.0,
            "nota_tecnica": "Consumo diario de 3kg durante 30 días."
          }
        },
        {
          "id": "hembra_reemplazo",
          "titulo": "Hembra de Reemplazo",
          "rango_edad_dias": "150 - 210 días",
          "imagen_ref": "img_hembra_reemplazo.png",
          "producto_recomendado": {
            "nombre": "Desarrollo Reproductoras",
            "descripcion": "Desarrollo óptimo para futuras reproductoras.",
            "presentacion_kg": 40,
            "precio_bulto": 1150.00,
            "consumo_total_fase_kg": 150.0,
            "nota_tecnica": "Consumo diario de 2.5kg durante 60 días de desarrollo."
          }
        }
      ]
    },
    {
      "id": "criar_lechones",
      "titulo": "Criar Lechones",
      "descripcion": "Desde el nacimiento hasta los 60 días",
      "etapas": [
        {
          "id": "fase_1_lactancia",
          "titulo": "Fase I - Lactancia",
          "rango_edad_dias": "7 - 21 días",
          "imagen_ref": "img_cerdito_fase1.png",
          "producto_recomendado": {
            "nombre": "Bio Start Pre-Iniciador",
            "descripcion": "Alta digestibilidad para lechones en lactancia.",
            "presentacion_kg": 25,
            "precio_bulto": 850.00,
            "consumo_total_fase_kg": 3.5,
            "nota_tecnica": "Consumo estimado por lechón durante los 14 días de esta fase."
          }
        },
        {
          "id": "fase_2_destete",
          "titulo": "Fase II - Destetados",
          "rango_edad_dias": "21 - 28 días",
          "imagen_ref": "img_cerdito_fase2.png",
          "producto_recomendado": {
            "nombre": "Bio Nova 2",
            "descripcion": "Fórmula especial para reducir el estrés del destete.",
            "presentacion_kg": 40,
            "precio_bulto": 1200.00,
            "consumo_total_fase_kg": 5.0,
            "nota_tecnica": "Consumo para la primera semana post-destete."
          }
        },
        {
          "id": "fase_3_transicion",
          "titulo": "Fase III - Transición",
          "rango_edad_dias": "42 - 60 días",
          "imagen_ref": "img_cerdito_fase3.png",
          "producto_recomendado": {
            "nombre": "Bio Growth Plus",
            "descripcion": "Máximo desarrollo de estructura ósea.",
            "presentacion_kg": 40,
            "precio_bulto": 1100.00,
            "consumo_total_fase_kg": 18.0,
            "nota_tecnica": "Preparación para la etapa de engorda."
          }
        }
      ]
    },
    {
      "id": "engorda_cerdos",
      "titulo": "Engordar Cerdos",
      "descripcion": "A partir de 60 días o 30kg de peso",
      "etapas": [
        {
          "id": "engorda_inicio",
          "titulo": "Inicio de Engorda",
          "rango_peso": "30kg - 60kg",
          "imagen_ref": "img_cerdo_engorda1.png",
          "producto_recomendado": {
            "nombre": "Maxi Engorda A",
            "descripcion": "Conversión alimenticia acelerada.",
            "presentacion_kg": 40,
            "precio_bulto": 950.00,
            "consumo_total_fase_kg": 65.0,
            "nota_tecnica": "Consumo total estimado para ganar 30kg de peso."
          }
        }
      ]
    }
  ]
}

export class LocalDataSource {
  async getCategorias() {
     await new Promise(resolve => setTimeout(resolve, 100));
    return nutricionPorcinaData.categorias;
  }
}