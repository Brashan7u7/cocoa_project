import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import DIContainer from "../../di/container";
import { AccesorioEntity } from "../../domain/entities/Accesorio";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { CotizacionResult } from "../../domain/services/FlowEngine";
import { AccesorioCard } from "../components/flow/AccesorioCard";
import { generateTicket } from "../utils/pdfGenerator";
import { getApiUrl } from "../../config/dataSource.config";

interface ResultadoScreenProps {
  pantalla: PantallaEntity;
  cotizacion: CotizacionResult;
  faseSeleccionada?: string;
  flujoTitulo: string;
}

interface AccesorioSeleccionado {
  accesorio: AccesorioEntity;
  cantidad: number;
  subtotal: number;
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
  const [generatingTicket, setGeneratingTicket] = useState(false);
  const [accesoriosSeleccionados, setAccesoriosSeleccionados] = useState<AccesorioSeleccionado[]>([]);

  useEffect(() => {
    if (pantalla.mostrarAccesorios && faseSeleccionada) {
      loadAccesorios();
    }
  }, [pantalla.mostrarAccesorios, faseSeleccionada]);

  const loadAccesorios = async () => {
    if (!faseSeleccionada) return;

    setLoadingAccesorios(true);
    try {
      const data =
        await DIContainer.accesorioRepository.getAccesoriosPorFase(
          faseSeleccionada,
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

  const calcularTotalConAccesorios = () => {
    const subtotalAccesorios = accesoriosSeleccionados.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );
    return cotizacion.costoTotal + subtotalAccesorios;
  };

  const handleToggleAccesorio = (accesorio: AccesorioEntity, selected: boolean, cantidad: number = 1) => {
    if (selected) {
      const subtotal = accesorio.precio * cantidad;
      setAccesoriosSeleccionados(prev => [
        ...prev.filter(item => item.accesorio.id !== accesorio.id),
        { accesorio, cantidad, subtotal }
      ]);
    } else {
      setAccesoriosSeleccionados(prev => 
        prev.filter(item => item.accesorio.id !== accesorio.id)
      );
    }
  };

  const handleWhatsApp = () => {
    const numeroWhatsApp = "529512280730";
    const unidadesLabel = getLabelUnidades();
    const totalConAccesorios = calcularTotalConAccesorios();

    let mensajeAccesorios = "";
    if (accesoriosSeleccionados.length > 0) {
      mensajeAccesorios = "\n*Accesorios seleccionados:*\n";
      accesoriosSeleccionados.forEach(item => {
        mensajeAccesorios += `• ${item.accesorio.nombre} (${item.cantidad} pzas): ${formatCurrency(item.subtotal)}\n`;
      });
      mensajeAccesorios += `\n*Subtotal accesorios:* ${formatCurrency(
        accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0)
      )}\n`;
    }

    const mensaje =
      `*¡Hola! Me interesa realizar una cotización* 📋\n\n` +
      `*Producto:* ${cotizacion.producto.nombre}\n` +
      `*Cantidad de ${unidadesLabel}:* ${cotizacion.cantidadAnimales}\n` +
      `*Bultos necesarios:* ${cotizacion.bultosNecesarios} pzas\n` +
      `*Total alimento:* ${cotizacion.consumoTotalKg.toFixed(1)} kg\n` +
      `*Costo alimento:* ${formatCurrency(cotizacion.costoTotal)}\n` +
      `${mensajeAccesorios}` +
      `*INVERSIÓN TOTAL:* ${formatCurrency(totalConAccesorios)}\n\n` +
      `_Enviado desde la app de Cotización Porcina_`;

    const url = `whatsapp://send?phone=${numeroWhatsApp}&text=${encodeURIComponent(
      mensaje,
    )}`;

    Linking.openURL(url).catch(() => {
      Alert.alert(
        "Error",
        "No se pudo abrir WhatsApp. Asegúrate de tener la app instalada.",
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
      const apiUrl = getApiUrl();
      const tipoPlan = cotizacion.plan?.tipo || "premium";

      // Preparar datos para el backend
      const requestBody = {
        cantidad_animales: cotizacion.cantidadAnimales,
        fase: faseSeleccionada || "fase_1",
        tipo_plan: tipoPlan,
        accesorios: accesoriosSeleccionados.map(item => ({
          accesorio_id: item.accesorio.id,
          cantidad: item.cantidad,
        })),
        formato: "pdf",
      };

      console.log("📄 Generando PDF desde backend:", requestBody);

      const response = await fetch(`${apiUrl}/cotizacion/generar-base64`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const result = await response.json();

      if (result.success && result.data?.base64) {
        // Guardar el PDF en el dispositivo usando la nueva API
        const filename = result.data.filename || `cotizacion_${Date.now()}.pdf`;
        const file = new File(Paths.document, filename);

        // Convertir base64 a Uint8Array y escribir
        const binaryString = atob(result.data.base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        await file.write(bytes);

        // Verificar si se puede compartir
        const canShare = await Sharing.isAvailableAsync();

        if (canShare) {
          await Sharing.shareAsync(file.uri, {
            mimeType: "application/pdf",
            dialogTitle: "Compartir Cotización",
          });
        } else {
          Alert.alert(
            "PDF Generado",
            `La cotización se guardó en: ${file.uri}`,
          );
        }
      } else {
        Alert.alert("Error", result.message || "No se pudo generar el PDF.");
      }
    } catch (error) {
      console.error("Error generando PDF:", error);
      Alert.alert("Error", "Ocurrió un error al generar el PDF. Verifica la conexión con el servidor.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  const handleGenerateTicket = async () => {
    setGeneratingTicket(true);

    try {
      const result = await generateTicket(
        cotizacion,
        accesoriosSeleccionados
      );

      if (result.success) {
        Alert.alert(
          "Ticket Generado",
          "El ticket se ha generado exitosamente.",
        );
      } else {
        Alert.alert("Error", "No se pudo generar el ticket. Intenta de nuevo.");
      }
    } catch (error) {
      Alert.alert("Error", "Ocurrió un error al generar el ticket.");
    } finally {
      setGeneratingTicket(false);
    }
  };

  const handleFinish = () => {
    router.replace("/");
  };

  const handleAgregarCarrito = () => {
    const itemsCarrito = [
      {
        producto: cotizacion.producto.nombre,
        cantidad: cotizacion.bultosNecesarios,
        precioUnitario: cotizacion.producto.precioBulto,
        subtotal: cotizacion.costoTotal
      },
      ...accesoriosSeleccionados.map(item => ({
        producto: item.accesorio.nombre,
        cantidad: item.cantidad,
        precioUnitario: item.accesorio.precio,
        subtotal: item.subtotal
      }))
    ];

    const totalCarrito = itemsCarrito.reduce((sum, item) => sum + item.subtotal, 0);

    Alert.alert(
      "Resumen del Carrito",
      `Se agregarán ${itemsCarrito.length} items al carrito:\n\n` +
      itemsCarrito.map(item => 
        `${item.producto}: ${item.cantidad} × ${formatCurrency(item.precioUnitario)} = ${formatCurrency(item.subtotal)}`
      ).join('\n') +
      `\n\nTotal: ${formatCurrency(totalCarrito)}`,
      [{ text: "Confirmar", style: "default" }],
    );
  };

  const estaSeleccionado = (accesorioId: string) => {
    return accesoriosSeleccionados.some(item => item.accesorio.id === accesorioId);
  };

  const obtenerCantidad = (accesorioId: string) => {
    const item = accesoriosSeleccionados.find(item => item.accesorio.id === accesorioId);
    return item ? item.cantidad : 1;
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
        {cotizacion.producto.imagen && (
          <View className="h-36 w-full rounded-xl overflow-hidden mb-4">
            <Image
              source={{ uri: cotizacion.producto.imagen }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}
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
              <Ionicons
                name="document-text-outline"
                size={16}
                color="#4F46E5"
              />
              <Text className="text-sm text-indigo-700 ml-2">
                Plan: {cotizacion.plan.nombre}
              </Text>
            </View>
          </View>
        )}
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
                  onToggle={handleToggleAccesorio}
                  isSelected={estaSeleccionado(accesorio.id)}
                />
              ))}
            </View>
          )}
        </View>
      )}

      {/* Resultado de cotización */}
      <View className="bg-gray-800 rounded-3xl p-6 mb-6">
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text className="text-gray-400 text-xs font-bold uppercase mb-1">
              Costo Estimado
            </Text>
            <Text className="text-white text-3xl font-extrabold">
              {formatCurrency(calcularTotalConAccesorios())}
            </Text>
            {accesoriosSeleccionados.length > 0 && (
              <Text className="text-gray-400 text-xs mt-1">
                Incluye {accesoriosSeleccionados.length} accesorio(s)
              </Text>
            )}
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
          
          {accesoriosSeleccionados.length > 0 && (
            <>
              <View className="h-[1px] bg-gray-700 w-full my-1" />
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Costo alimento</Text>
                <Text className="text-white font-bold">
                  {formatCurrency(cotizacion.costoTotal)}
                </Text>
              </View>
              <View className="h-[1px] bg-gray-700 w-full my-1" />
              <View className="flex-row justify-between">
                <Text className="text-gray-400">Accesorios</Text>
                <Text className="text-white font-bold">
                  {formatCurrency(
                    accesoriosSeleccionados.reduce((sum, item) => sum + item.subtotal, 0)
                  )}
                </Text>
              </View>
            </>
          )}
        </View>

        <View className="flex-row gap-2 mt-6">
          <TouchableOpacity
            onPress={handleWhatsApp}
            className="flex-1 bg-[#25D366] py-3 rounded-xl flex-row justify-center items-center"
          >
            <Ionicons name="logo-whatsapp" size={18} color="white" />
            <Text className="text-white font-bold ml-1 text-sm">Pedir</Text>
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
                <Ionicons
                  name="document-text-outline"
                  size={18}
                  color="#111827"
                />
                <Text className="text-gray-900 font-bold ml-1 text-sm">PDF</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleGenerateTicket}
            disabled={generatingTicket}
            className="flex-1 bg-amber-500 py-3 rounded-xl flex-row justify-center items-center"
          >
            {generatingTicket ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Ionicons
                  name="receipt-outline"
                  size={18}
                  color="#fff"
                />
                <Text className="text-white font-bold ml-1 text-sm">Ticket</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>

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
          <Text className="text-white font-bold text-base">FINALIZAR</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};