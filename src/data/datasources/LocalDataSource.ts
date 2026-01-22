const appData = {
  "app_config": {
    "nombre": "Cerdos el Tío",
    "version": "1.0.0",
    "moneda": "MXN"
  },

  "flujo_principal": {
    "pantalla_inicio": {
      "id": "inicio",
      "pregunta": "¿Qué quieres hacer hoy?",
      "opciones": [
        {
          "id": "reproducir",
          "titulo": "Reproducir",
          "subtitulo": "Macho y Hembra",
          "icono": "icon_reproduccion",
          "imagen": "img_reproduccion.png",
          "siguiente_pantalla": "objetivo_reproduccion"
        },
        {
          "id": "criar_lechones",
          "titulo": "Criar lechones",
          "subtitulo": "De 7 a 90 días",
          "icono": "icon_lechon",
          "imagen": "img_lechones.png",
          "siguiente_pantalla": "objetivo_cria"
        },
        {
          "id": "engordar_cerdos",
          "titulo": "Engordar cerdos",
          "subtitulo": "Más de 60 días o de 30 a 110 kilos",
          "icono": "icon_cerdo",
          "imagen": "img_engorda.png",
          "siguiente_pantalla": "etapa_engorda"
        }
      ]
    }
  },

  "flujos": {
    "criar_lechones": {
      "objetivo_cria": {
        "id": "objetivo_cria",
        "pregunta": "¿Cuál es tu objetivo?",
        "opciones": [
          {
            "id": "pie_cria",
            "titulo": "Lechones para pie de cría o reemplazos",
            "icono": "icon_warning",
            "color_alerta": "#FFC107",
            "mensaje_alerta": "Se orienta para priorizar el desarrollo de la estructura ósea con combinación de núcleos vitamínicos",
            "siguiente_pantalla": "edad_lechones"
          },
          {
            "id": "engorda",
            "titulo": "Lechones para engorda",
            "icono": "icon_info",
            "mensaje_info": "Se orienta por priorizar el desarrollo muscular en menor tiempo posible",
            "siguiente_pantalla": "edad_lechones"
          }
        ]
      },

      "edad_lechones": {
        "id": "edad_lechones",
        "pregunta": "¿Cuántos días de nacidos tienen tus lechones?",
        "tipo_selector": "visual_cards",
        "opciones": [
          {
            "id": "menos_7_dias",
            "titulo": "Menos de 7 días",
            "imagen": "img_lechon_recien_nacido.png",
            "siguiente_pantalla": "alerta_lactancia_temprana"
          },
          {
            "id": "fase_lactancia",
            "titulo": "FASE I - LACTANCIA",
            "rango": "7 a 21 días",
            "detalle": "De 2 a 3 semanas",
            "consumo_esperado": "hasta 3.5 kg",
            "imagen": "img_lechon_fase1.png",
            "siguiente_pantalla": "input_cantidad_lechones",
            "fase_destino": "fase_1"
          },
          {
            "id": "fase_destetados",
            "titulo": "FASE II - DESTETADOS",
            "rango": "De 21 a 28 días",
            "detalle": "De 3 a 4 semanas",
            "consumo_esperado": "de 5.0 a 6 kg",
            "imagen": "img_lechon_fase2.png",
            "siguiente_pantalla": "input_cantidad_lechones",
            "fase_destino": "fase_2"
          },
          {
            "id": "fase_transicion",
            "titulo": "FASE III - TRANSICIÓN",
            "rango": "De 42 a 60 días",
            "detalle": "De 6 a 8 semanas",
            "consumo_esperado": "de 11 a 18 kg",
            "imagen": "img_lechon_fase3.png",
            "siguiente_pantalla": "input_cantidad_lechones",
            "fase_destino": "fase_3"
          }
        ]
      },

      "alerta_lactancia_temprana": {
        "id": "alerta_lactancia_temprana",
        "tipo": "informativo",
        "titulo": "Lechones en lactancia temprana",
        "mensaje": "Si tus lechones tienen menos de 20 días siguen en la etapa de LACTANCIA, por lo cual es importante cuidar la alimentación de la madre.",
        "recomendacion": "Recomendamos: 2 kilos x día de M-O TURBO",
        "imagen": "img_cerda_lactante.png",
        "boton_continuar": true,
        "siguiente_pantalla": "inicio"
      }
    },

    "decision_destino": {
      "id": "destino_lechones",
      "pregunta": "¿Tus lechones son para vender como lechón o para seguir engordando?",
      "aplica_en_fases": ["fase_2", "fase_3"],
      "opciones": [
        {
          "id": "venta_lechon",
          "titulo": "Venta de lechón",
          "imagen": "img_venta_lechon.png",
          "siguiente_pantalla": "seleccion_plan"
        },
        {
          "id": "engorda_cerdo",
          "titulo": "Engorda de cerdo",
          "imagen": "img_engorda_cerdo.png",
          "siguiente_pantalla": "seleccion_plan"
        }
      ]
    }
  },

  "inputs": {
    "cantidad_lechones": {
      "id": "input_cantidad_lechones",
      "titulo": "Ingresa tus datos",
      "pregunta": "¿Cuántos lechones fueron producidos?",
      "campo": {
        "tipo": "numero",
        "label": "Lechones",
        "placeholder": "20",
        "min": 1,
        "max": 500,
        "default": 20
      },
      "nota_lateral": {
        "texto": "Recuerda que a tu cerda se le debe dar medio kilo de alimento por cada lechón nacido vivo",
        "icono": "icon_info"
      },
      "boton": "CONTINUAR"
    }
  },

  "planes_alimentacion": {
    "fase_1": {
      "planes": [
        {
          "id": "bio_nova_1",
          "nombre": "BIO NOVA 1",
          "tipo": "premium",
          "descripcion": "El desarrollo de los lechones será superior. Mejor peso en menor tiempo gracias a una estructura nutricional óptima de vitaminas, antioxidantes y minerales digestivos.",
          "beneficios": [
            "Mayor desarrollo",
            "Menor tiempo de engorda",
            "Mejor estructura nutricional"
          ]
        },
        {
          "id": "ps1",
          "nombre": "PS1",
          "tipo": "economico",
          "descripcion": "El desarrollo de los lechones será el esperado para la etapa con una estructura nutricional y contenido de vitaminas, antioxidantes y minerales básicos.",
          "beneficios": [
            "Desarrollo esperado",
            "Costo accesible"
          ]
        }
      ]
    },
    "fase_2": {
      "planes": [
        {
          "id": "bio_nova_2",
          "nombre": "BIO NOVA 2",
          "tipo": "premium",
          "descripcion": "Fórmula especial para reducir el estrés del destete con máxima digestibilidad.",
          "beneficios": [
            "Reduce estrés post-destete",
            "Alta digestibilidad",
            "Transición suave"
          ]
        },
        {
          "id": "ps2",
          "nombre": "PS2",
          "tipo": "economico",
          "descripcion": "Nutrición básica para lechones destetados con los requerimientos esenciales.",
          "beneficios": [
            "Costo accesible",
            "Nutrición básica completa"
          ]
        }
      ]
    },
    "fase_3": {
      "planes": [
        {
          "id": "bio_nova_3",
          "nombre": "BIO NOVA 3",
          "tipo": "premium",
          "descripcion": "Máximo desarrollo de estructura ósea y preparación óptima para engorda.",
          "beneficios": [
            "Desarrollo óseo superior",
            "Preparación para engorda",
            "Mayor ganancia de peso"
          ]
        },
        {
          "id": "ps3",
          "nombre": "PS3",
          "tipo": "economico",
          "descripcion": "Alimentación de transición con nutrientes esenciales para el crecimiento.",
          "beneficios": [
            "Nutrición esencial",
            "Costo optimizado"
          ]
        }
      ]
    }
  },

  "productos": {
    "lechones": [
      {
        "id": "bio_start",
        "nombre": "Bio Start Pre-Iniciador",
        "linea": "premium",
        "fase": "fase_1",
        "descripcion": "Alta digestibilidad para lechones en lactancia.",
        "presentacion_kg": 25,
        "precio_bulto": 850.00,
        "consumo_por_animal_kg": 3.5,
        "duracion_fase_dias": 14,
        "imagen": "img_bio_start.png",
        "ficha_tecnica_url": "fichas/bio_start.pdf"
      },
      {
        "id": "bio_nova_1",
        "nombre": "Bio Nova 1",
        "linea": "premium",
        "fase": "fase_1",
        "descripcion": "Desarrollo superior con estructura nutricional óptima.",
        "presentacion_kg": 40,
        "precio_bulto": 1150.00,
        "consumo_por_animal_kg": 3.5,
        "duracion_fase_dias": 14,
        "imagen": "img_bio_nova_1.png",
        "ficha_tecnica_url": "fichas/bio_nova_1.pdf"
      },
      {
        "id": "ps1",
        "nombre": "PS1",
        "linea": "economica",
        "fase": "fase_1",
        "descripcion": "Nutrición básica para lactancia.",
        "presentacion_kg": 40,
        "precio_bulto": 780.00,
        "consumo_por_animal_kg": 3.5,
        "duracion_fase_dias": 14,
        "imagen": "img_ps1.png",
        "ficha_tecnica_url": "fichas/ps1.pdf"
      },
      {
        "id": "bio_nova_2",
        "nombre": "Bio Nova 2",
        "linea": "premium",
        "fase": "fase_2",
        "descripcion": "Fórmula especial para reducir el estrés del destete.",
        "presentacion_kg": 40,
        "precio_bulto": 1200.00,
        "consumo_por_animal_kg": 5.0,
        "duracion_fase_dias": 7,
        "imagen": "img_bio_nova_2.png",
        "ficha_tecnica_url": "fichas/bio_nova_2.pdf"
      },
      {
        "id": "ps2",
        "nombre": "PS2",
        "linea": "economica",
        "fase": "fase_2",
        "descripcion": "Nutrición post-destete económica.",
        "presentacion_kg": 40,
        "precio_bulto": 850.00,
        "consumo_por_animal_kg": 5.0,
        "duracion_fase_dias": 7,
        "imagen": "img_ps2.png",
        "ficha_tecnica_url": "fichas/ps2.pdf"
      },
      {
        "id": "bio_growth_plus",
        "nombre": "Bio Growth Plus",
        "linea": "premium",
        "fase": "fase_3",
        "descripcion": "Máximo desarrollo de estructura ósea.",
        "presentacion_kg": 40,
        "precio_bulto": 1100.00,
        "consumo_por_animal_kg": 18.0,
        "duracion_fase_dias": 18,
        "imagen": "img_bio_growth.png",
        "ficha_tecnica_url": "fichas/bio_growth.pdf"
      },
      {
        "id": "ps3",
        "nombre": "PS3",
        "linea": "economica",
        "fase": "fase_3",
        "descripcion": "Transición económica hacia engorda.",
        "presentacion_kg": 40,
        "precio_bulto": 780.00,
        "consumo_por_animal_kg": 18.0,
        "duracion_fase_dias": 18,
        "imagen": "img_ps3.png",
        "ficha_tecnica_url": "fichas/ps3.pdf"
      }
    ],
    "engorda": [
      {
        "id": "maxi_engorda_a",
        "nombre": "Maxi Engorda A",
        "linea": "standard",
        "etapa": "inicio",
        "rango_peso": "30kg - 60kg",
        "descripcion": "Conversión alimenticia acelerada.",
        "presentacion_kg": 40,
        "precio_bulto": 950.00,
        "consumo_total_fase_kg": 65.0,
        "ganancia_peso_esperada_kg": 30,
        "imagen": "img_maxi_engorda_a.png",
        "ficha_tecnica_url": "fichas/maxi_engorda_a.pdf"
      },
      {
        "id": "maxi_engorda_b",
        "nombre": "Maxi Engorda B",
        "linea": "standard",
        "etapa": "desarrollo",
        "rango_peso": "60kg - 90kg",
        "descripcion": "Desarrollo muscular óptimo.",
        "presentacion_kg": 40,
        "precio_bulto": 920.00,
        "consumo_total_fase_kg": 85.0,
        "ganancia_peso_esperada_kg": 30,
        "imagen": "img_maxi_engorda_b.png",
        "ficha_tecnica_url": "fichas/maxi_engorda_b.pdf"
      },
      {
        "id": "maxi_engorda_c",
        "nombre": "Maxi Engorda C",
        "linea": "standard",
        "etapa": "finalizacion",
        "rango_peso": "90kg - 110kg",
        "descripcion": "Finalización y acabado para mercado.",
        "presentacion_kg": 40,
        "precio_bulto": 880.00,
        "consumo_total_fase_kg": 70.0,
        "ganancia_peso_esperada_kg": 20,
        "imagen": "img_maxi_engorda_c.png",
        "ficha_tecnica_url": "fichas/maxi_engorda_c.pdf"
      }
    ],
    "reproductores": [
      {
        "id": "mo_turbo",
        "nombre": "M-O Turbo",
        "linea": "reproductores",
        "tipo_animal": "cerda_lactante",
        "descripcion": "Alimento para cerdas en lactancia.",
        "presentacion_kg": 40,
        "precio_bulto": 750.00,
        "consumo_diario_kg": 2.0,
        "imagen": "img_mo_turbo.png",
        "ficha_tecnica_url": "fichas/mo_turbo.pdf"
      }
    ],
    "accesorios": [
      {
        "id": "bebederos_chupon",
        "nombre": "Bebederos con chupón",
        "descripcion": "Bebederos tipo chupón para lechones.",
        "presentacion": "Paquete de 10",
        "precio": 450.00,
        "imagen": "img_bebederos.png",
        "recomendado_para": ["fase_1", "fase_2", "fase_3"]
      },
      {
        "id": "kilos_lechones",
        "nombre": "Kilos para lechones",
        "descripcion": "Complemento alimenticio adicional.",
        "presentacion_kg": 4,
        "precio": 180.00,
        "imagen": "img_kilos_lechones.png"
      }
    ]
  },

  "pantalla_resultado": {
    "estructura": {
      "titulo": "Resultado",
      "campos": [
        {
          "label": "La recomendación de alimento para sus lechones es",
          "tipo": "producto_destacado",
          "enlace_ficha": true
        },
        {
          "label": "y te sugerimos agregar los bebederos con chupón",
          "tipo": "producto_sugerido"
        }
      ],
      "productos_adicionales": [
        {
          "id": "kilos_lechones",
          "label": "Kilos para lechones",
          "mostrar_cantidad": true,
          "unidad": "kg"
        }
      ],
      "pregunta_adicional": {
        "label": "Agregar bebederos",
        "tipo": "si_no",
        "opciones": ["SÍ", "NO"]
      },
      "boton_final": "CONTINUAR"
    }
  },

  "calculos": {
    "formulas": {
      "bultos_necesarios": "Math.ceil((cantidad_animales * consumo_por_animal_kg) / presentacion_kg)",
      "costo_total_alimento": "bultos_necesarios * precio_bulto",
      "kilos_lechones_sugeridos": "cantidad_animales * 0.2"
    },
    "notas": {
      "alimentacion_cerda": "Se debe dar medio kilo de alimento por cada lechón nacido vivo a la cerda lactante"
    }
  },

  "navegacion": {
    "menu_inferior": [
      {
        "id": "inicio",
        "icono": "home",
        "label": "Inicio"
      },
      {
        "id": "calculadora",
        "icono": "calculator",
        "label": "Calculadora"
      },
      {
        "id": "productos",
        "icono": "shopping_bag",
        "label": "Productos"
      },
      {
        "id": "historial",
        "icono": "history",
        "label": "Historial"
      },
      {
        "id": "perfil",
        "icono": "person",
        "label": "Mi cuenta"
      }
    ]
  },

  "textos_ui": {
    "botones": {
      "continuar": "CONTINUAR",
      "regresar": "REGRESAR",
      "ver_mas": "Ver más",
      "agregar_carrito": "Agregar al carrito",
      "finalizar": "FINALIZAR"
    },
    "mensajes": {
      "cargando": "Cargando...",
      "error_conexion": "Error de conexión. Intenta de nuevo.",
      "guardado_exitoso": "Guardado correctamente"
    }
  }
};

