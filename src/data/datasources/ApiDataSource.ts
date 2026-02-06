/**
 * DataSource que consume los datos del Backend API
 * Reemplaza a LocalDataSource para usar el backend
 */

// URL del backend - cambiar según el ambiente
const API_BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000/api' // Android emulator
  : 'http://localhost:3000/api';

// Para dispositivo físico, usar la IP de tu computadora:
// const API_BASE_URL = 'http://192.168.x.x:3000/api';

export class ApiDataSource {
  private baseUrl: string;

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || API_BASE_URL;
  }

  /**
   * Configura la URL base del API (útil para cambiar entre ambientes)
   */
  setBaseUrl(url: string) {
    this.baseUrl = url;
  }

  private async fetchJson(endpoint: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error(`Error fetching ${endpoint}:`, error);
      throw error;
    }
  }

  private async postJson(endpoint: string, body: any): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error(`Error posting to ${endpoint}:`, error);
      throw error;
    }
  }

  // ============ FLUJOS ============

  async getFlujos(): Promise<any[]> {
    return this.fetchJson('/flujos');
  }

  async getFlujoById(id: string): Promise<any | null> {
    try {
      return await this.fetchJson(`/flujos/${id}`);
    } catch {
      return null;
    }
  }

  async getPantallasFlujo(flujoId: string): Promise<any[]> {
    return this.fetchJson(`/flujos/${flujoId}/pantallas`);
  }

  async getPantallaById(flujoId: string, pantallaId: string): Promise<any | null> {
    try {
      return await this.fetchJson(`/flujos/${flujoId}/pantallas/${pantallaId}`);
    } catch {
      return null;
    }
  }

  // ============ PRODUCTOS ============

  async getProductos(): Promise<{
    lechones: any[];
    engorda: any[];
    reproductores: any[];
  }> {
    return this.fetchJson('/productos');
  }

  async getProductoById(id: string): Promise<any | null> {
    try {
      return await this.fetchJson(`/productos/${id}`);
    } catch {
      return null;
    }
  }

  async getProductosPorFase(fase: string): Promise<any[]> {
    return this.fetchJson(`/productos/fase/${fase}`);
  }

  async getProductosLechones(): Promise<any[]> {
    return this.fetchJson('/productos/lechones');
  }

  async getProductosEngorda(): Promise<any[]> {
    return this.fetchJson('/productos/engorda');
  }

  // ============ ACCESORIOS ============

  async getAccesorios(): Promise<any[]> {
    return this.fetchJson('/productos/accesorios');
  }

  async getAccesoriosPorFase(fase: string): Promise<any[]> {
    return this.fetchJson(`/cotizacion/accesorios/${fase}`);
  }

  async getAllAccesorios(): Promise<any[]> {
    return this.fetchJson('/productos/accesorios');
  }

  // ============ PLANES ============

  async getPlanesAlimentacion(): Promise<any> {
    return this.fetchJson('/cotizacion/planes');
  }

  async getPlanesPorFase(fase: string): Promise<any[]> {
    return this.fetchJson(`/cotizacion/planes/${fase}`);
  }

  // ============ COTIZACIÓN ============

  async calcularCotizacion(data: {
    cantidad_animales: number;
    fase: string;
    tipo_plan: 'premium' | 'economico';
    accesorios?: { accesorio_id: string; cantidad: number }[];
  }): Promise<any> {
    return this.postJson('/cotizacion/calcular', data);
  }

  async generarPDFBase64(data: {
    cantidad_animales: number;
    fase: string;
    tipo_plan: 'premium' | 'economico';
    accesorios?: { accesorio_id: string; cantidad: number }[];
    cliente?: {
      nombre?: string;
      telefono?: string;
      direccion?: string;
      nombre_comercial?: string;
    };
    id_empleado?: string;
    observaciones?: string;
    formato?: 'pdf' | 'docx';
  }): Promise<{ base64: string; mimeType: string; filename: string }> {
    return this.postJson('/cotizacion/generar-base64', data);
  }

  // ============ CÁLCULOS (helpers locales) ============

  calcularBultosNecesarios(
    cantidadAnimales: number,
    consumoPorAnimalKg: number,
    presentacionKg: number
  ): number {
    return Math.ceil((cantidadAnimales * consumoPorAnimalKg) / presentacionKg);
  }

  calcularCostoTotal(bultosNecesarios: number, precioBulto: number): number {
    return bultosNecesarios * precioBulto;
  }

  calcularKilosLechonesSugeridos(cantidadAnimales: number): number {
    return cantidadAnimales * 0.2;
  }

  // ============ CONFIG ============

  async getAppConfig(): Promise<any> {
    return this.fetchJson('');
  }
}

// Instancia singleton
export const apiDataSource = new ApiDataSource();
