import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  Text,
  BackHandler,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";

import { useFlow } from "../../../src/presentation/context/FlowContext";
import { SeleccionScreen } from "../../../src/presentation/screens/SeleccionScreen";
import { SelectorFaseScreen } from "../../../src/presentation/screens/SelectorFaseScreen";
import { InputScreen } from "../../../src/presentation/screens/InputScreen";
import { AlertaScreen } from "../../../src/presentation/screens/AlertaScreen";
import { SeleccionPlanScreen } from "../../../src/presentation/screens/SeleccionPlanScreen";
import { ResultadoScreen } from "../../../src/presentation/screens/ResultadoScreen";
import { PlanEntity } from "../../../src/domain/entities/Plan";
import { OpcionEntity } from "../../../src/domain/entities/Opcion";
import DIContainer from "../../../src/di/container";
import { ProductoMapper } from "../../../src/data/mappers/ProductoMapper";

export default function DynamicFlowScreen() {
  const { flujoId, pantallaId } = useLocalSearchParams<{
    flujoId: string;
    pantallaId: string;
  }>();
  const router = useRouter();
  const {
    engine,
    flujo,
    navigate,
    goBack,
    setContextValue,
    setFaseSeleccionada,
    setTipoPlanSeleccionado,
    setPlanSeleccionado,
    setProductoSeleccionado,
    getFaseSeleccionada,
    calcularCotizacion,
    getCotizacionResult,
    getContextValue,
    resetFlow,
  } = useFlow();

  const [loading, setLoading] = useState(false);
  const isNavigating = useRef(false);

  // Obtener la pantalla actual basándose en el parámetro de la URL, no del engine
  const pantallaActual = useMemo(() => {
    if (!flujo || !pantallaId) return undefined;
    return flujo.getPantallaById(pantallaId);
  }, [flujo, pantallaId]);

  // Handler para regresar
  const handleGoBack = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    if (!engine || !flujo) {
      router.replace("/");
      isNavigating.current = false;
      return;
    }

    const canGoBack = engine.canGoBack();
    if (canGoBack) {
      goBack();
    } else {
      resetFlow();
      router.replace("/");
    }

    setTimeout(() => {
      isNavigating.current = false;
    }, 300);
  }, [engine, flujo, goBack, resetFlow, router]);

  // Manejar el botón de regreso del hardware (Android)
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleGoBack();
        return true; // Prevenir comportamiento por defecto
      }
    );

    return () => backHandler.remove();
  }, [handleGoBack]);

  if (!engine || !flujo) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text className="text-gray-500 mt-4">Cargando flujo...</Text>
      </View>
    );
  }

  if (!pantallaActual) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-red-500 text-lg font-bold mb-2">Pantalla no encontrada</Text>
        <Text className="text-gray-500 text-center mb-4">
          No se encontró la pantalla "{pantallaId}" en el flujo "{flujoId}"
        </Text>
        <Text className="text-gray-400 text-sm text-center mb-4">
          Pantallas disponibles: {flujo.pantallas.map(p => p.id).join(", ") || "ninguna"}
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          className="bg-indigo-600 px-6 py-3 rounded-full"
        >
          <Text className="text-white font-bold">Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progreso = engine.getProgreso();

  const handleSeleccion = (opcion: OpcionEntity) => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    // Guardar información de la opción si tiene fase_destino
    if (opcion.faseDestino) {
      setFaseSeleccionada(opcion.faseDestino);
    }

    navigate(opcion);

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  const handleInputSubmit = async (value: number) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setLoading(true);

    try {
      const variableName = pantallaActual.variableCaptura?.nombre || "cantidad";
      setContextValue(variableName, value);

      // Verificar si la siguiente pantalla es "resultado" (sin selección de plan)
      const siguientePantallaId = pantallaActual.siguientePantalla;
      const siguientePantalla = siguientePantallaId
        ? flujo.getPantallaById(siguientePantallaId)
        : null;

      if (siguientePantalla?.tipo === "resultado") {
        // Calcular cotización directamente para flujos sin selección de plan
        const fase = getFaseSeleccionada();

        if (fase) {
          // Para engorda: buscar producto por etapa
          if (fase.startsWith("engorda_")) {
            const etapa = fase.replace("engorda_", "");
            const productos = await DIContainer.localDataSource.getProductos();
            const productoData = productos.engorda.find(
              (p: any) => p.etapa === etapa
            );

            if (productoData) {
              const producto = ProductoMapper.toDomain(productoData);
              setProductoSeleccionado(producto);

              // consumo_total_fase_kg es el consumo total por animal para toda la fase
              const consumoPorAnimal = productoData.consumo_total_fase_kg || 65;
              calcularCotizacion(value, producto, consumoPorAnimal);
            }
          }
        }

        // Para reproductores
        if (flujo.id === "reproducir") {
          const productos = await DIContainer.localDataSource.getProductos();
          const productoData = productos.reproductores[0]; // M-O Turbo

          if (productoData) {
            const producto = ProductoMapper.toDomain(productoData);
            setProductoSeleccionado(producto);

            // Consumo diario * 21 días (lactancia promedio)
            const diasLactancia = 21;
            const consumoPorAnimal =
              (productoData.consumo_diario_kg || 2) * diasLactancia;
            calcularCotizacion(value, producto, consumoPorAnimal);
          }
        }
      }

      navigate();
    } catch (error) {
      console.error("Error in handleInputSubmit:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        isNavigating.current = false;
      }, 500);
    }
  };

  const handleAlertaContinue = () => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    navigate();

    setTimeout(() => {
      isNavigating.current = false;
    }, 500);
  };

  const handlePlanSelect = async (plan: PlanEntity, opcion: OpcionEntity) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setLoading(true);

    try {
      setPlanSeleccionado(plan);
      setTipoPlanSeleccionado(plan.tipo);

      // Cargar el producto asociado al plan
      const productoData = await DIContainer.localDataSource.getProductoById(
        plan.productoId
      );

      if (productoData) {
        const producto = ProductoMapper.toDomain(productoData);
        setProductoSeleccionado(producto);

        // Obtener cantidad de animales del contexto
        const cantidadAnimales =
          getContextValue("cantidadLechones") ||
          getContextValue("cantidadCerdos") ||
          getContextValue("cantidadReproductores") ||
          0;

        // Calcular cotización
        if (cantidadAnimales > 0 && plan.consumoPorAnimalKg) {
          calcularCotizacion(
            cantidadAnimales,
            producto,
            plan.consumoPorAnimalKg
          );
        }
      }

      navigate(opcion);
    } catch (error) {
      console.error("Error selecting plan:", error);
    } finally {
      setLoading(false);
      setTimeout(() => {
        isNavigating.current = false;
      }, 500);
    }
  };

  const renderScreen = () => {
    switch (pantallaActual.tipo) {
      case "seleccion":
        return (
          <SeleccionScreen
            pantalla={pantallaActual}
            onSelect={handleSeleccion}
            progreso={progreso}
          />
        );

      case "selector_fase":
        return (
          <SelectorFaseScreen
            pantalla={pantallaActual}
            onSelect={handleSeleccion}
            progreso={progreso}
          />
        );

      case "input":
        return (
          <InputScreen
            pantalla={pantallaActual}
            onSubmit={handleInputSubmit}
            progreso={progreso}
            notaLateral={
              flujo.id === "criar_lechones"
                ? "Recuerda que a tu cerda se le debe dar medio kilo de alimento por cada lechón nacido vivo"
                : undefined
            }
          />
        );

      case "alerta":
        return (
          <AlertaScreen
            pantalla={pantallaActual}
            onContinue={handleAlertaContinue}
          />
        );

      case "seleccion_plan":
        const fase = getFaseSeleccionada();
        if (!fase) {
          return (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">
                No se ha seleccionado una fase
              </Text>
            </View>
          );
        }
        return (
          <SeleccionPlanScreen
            pantalla={pantallaActual}
            faseSeleccionada={fase}
            onSelect={handlePlanSelect}
            progreso={progreso}
          />
        );

      case "resultado":
        const cotizacion = getCotizacionResult();
        if (!cotizacion) {
          return (
            <View className="flex-1 items-center justify-center">
              <Text className="text-gray-500">
                No hay cotización disponible
              </Text>
            </View>
          );
        }
        return (
          <ResultadoScreen
            pantalla={pantallaActual}
            cotizacion={cotizacion}
            faseSeleccionada={getFaseSeleccionada()}
            flujoTitulo={flujo.titulo}
          />
        );

      default:
        return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">
              Tipo de pantalla no soportado: {pantallaActual.tipo}
            </Text>
          </View>
        );
    }
  };

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="dark" />

      <SafeAreaView className="bg-white">
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity
              onPress={handleGoBack}
              className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
            >
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>

            <View className="flex-1 ml-4">
              <Text className="text-sm text-gray-500 font-medium">
                {flujo.titulo}
              </Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        renderScreen()
      )}
    </View>
  );
}