export class LocalDataSource {
  async getFlujos(): Promise<any[]> {
    const opciones = appData.flujo_principal.pantalla_inicio.opciones;
    return opciones.map((opcion: any) => ({
      id: opcion.id,
      titulo: opcion.titulo,
      subtitulo: opcion.subtitulo,
      descripcion: opcion.subtitulo,
      icono: opcion.icono,
      imagen: opcion.imagen,
      pantalla_inicial: opcion.siguiente_pantalla,
      pantallas: this.getPantallasForFlujo(opcion.id),
    }));
  }

  private getPantallasForFlujo(flujoId: string): any[] {
    const pantallas: any[] = [];

    // Agregar pantallas del flujo
    const flujoData = (appData.flujos as Record<string, any>)[flujoId];
    if (flujoData) {
      Object.entries(flujoData).forEach(([id, data]) => {
        const pantalla = data as Record<string, any>;
        pantallas.push({
          id,
          ...pantalla,
          tipo: this.inferirTipoPantalla(pantalla),
        });
      });
    }

    // Agregar pantallas de inputs (compartidas entre flujos)
    Object.entries(appData.inputs).forEach(([key, inputData]) => {
      const input = inputData as Record<string, any>;
      pantallas.push({
        id: input.id,
        tipo: "input",
        titulo: input.titulo,
        pregunta: input.pregunta,
        variable_captura: {
          nombre: key,
          label: input.campo?.label || "Cantidad",
          tipo: input.campo?.tipo || "numero",
          minimo: input.campo?.min || 1,
          maximo: input.campo?.max || 500,
        },
        siguiente_pantalla: "seleccion_plan",
        nota_lateral: input.nota_lateral,
      });
    });

    // Agregar pantalla de selección de plan
    pantallas.push({
      id: "seleccion_plan",
      tipo: "seleccion_plan",
      titulo: "Selecciona tu plan",
      pregunta: "¿Qué tipo de alimentación prefieres?",
      siguiente_pantalla: "resultado",
      opciones: [
        {
          id: "premium",
          titulo: "Plan Premium",
          siguiente_pantalla: "resultado",
        },
        {
          id: "economico",
          titulo: "Plan Económico",
          siguiente_pantalla: "resultado",
        },
      ],
    });

    // Agregar pantalla de resultado
    pantallas.push({
      id: "resultado",
      tipo: "resultado",
      titulo: appData.pantalla_resultado.estructura.titulo,
      mostrar_accesorios: true,
    });

    return pantallas;
  }

