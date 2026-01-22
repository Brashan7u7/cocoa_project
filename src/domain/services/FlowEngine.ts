import { FlujoEntity } from "../entities/Flujo";
import { PantallaEntity } from "../entities/Pantalla";
import { OpcionEntity } from "../entities/Opcion";
import { PlanEntity } from "../entities/Plan";
import { ProductoEntity } from "../entities/Producto";
import { AccesorioEntity } from "../entities/Accesorio";

export interface FlowState {
  flujoId: string;
  pantallaActualId: string;
  historial: string[];
  contexto: Record<string, any>;
  faseSeleccionada?: string;
  objetivoSeleccionado?: string;
  tipoPlanSeleccionado?: "premium" | "economico";
  planSeleccionado?: PlanEntity;
  productoSeleccionado?: ProductoEntity;
  accesoriosSeleccionados?: AccesorioEntity[];
  cotizacionResult?: CotizacionResult;
}

export interface CotizacionResult {
  cantidadAnimales: number;
  consumoTotalKg: number;
  bultosNecesarios: number;
  costoTotal: number;
  costoPorAnimal: number;
  producto: ProductoEntity;
  plan?: PlanEntity;
}

export class FlowEngine {
  private flujo: FlujoEntity;
  private state: FlowState;

  constructor(flujo: FlujoEntity) {
    this.flujo = flujo;
    this.state = this.createInitialState();
  }

  private createInitialState(): FlowState {
    return {
      flujoId: this.flujo.id,
      pantallaActualId: this.flujo.pantallaInicial,
      historial: [],
      contexto: {},
    };
  }

  getState(): FlowState {
    return { ...this.state };
  }

  setState(newState: Partial<FlowState>): void {
    this.state = { ...this.state, ...newState };
  }

  getFlujo(): FlujoEntity {
    return this.flujo;
  }

  getPantallaActual(): PantallaEntity | undefined {
    return this.flujo.getPantallaById(this.state.pantallaActualId);
  }

  setContextValue(key: string, value: any): void {
    this.state.contexto = {
      ...this.state.contexto,
      [key]: value,
    };
  }

  getContextValue(key: string): any {
    return this.state.contexto[key];
  }

  setFaseSeleccionada(fase: string): void {
    this.state.faseSeleccionada = fase;
  }

  getFaseSeleccionada(): string | undefined {
    return this.state.faseSeleccionada;
  }

  setObjetivoSeleccionado(objetivo: string): void {
    this.state.objetivoSeleccionado = objetivo;
  }

  setTipoPlanSeleccionado(tipo: "premium" | "economico"): void {
    this.state.tipoPlanSeleccionado = tipo;
  }

  getTipoPlanSeleccionado(): "premium" | "economico" | undefined {
    return this.state.tipoPlanSeleccionado;
  }

  setPlanSeleccionado(plan: PlanEntity): void {
    this.state.planSeleccionado = plan;
  }

  getPlanSeleccionado(): PlanEntity | undefined {
    return this.state.planSeleccionado;
  }

  setProductoSeleccionado(producto: ProductoEntity): void {
    this.state.productoSeleccionado = producto;
  }

  getProductoSeleccionado(): ProductoEntity | undefined {
    return this.state.productoSeleccionado;
  }

  setCotizacionResult(result: CotizacionResult): void {
    this.state.cotizacionResult = result;
  }

  getCotizacionResult(): CotizacionResult | undefined {
    return this.state.cotizacionResult;
  }

  navigate(opcionSeleccionada?: OpcionEntity): string | null {
    const pantallaActual = this.getPantallaActual();
    if (!pantallaActual) return null;

    // Guardar en historial
    this.state.historial.push(this.state.pantallaActualId);

    // Si la opción tiene fase_destino, guardarlo
    if (opcionSeleccionada?.faseDestino) {
      this.setFaseSeleccionada(opcionSeleccionada.faseDestino);
    }

    // Determinar siguiente pantalla
    const siguientePantallaId = this.determinarSiguientePantalla(
      pantallaActual,
      opcionSeleccionada
    );

    if (!siguientePantallaId) return null;

    // Caso especial: volver al inicio
    if (siguientePantallaId === "inicio") {
      return "inicio";
    }

    // Actualizar estado
    this.state.pantallaActualId = siguientePantallaId;

    return siguientePantallaId;
  }

  private determinarSiguientePantalla(
    pantalla: PantallaEntity,
    opcionSeleccionada?: OpcionEntity
  ): string | undefined {
    // Prioridad 1: La opción tiene su propia siguiente_pantalla
    if (opcionSeleccionada?.siguientePantalla) {
      return opcionSeleccionada.siguientePantalla;
    }

    // Prioridad 2: La pantalla tiene siguiente_pantalla definida
    if (pantalla.siguientePantalla) {
      return pantalla.siguientePantalla;
    }

    return undefined;
  }

  goBack(): string | null {
    if (this.state.historial.length === 0) {
      return null;
    }

    const pantallaAnterior = this.state.historial.pop();
    if (pantallaAnterior) {
      this.state.pantallaActualId = pantallaAnterior;
      return pantallaAnterior;
    }

    return null;
  }

  canGoBack(): boolean {
    return this.state.historial.length > 0;
  }

  reset(): void {
    this.state = this.createInitialState();
  }

  getProgreso(): { actual: number; total: number } {
    const pantallasConProgreso = this.flujo.pantallas.filter(
      (p) => p.tipo !== "alerta"
    );
    const indexActual = pantallasConProgreso.findIndex(
      (p) => p.id === this.state.pantallaActualId
    );

    return {
      actual: Math.max(indexActual + 1, 1),
      total: pantallasConProgreso.length,
    };
  }

  calcularCotizacion(
    cantidadAnimales: number,
    producto: ProductoEntity,
    consumoPorAnimalKg: number
  ): CotizacionResult {
    const consumoTotalKg = cantidadAnimales * consumoPorAnimalKg;
    const bultosNecesarios = Math.ceil(consumoTotalKg / producto.presentacionKg);
    const costoTotal = bultosNecesarios * producto.precioBulto;
    const costoPorAnimal = costoTotal / cantidadAnimales;

    const result: CotizacionResult = {
      cantidadAnimales,
      consumoTotalKg,
      bultosNecesarios,
      costoTotal,
      costoPorAnimal,
      producto,
      plan: this.state.planSeleccionado,
    };

    this.setCotizacionResult(result);
    return result;
  }
}
