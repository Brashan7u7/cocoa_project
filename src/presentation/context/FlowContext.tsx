import React, { createContext, useContext, useState, useCallback } from "react";
import { useRouter } from "expo-router";
import { FlowEngine, FlowState, CotizacionResult } from "../../domain/services/FlowEngine";
import { FlujoEntity } from "../../domain/entities/Flujo";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { OpcionEntity } from "../../domain/entities/Opcion";
import { PlanEntity } from "../../domain/entities/Plan";
import { ProductoEntity } from "../../domain/entities/Producto";
import { AccesorioEntity } from "../../domain/entities/Accesorio";
import DIContainer from "../../di/container";

interface FlowContextType {
  engine: FlowEngine | null;
  flujo: FlujoEntity | null;
  pantallaActual: PantallaEntity | undefined;
  state: FlowState | null;
  isLoading: boolean;

  // Acciones
  startFlow: (flujoId: string) => Promise<void>;
  navigate: (opcion?: OpcionEntity) => void;
  goBack: () => void;
  resetFlow: () => void;

  // Setters de estado
  setContextValue: (key: string, value: any) => void;
  setFaseSeleccionada: (fase: string) => void;
  setTipoPlanSeleccionado: (tipo: "premium" | "economico") => void;
  setPlanSeleccionado: (plan: PlanEntity) => void;
  setProductoSeleccionado: (producto: ProductoEntity) => void;

  // Getters
  getContextValue: (key: string) => any;
  getFaseSeleccionada: () => string | undefined;
  getTipoPlanSeleccionado: () => "premium" | "economico" | undefined;
  getPlanSeleccionado: () => PlanEntity | undefined;
  getProductoSeleccionado: () => ProductoEntity | undefined;
  getCotizacionResult: () => CotizacionResult | undefined;

  // Cálculo
  calcularCotizacion: (
    cantidadAnimales: number,
    producto: ProductoEntity,
    consumoPorAnimalKg: number
  ) => CotizacionResult | null;

  // Accesorios
  accesorios: AccesorioEntity[];
  loadAccesorios: (fase: string) => Promise<void>;
}

const FlowContext = createContext<FlowContextType | undefined>(undefined);

