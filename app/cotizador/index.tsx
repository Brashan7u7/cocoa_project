// app/cotizador/index.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import data from "../../data/nutricion.json";
import { Etapa } from "../../types/types";
import { calcularNecesidadBultos, calcularTotalPrecio } from "../../utils/calculos";
import "../../global.css";

export default function CotizadorScreen() {
  const params = useLocalSearchParams() as { etapa?: string; categoria?: string };
  const etapa: Etapa | undefined = data.categorias.find(c => c.etapas.some(e => e.id === params.etapa))?.etapas.find(e => e.id === params.etapa) as Etapa | undefined;

  const [cantidadStr, setCantidadStr] = useState("10");
  const cantidad = Math.max(0, Number(cantidadStr) || 0);

  if (!etapa) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text>No se encontró la etapa/producto</Text>
      </View>
    );
  }

  const prod = etapa.producto_recomendado;
  const { totalKgNecesarios, bultos } = calcularNecesidadBultos(prod.consumo_total_fase_kg, cantidad, prod.presentacion_kg);
  const totalPrecio = calcularTotalPrecio(bultos, prod.precio_bulto);

  const onWhatsApp = () => {
    if (cantidad <= 0) {
      Alert.alert("Cantidad inválida", "Ingresa una cantidad de cerdos mayor a 0");
      return;
    }
    const text = `Cotización:\nProducto: ${prod.nombre}\nCerdos: ${cantidad}\nBultos: ${bultos}\nTotal estimado: $${totalPrecio.toFixed(2)}`;
    const phone = "52XXXXXXXXXX"; // reemplaza por tu número
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    Linking.openURL(url).catch(() => Alert.alert("Error", "No se pudo abrir WhatsApp"));
  };

  return (
    <ScrollView className="flex-1 p-6 bg-slate-50">
      <Text className="text-3xl font-extrabold mb-4 text-slate-900">Cotizador</Text>

      <View className="bg-white p-4 rounded-lg mb-4">
        <Text className="text-slate-700">Producto</Text>
        <Text className="font-bold text-lg">{prod.nombre}</Text>
      </View>

      <View className="mb-4">
        <Text className="text-slate-700 mb-2">Cantidad de cerdos</Text>
        <TextInput
          value={cantidadStr}
          onChangeText={setCantidadStr}
          keyboardType="numeric"
          className="border border-slate-300 rounded-xl px-4 py-3 text-lg bg-white"
        />
      </View>

      <View className="bg-white p-4 rounded-xl mb-4">
        <Text className="text-slate-600">Total kg necesitados</Text>
        <Text className="font-bold text-xl mb-2">{totalKgNecesarios.toFixed(2)} kg</Text>

        <Text className="text-slate-600">Bultos necesarios</Text>
        <Text className="font-bold text-xl mb-2">{bultos} bultos</Text>

        <Text className="text-slate-600">Total estimado</Text>
        <Text className="font-bold text-2xl text-green-600">${totalPrecio.toFixed(2)}</Text>
      </View>

      <TouchableOpacity className="bg-green-600 p-4 rounded-2xl" onPress={onWhatsApp} activeOpacity={0.85}>
        <Text className="text-white text-center font-bold">Pedir por WhatsApp</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
