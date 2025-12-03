// app/filtros/index.tsx
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import data from "../../data/nutricion.json";
import { Categoria, Etapa } from "@/types/types";

import "../../global.css";

export default function FiltrosScreen() {
  const { objetivo } = useLocalSearchParams() as { objetivo?: string };
  const router = useRouter();

  // Mapear objetivo simple
  let categoria: Categoria | undefined;
  if (objetivo === "destete" || objetivo === "cria-lechones" || objetivo === "cria") {
    categoria = data.categorias.find((c) => c.id === "criar_lechones");
  } else if (objetivo === "engorda" || objetivo === "engorda_cerdos") {
    categoria = data.categorias.find((c) => c.id === "engorda_cerdos");
  }

  if (!categoria) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-slate-700">Categoría no encontrada</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-slate-50 p-6">
      <Text className="text-2xl font-extrabold text-slate-900 mb-4">
        Selecciona la Fase
      </Text>

      {categoria.etapas.map((etapa: Etapa) => (
        <TouchableOpacity
          key={etapa.id}
          className="bg-white rounded-2xl p-4 mb-4 shadow-sm"
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/recomendacion",
              params: { etapa: etapa.id, categoria: categoria?.id },
            })
          }
        >
          <View className="flex-row items-center">
            <Image
            //   source={IMAGES[etapa.imagen_ref] ?? IMAGES["cerdo.jpg"]}
              className="w-20 h-20 rounded-xl mr-4"
            />
            <View>
              <Text className="font-bold text-lg text-slate-900">{etapa.titulo}</Text>
              <Text className="text-slate-500 text-sm">
                {etapa.rango_edad_dias ?? etapa.rango_peso ?? ""}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
