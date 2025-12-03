// app/recomendacion/index.tsx
import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import data from "../../data/nutricion.json";
import { Categoria, Etapa } from "../../types/types";

import "../../global.css";

export default function RecomendacionScreen() {
  const params = useLocalSearchParams() as { etapa?: string; categoria?: string };
  const router = useRouter();

  const categoria: Categoria | undefined = data.categorias.find((c) =>
    c.id === params.categoria || c.etapas.some((e) => e.id === params.etapa)
  );

  const etapa: Etapa | undefined = categoria?.etapas.find((e) => e.id === params.etapa);

  if (!categoria || !etapa) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-700">No se encontró la etapa seleccionada</Text>
      </View>
    );
  }

  const p = etapa.producto_recomendado;

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <Text className="text-3xl font-extrabold mb-4 text-slate-900">Producto Recomendado</Text>

      <View className="bg-white p-5 rounded-3xl shadow border border-slate-100">
       

        <Text className="text-slate-900 text-2xl font-bold mt-4">{p.nombre}</Text>
        <Text className="text-slate-600 mt-2">{p.descripcion}</Text>
        {p.nota_tecnica ? <Text className="text-slate-500 mt-2">{p.nota_tecnica}</Text> : null}

        <View className="mt-4 bg-slate-50 p-3 rounded-lg">
          <Text className="font-bold">Presentación: {p.presentacion_kg} kg</Text>
          <Text>Precio por bulto: ${p.precio_bulto}</Text>
          <Text>Consumo estimado por unidad en la fase: {p.consumo_total_fase_kg} kg</Text>
        </View>

        <TouchableOpacity
          className="mt-6 bg-amber-500 p-4 rounded-2xl"
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: "/cotizador", params: { etapa: etapa.id, categoria: categoria.id } })}
        >
          <Text className="text-center text-white font-bold">Ir al Cotizador</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