  private inferirTipoPantalla(pantalla: Record<string, any>): string {
    // Si ya tiene tipo definido explícitamente
    if (pantalla.tipo === "informativo") return "alerta";
    if (pantalla.tipo) return pantalla.tipo;

    // Inferir basándose en las propiedades
    if (pantalla.tipo_selector === "visual_cards") return "selector_fase";
    if (pantalla.variable_captura) return "input";
    if (pantalla.planes) return "seleccion_plan";
    if (pantalla.opciones && pantalla.opciones.length > 0) return "seleccion";
    if (pantalla.boton_continuar) return "alerta";

    return "seleccion";
  }

  async getFlujoById(id: string): Promise<any | null> {
    const opciones = appData.flujo_principal.pantalla_inicio.opciones;
    const opcion = opciones.find((o: any) => o.id === id);
    if (!opcion) return null;

    return {
      id: opcion.id,
      titulo: opcion.titulo,
      subtitulo: opcion.subtitulo,
      descripcion: opcion.subtitulo,
      icono: opcion.icono,
      imagen: opcion.imagen,
      pantalla_inicial: opcion.siguiente_pantalla,
      pantallas: this.getPantallasForFlujo(opcion.id),
    };
  }

  async getAccesorios(): Promise<any[]> {
    return appData.productos.accesorios;
  }

