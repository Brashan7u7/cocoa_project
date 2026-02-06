/**
 * Servicio para conectar con el Backend de Cocoa
 */

// URL del backend - cambiar en producción
const API_BASE_URL = 'http://localhost:3000/api';

// Para desarrollo en dispositivo físico, usar la IP de tu computadora:
// const API_BASE_URL = 'http://192.168.x.x:3000/api';

export interface ClienteData {
  nombre?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  nombre_comercial?: string;
}

export interface AccesorioInput {
  accesorio_id: string;
  cantidad: number;
}

export interface GenerarCotizacionRequest {
  cantidad_animales: number;
  fase: string;
  tipo_plan: 'premium' | 'economico';
  accesorios?: AccesorioInput[];
  cliente?: ClienteData;
  id_empleado?: string;
  observaciones?: string;
  formato?: 'pdf' | 'docx';
}

export interface CotizacionResponse {
  success: boolean;
  data: {
    cantidad_animales: number;
    consumo_total_kg: number;
    bultos_necesarios: number;
    costo_total: number;
    costo_por_animal: number;
    producto: any;
    plan: any;
    accesorios: any[];
    total_con_accesorios: number;
  };
}

export interface PDFResponse {
  success: boolean;
  data: {
    base64: string;
    mimeType: string;
    filename: string;
  };
}

class ApiService {
  /**
   * Calcula una cotización sin generar PDF
   */
  async calcularCotizacion(
    request: GenerarCotizacionRequest
  ): Promise<CotizacionResponse> {
    const response = await fetch(`${API_BASE_URL}/cotizacion/calcular`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al calcular cotización');
    }

    return response.json();
  }

  /**
   * Genera el PDF de la cotización y lo retorna como base64
   */
  async generarPDFBase64(
    request: GenerarCotizacionRequest
  ): Promise<PDFResponse> {
    const response = await fetch(`${API_BASE_URL}/cotizacion/generar-base64`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...request,
        formato: request.formato || 'pdf',
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al generar PDF');
    }

    return response.json();
  }

  /**
   * Obtiene todos los productos
   */
  async getProductos(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/productos`);
    return response.json();
  }

  /**
   * Obtiene productos por fase
   */
  async getProductosPorFase(fase: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/productos/fase/${fase}`);
    return response.json();
  }

  /**
   * Obtiene todos los flujos
   */
  async getFlujos(): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/flujos`);
    return response.json();
  }

  /**
   * Obtiene un flujo por ID
   */
  async getFlujoById(id: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/flujos/${id}`);
    return response.json();
  }

  /**
   * Obtiene las pantallas de un flujo
   */
  async getPantallasFlujo(flujoId: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/flujos/${flujoId}/pantallas`);
    return response.json();
  }

  /**
   * Obtiene accesorios recomendados para una fase
   */
  async getAccesoriosPorFase(fase: string): Promise<any> {
    const response = await fetch(
      `${API_BASE_URL}/cotizacion/accesorios/${fase}`
    );
    return response.json();
  }

  /**
   * Obtiene los planes disponibles para una fase
   */
  async getPlanesPorFase(fase: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/cotizacion/planes/${fase}`);
    return response.json();
  }
}

export const apiService = new ApiService();