export const FlowProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const router = useRouter();
  const [engine, setEngine] = useState<FlowEngine | null>(null);
  const [flujo, setFlujo] = useState<FlujoEntity | null>(null);
  const [state, setState] = useState<FlowState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [accesorios, setAccesorios] = useState<AccesorioEntity[]>([]);

  const updateState = useCallback(() => {
    if (engine) {
      setState(engine.getState());
    }
  }, [engine]);

  const startFlow = useCallback(async (flujoId: string) => {
    setIsLoading(true);
    try {
      console.log("Starting flow:", flujoId);
      const flujoData = await DIContainer.flujoRepository.getFlujoById(flujoId);
      console.log("Flujo data received:", flujoData ? {
        id: flujoData.id,
        titulo: flujoData.titulo,
        pantallaInicial: flujoData.pantallaInicial,
        pantallasCount: flujoData.pantallas.length,
        pantallasIds: flujoData.pantallas.map(p => p.id)
      } : null);

      if (flujoData) {
        const newEngine = new FlowEngine(flujoData);
        setEngine(newEngine);
        setFlujo(flujoData);
        setState(newEngine.getState());

        const pantallaInicial = flujoData.pantallaInicial;
        console.log("Navigating to:", `/flujo/${flujoId}/${pantallaInicial}`);
        router.push(`/flujo/${flujoId}/${pantallaInicial}`);
      } else {
        console.error("No flujo data found for:", flujoId);
      }
    } catch (error) {
      console.error("Error starting flow:", error);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const navigate = useCallback(
    (opcion?: OpcionEntity) => {
      if (!engine || !flujo) return;

      const siguientePantallaId = engine.navigate(opcion);

      if (siguientePantallaId === "inicio") {
        resetFlow();
        router.replace("/");
        return;
      }

      if (siguientePantallaId) {
        updateState();
        router.push(`/flujo/${flujo.id}/${siguientePantallaId}`);
      }
    },
    [engine, flujo, router, updateState, resetFlow]
  );

  const goBack = useCallback(() => {
    if (!engine || !flujo) return;

    const pantallaAnteriorId = engine.goBack();

    if (pantallaAnteriorId) {
      updateState();
      router.back();
    } else {
      router.replace("/");
    }
  }, [engine, flujo, router, updateState]);

  const resetFlow = useCallback(() => {
    if (engine) {
      engine.reset();
    }
    setEngine(null);
    setFlujo(null);
    setState(null);
    setAccesorios([]);
  }, [engine]);

  const setContextValue = useCallback(
    (key: string, value: any) => {
      if (engine) {
        engine.setContextValue(key, value);
        updateState();
      }
    },
    [engine, updateState]
  );

  const setFaseSeleccionada = useCallback(
    (fase: string) => {
      if (engine) {
        engine.setFaseSeleccionada(fase);
        updateState();
      }
    },
    [engine, updateState]
  );

  const setTipoPlanSeleccionado = useCallback(
    (tipo: "premium" | "economico") => {
      if (engine) {
        engine.setTipoPlanSeleccionado(tipo);
        updateState();
      }
    },
    [engine, updateState]
  );

  const setPlanSeleccionado = useCallback(
    (plan: PlanEntity) => {
      if (engine) {
        engine.setPlanSeleccionado(plan);
        updateState();
      }
    },
    [engine, updateState]
  );

  const setProductoSeleccionado = useCallback(
    (producto: ProductoEntity) => {
      if (engine) {
        engine.setProductoSeleccionado(producto);
        updateState();
      }
    },
    [engine, updateState]
  );

  const getContextValue = useCallback(
    (key: string) => {
      return engine?.getContextValue(key);
    },
    [engine]
  );

  const getFaseSeleccionada = useCallback(() => {
    return engine?.getFaseSeleccionada();
  }, [engine]);

  const getTipoPlanSeleccionado = useCallback(() => {
    return engine?.getTipoPlanSeleccionado();
  }, [engine]);

  const getPlanSeleccionado = useCallback(() => {
    return engine?.getPlanSeleccionado();
  }, [engine]);

  const getProductoSeleccionado = useCallback(() => {
    return engine?.getProductoSeleccionado();
  }, [engine]);

  const getCotizacionResult = useCallback(() => {
    return engine?.getCotizacionResult();
  }, [engine]);

  const calcularCotizacion = useCallback(
    (
      cantidadAnimales: number,
      producto: ProductoEntity,
      consumoPorAnimalKg: number
    ): CotizacionResult | null => {
      if (!engine) return null;
      return engine.calcularCotizacion(
        cantidadAnimales,
        producto,
        consumoPorAnimalKg
      );
    },
    [engine]
  );

  const loadAccesorios = useCallback(async (fase: string) => {
    try {
      const data = await DIContainer.accesorioRepository.getAccesoriosPorFase(
        fase
      );
      setAccesorios(data);
    } catch (error) {
      console.error("Error loading accesorios:", error);
    }
  }, []);

  const pantallaActual = engine?.getPantallaActual();

  return (
    <FlowContext.Provider
      value={{
        engine,
        flujo,
        pantallaActual,
        state,
        isLoading,
        startFlow,
        navigate,
        goBack,
        resetFlow,
        setContextValue,
        setFaseSeleccionada,
        setTipoPlanSeleccionado,
        setPlanSeleccionado,
        setProductoSeleccionado,
        getContextValue,
        getFaseSeleccionada,
        getTipoPlanSeleccionado,
        getPlanSeleccionado,
        getProductoSeleccionado,
        getCotizacionResult,
        calcularCotizacion,
        accesorios,
        loadAccesorios,
      }}
    >
      {children}
    </FlowContext.Provider>
  );
};

export const useFlow = (): FlowContextType => {
  const context = useContext(FlowContext);
  if (!context) {
    throw new Error("useFlow must be used within a FlowProvider");
  }
  return context;
};