  async getAccesoriosPorFase(fase: string): Promise<any[]> {
    return appData.productos.accesorios.filter(
      (acc: any) => acc.recomendado_para?.includes(fase)
    );
  }

  async getProductos(): Promise<{ lechones: any[]; engorda: any[]; reproductores: any[] }> {
    return {
      lechones: appData.productos.lechones,
      engorda: appData.productos.engorda,
      reproductores: appData.productos.reproductores,
    };
  }

  async getProductoById(id: string): Promise<any | null> {
    const allProducts = [
      ...appData.productos.lechones,
      ...appData.productos.engorda,
      ...appData.productos.reproductores,
    ];
    return allProducts.find((p: any) => p.id === id) || null;
  }

  async getProductosPorFase(fase: string): Promise<any[]> {
    return appData.productos.lechones.filter((p: any) => p.fase === fase);
  }

  // Planes de alimentación
  async getPlanesAlimentacion(): Promise<any> {
    return appData.planes_alimentacion;
  }

  async getPlanesPorFase(fase: string): Promise<any[]> {
    const planesData = (appData.planes_alimentacion as Record<string, any>)[fase];
    const planes = planesData?.planes || [];

    // Enriquecer los planes con información del producto
    return planes.map((plan: any) => {
      // Buscar el producto correspondiente al plan (el id del plan coincide con el id del producto)
      const producto = appData.productos.lechones.find((p: any) => p.id === plan.id);

      return {
        ...plan,
        producto_id: plan.id,
        linea_producto: producto?.linea,
        consumo_por_animal_kg: producto?.consumo_por_animal_kg,
        duracion_fase_dias: producto?.duracion_fase_dias,
      };
    });
  }

