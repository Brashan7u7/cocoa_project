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
import { dataSource } from "../../../src/data/datasources";

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

  const pantallaActual = useMemo(() => {
    if (!flujo || !pantallaId) return undefined;
    return flujo.getPantallaById(pantallaId);
  }, [flujo, pantallaId]);

  const handleGoBack = useCallback(() => {
    if (isNavigating.current) return;
    isNavigating.current = true;

    if (!engine || !flujo) {
      router.replace("/");
      isNavigating.current = false;
      return;
    }

    if (engine.canGoBack()) {
      goBack();
    } else {
      resetFlow();
      router.replace("/");
    }

    setTimeout(() => {
      isNavigating.current = false;
    }, 300);
  }, [engine, flujo, goBack, resetFlow, router]);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleGoBack();
        return true;
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
        <TouchableOpacity onPress={() => router.replace("/")} className="bg-indigo-600 px-6 py-3 rounded-full">
          <Text className="text-white font-bold">Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const progreso = engine.getProgreso();

  const handleSeleccion = (opcion: OpcionEntity) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    if (opcion.faseDestino) setFaseSeleccionada(opcion.faseDestino);
    navigate(opcion);
    setTimeout(() => { isNavigating.current = false; }, 500);
  };

  const handleInputSubmit = async (value: number) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setLoading(true);

    try {
      // Guardamos con el nombre definido en el JSON (ej: "cantidad_lechones")
      const variableName = pantallaActual.variableCaptura?.nombre || "cantidad";
      setContextValue(variableName, value);

      const siguientePantalla = pantallaActual.siguientePantalla 
        ? flujo.getPantallaById(pantallaActual.siguientePantalla) 
        : null;

      if (siguientePantalla?.tipo === "resultado") {
        const fase = getFaseSeleccionada();
        if (fase && fase.startsWith("engorda_")) {
          const etapa = fase.replace("engorda_", "");
          const productos = await dataSource.getProductos();
          const productoData = productos.engorda.find((p: any) => p.etapa === etapa);
          if (productoData) {
            const producto = ProductoMapper.toDomain(productoData);
            setProductoSeleccionado(producto);
            calcularCotizacion(value, producto, productoData.consumo_total_fase_kg || 65);
          }
        }
      }
      navigate();
    } catch (error) {
      console.error("Error en handleInputSubmit:", error);
    } finally {
      setLoading(false);
      setTimeout(() => { isNavigating.current = false; }, 500);
    }
  };

  const handlePlanSelect = async (plan: PlanEntity, opcion: OpcionEntity) => {
    if (isNavigating.current) return;
    isNavigating.current = true;
    setLoading(true);

    try {
      setPlanSeleccionado(plan);
      setTipoPlanSeleccionado(plan.tipo);

      const productoData = await dataSource.getProductoById(plan.productoId);

      if (productoData) {
        const producto = ProductoMapper.toDomain(productoData);
        setProductoSeleccionado(producto);

        //  Buscamos tanto en snake_case (JSON) como camelCase (TS)
        const cantidadRaw = 
          getContextValue("cantidad_lechones") || // Valor del JSON
          getContextValue("cantidadLechones") ||
          getContextValue("cantidad_cerdos") ||   // Valor del JSON
          getContextValue("cantidadCerdos") ||
          getContextValue("cantidad");

        const cantidadAnimales = Number(cantidadRaw) || 0;
        const consumo = plan.consumoPorAnimalKg || productoData.consumo_por_animal_kg;

        if (cantidadAnimales > 0 && consumo) {
          calcularCotizacion(cantidadAnimales, producto, consumo);
        } else {
          console.warn("Faltan datos para calcular:", { cantidadAnimales, consumo });
        }
      }
      navigate(opcion);
    } catch (error) {
      console.error("Error seleccionando plan:", error);
    } finally {
      setLoading(false);
      setTimeout(() => { isNavigating.current = false; }, 500);
    }
  };

  const renderScreen = () => {
    switch (pantallaActual.tipo) {
      case "seleccion":
        return <SeleccionScreen pantalla={pantallaActual} onSelect={handleSeleccion} progreso={progreso} />;
      case "selector_fase":
        return <SelectorFaseScreen pantalla={pantallaActual} onSelect={handleSeleccion} progreso={progreso} />;
      case "input":
        return (
          <InputScreen 
            pantalla={pantallaActual} 
            onSubmit={handleInputSubmit} 
            progreso={progreso}
            notaLateral={flujo.id === "criar_lechones" ? "Recuerda que a tu cerda se le debe dar medio kilo de alimento por cada lechón nacido vivo" : undefined}
          />
        );
      case "alerta":
        return <AlertaScreen pantalla={pantallaActual} onContinue={() => navigate()} />;
      case "seleccion_plan":
        const fase = getFaseSeleccionada();
        if (!fase) return null;
        return <SeleccionPlanScreen pantalla={pantallaActual} faseSeleccionada={fase} onSelect={handlePlanSelect} progreso={progreso} />;
      case "resultado":
        const cotizacion = getCotizacionResult();
        if (!cotizacion) return (
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">No hay cotización disponible. Verifica los datos ingresados.</Text>
          </View>
        );
        return <ResultadoScreen pantalla={pantallaActual} cotizacion={cotizacion} faseSeleccionada={getFaseSeleccionada()} flujoTitulo={flujo.titulo} />;
      default:
        return null;
    }
  };

  return (
    <View className="flex-1 pt-10 bg-white">
      <StatusBar style="dark" />
      <SafeAreaView className="bg-white">
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row justify-between items-center">
            <TouchableOpacity onPress={handleGoBack} className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name="arrow-back" size={24} color="#111827" />
            </TouchableOpacity>
            <View className="flex-1 ml-4">
              <Text className="text-sm text-gray-500 font-medium">{flujo.titulo}</Text>
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