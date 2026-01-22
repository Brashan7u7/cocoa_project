import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { CotizacionResult } from "../../domain/services/FlowEngine";
import { AccesorioEntity } from "../../domain/entities/Accesorio";
import { AccesorioCard } from "../components/flow/AccesorioCard";
import { generateCotizacionPDF } from "../utils/pdfGenerator";
import DIContainer from "../../di/container";

interface ResultadoScreenProps {
  pantalla: PantallaEntity;
  cotizacion: CotizacionResult;
  faseSeleccionada?: string;
  flujoTitulo: string;
}

export const ResultadoScreen: React.FC<ResultadoScreenProps> = ({
  pantalla,
  cotizacion,
  faseSeleccionada,
  flujoTitulo,
}) => {
  const router = useRouter();
  const [accesorios, setAccesorios] = useState<AccesorioEntity[]>([]);
  const [loadingAccesorios, setLoadingAccesorios] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    if (pantalla.mostrarAccesorios && faseSeleccionada) {
      loadAccesorios();
    }
  }, [pantalla.mostrarAccesorios, faseSeleccionada]);

  const loadAccesorios = async () => {
    if (!faseSeleccionada) return;

    setLoadingAccesorios(true);
    try {
      const data = await DIContainer.accesorioRepository.getAccesoriosPorFase(
        faseSeleccionada
      );
      setAccesorios(data);
    } catch (error) {
      console.error("Error loading accesorios:", error);
    } finally {
      setLoadingAccesorios(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const handleWhatsApp = () => {
    const numeroWhatsApp = "529513592520";

    const mensaje =
      `Hola! Me interesa cotizar:\n\n` +
      `Producto: ${cotizacion.producto.nombre}\n` +
      `Cantidad de animales: ${cotizacion.cantidadAnimales}\n` +
      `Bultos necesarios: ${cotizacion.bultosNecesarios}\n` +
      `Total estimado: ${formatCurrency(cotizacion.costoTotal)}`;

    const url = `whatsapp://send?phone=${numeroWhatsApp}&text=${encodeURIComponent(
      mensaje
    )}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Error",
        "No se pudo abrir WhatsApp. Asegúrate de tener la app instalada."
      );
    });
  };

  const getLabelUnidades = () => {
    if (flujoTitulo.toLowerCase().includes("lechon")) return "Lechones";
    if (flujoTitulo.toLowerCase().includes("engord")) return "Cerdos";
    if (flujoTitulo.toLowerCase().includes("reproduc")) return "Reproductores";
    return "Animales";
  };

  const handleGeneratePDF = async () => {
    setGeneratingPDF(true);

    try {
      const result = await generateCotizacionPDF(
        cotizacion,
        flujoTitulo,
        faseSeleccionada || "General",
        getLabelUnidades()
      );

      if (result.success) {
        Alert.alert("PDF Generado", "La cotización se ha generado exitosamente.");
      } else {
        Alert.alert("Error", "No se pudo generar el PDF. Intenta de nuevo.");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al generar el PDF.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleFinish = () => {
    router.replace("/");
  };

  const handleAgregarCarrito = () => {
    Alert.alert(
      "Función en desarrollo",
      "La función de agregar al carrito estará disponible próximamente.",
      [{ text: "Entendido", style: "default" }]
    );
  };

  return (
    <ScrollView
      className="flex-1 px-6 pt-4"
      showsVerticalScrollIndicator={false}
    >
      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {pantalla.titulo || "Tu cotización"}
        </Text>
        <Text className="text-base text-gray-500">
          Resumen de alimento recomendado
        </Text>
      </View>

      {/* Producto recomendado */}
      <View className="bg-indigo-50 rounded-2xl p-5 mb-6 border border-indigo-100">
        <Text className="text-sm font-medium text-indigo-600 mb-2">
          Producto recomendado
        </Text>
        <Text className="text-xl font-bold text-gray-900 mb-1">
          {cotizacion.producto.nombre}
        </Text>
        <Text className="text-sm text-gray-600">
          {cotizacion.producto.descripcion}
        </Text>

        {cotizacion.plan && (
          <View className="mt-3 pt-3 border-t border-indigo-200">
            <View className="flex-row items-center">
              <Ionicons name="document-text-outline" size={16} color="#4F46E5" />
              <Text className="text-sm text-indigo-700 ml-2">
                Plan: {cotizacion.plan.nombre}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Resultado de cotización */}
      <View className="bg-gray-800 rounded-3xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
              Costo Estimado
            </Text>
            <Text className="text-white text-3xl font-extrabold">
              {formatCurrency(cotizacion.costoTotal)}
            </Text>
          </View>
          <View className="bg-white/10 p-3 rounded-full">
            <Ionicons name="cash-outline" size={24} color="#34D399" />
          </View>
        </View>

        <View className="space-y-3">
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Cantidad de animales</Text>
            <Text className="text-white font-bold">
              {cotizacion.cantidadAnimales}
            </Text>
          </View>
          <View className="h-[1px] bg-gray-700 w-full my-1" />
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Bultos requeridos</Text>
            <Text className="text-white font-bold">
              {cotizacion.bultosNecesarios} pzas
            </Text>
          </View>
          <View className="h-[1px] bg-gray-700 w-full my-1" />
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Total Alimento</Text>
            <Text className="text-white font-bold">
              {cotizacion.consumoTotalKg.toFixed(1)} kg
            </Text>
          </View>
          <View className="h-[1px] bg-gray-700 w-full my-1" />
          <View className="flex-row justify-between">
            <Text className="text-gray-400">Costo por animal</Text>
            <Text className="text-white font-bold">
              {formatCurrency(cotizacion.costoPorAnimal)}
            </Text>
          </View>
        </View>

        <View className="flex-row gap-3 mt-6">
          <TouchableOpacity
            onPress={handleWhatsApp}
            className="flex-1 bg-[#25D366] py-3 rounded-xl flex-row justify-center items-center"
          >
            <Ionicons name="logo-whatsapp" size={20} color="white" />
            <Text className="text-white font-bold ml-2">Pedir</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGeneratePDF}
            disabled={generatingPDF}
            className="flex-1 bg-white py-3 rounded-xl flex-row justify-center items-center"
          >
            {generatingPDF ? (
              <ActivityIndicator size="small" color="#111827" />
            ) : (
              <>
                <Ionicons name="document-text-outline" size={20} color="#111827" />
                <Text className="text-gray-900 font-bold ml-2">PDF</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Accesorios sugeridos */}
      {pantalla.mostrarAccesorios && (
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-900 mb-2">
            Te sugerimos agregar
          </Text>
          <Text className="text-sm text-gray-500 mb-4">
            Complementos recomendados para esta fase
          </Text>

          {loadingAccesorios ? (
            <ActivityIndicator size="small" color="#4F46E5" />
          ) : (
            <View className="gap-3">
              {accesorios.map((accesorio) => (
                <AccesorioCard
                  key={accesorio.id}
                  accesorio={accesorio}
                  cantidadSugerida={
                    accesorio.id === "kilos_lechones"
                      ? cotizacion.cantidadAnimales * 0.2
                      : undefined
                  }
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Botones de acción */}
      <View className="pb-10 gap-3">
        <TouchableOpacity
          onPress={handleAgregarCarrito}
          className="bg-indigo-600 py-4 rounded-xl flex-row items-center justify-center"
        >
          <Ionicons name="cart-outline" size={20} color="white" />
          <Text className="text-white font-bold text-base ml-2">
            Agregar al carrito
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleFinish}
          className="bg-gray-900 py-4 rounded-xl items-center"
        >
          <Text className="text-white font-bold text-base">
            FINALIZAR
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