  // Inputs
  async getInputConfig(inputId: string): Promise<any | null> {
    const inputs = appData.inputs as Record<string, any>;
    // Buscar por id dentro de cada input
    for (const key of Object.keys(inputs)) {
      if (inputs[key].id === inputId) {
        return inputs[key];
      }
    }
    return null;
  }

  async getInputCantidadLechones(): Promise<any> {
    return appData.inputs.cantidad_lechones;
  }

  // Fórmulas y cálculos
  async getCalculos(): Promise<any> {
    return appData.calculos;
  }

  async getFormulas(): Promise<any> {
    return appData.calculos.formulas;
  }

  calcularBultosNecesarios(cantidadAnimales: number, consumoPorAnimalKg: number, presentacionKg: number): number {
    return Math.ceil((cantidadAnimales * consumoPorAnimalKg) / presentacionKg);
  }

  calcularCostoTotal(bultosNecesarios: number, precioBulto: number): number {
    return bultosNecesarios * precioBulto;
  }

  calcularKilosLechonesSugeridos(cantidadAnimales: number): number {
    return cantidadAnimales * 0.2;
  }

  // Pantalla de resultado
  async getPantallaResultado(): Promise<any> {
    return appData.pantalla_resultado;
  }

  async getEstructuraResultado(): Promise<any> {
    return appData.pantalla_resultado.estructura;
  }

  // Textos UI
  async getTextosUI(): Promise<any> {
    return appData.textos_ui;
  }

  async getBotones(): Promise<any> {
    return appData.textos_ui.botones;
  }

  async getMensajes(): Promise<any> {
    return appData.textos_ui.mensajes;
  }

  // Configuración de la app
  async getAppConfig(): Promise<any> {
    return appData.app_config;
  }

  // Navegación
  async getMenuInferior(): Promise<any[]> {
    return appData.navegacion.menu_inferior;
  }
}
