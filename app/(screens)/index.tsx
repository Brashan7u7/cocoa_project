import React from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";
import "../../global.css";

// Dimensiones para Grid
const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 16) / 2;

type ObjetivoNegocio =
  | "reproduccion-macho"
  | "reproduccion-hembra"
  | "destete"
  | "engorda";

export default function HomeScreen() {
  const router = useRouter();

  const opciones: {
    id: ObjetivoNegocio;
    titulo: string;
    subtitulo: string;
    icon: string;
    color: string;
  }[] = [
    {
      id: "reproduccion-macho",
      titulo: "Sementales",
      subtitulo: "Reproducción Macho",
      icon: "🐗",
      color: "bg-blue-500",
    },
    {
      id: "reproduccion-hembra",
      titulo: "Vientres",
      subtitulo: "Reproducción Hembra",
      icon: "🐷",
      color: "bg-pink-500",
    },
    {
      id: "destete",
      titulo: "Destete",
      subtitulo: "Cría de Lechones",
      icon: "🌱",
      color: "bg-green-500",
    },
    {
      id: "engorda",
      titulo: "Engorda",
      subtitulo: "Finalización",
      icon: "🍖",
      color: "bg-orange-500",
    },
  ];

  const seleccionar = (objetivo: ObjetivoNegocio) => {
    router.push({
      pathname: "/filtros",
      params: { objetivo },
    });
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* HEADER */}
      <View className="h-[220px] w-full rounded-b-[40px] overflow-hidden shadow-xl relative">
        <ImageBackground
          source={require("@/assets/images/cerdo.jpg")}
          resizeMode="cover"
          className="flex-1 justify-end"
        >
          <View className="p-6 pb-10">
            <Text className="text-slate-200 text-lg font-medium">
              Bienvenido de nuevo
            </Text>

            <Text className="text-white text-4xl font-extrabold leading-tight">
              Asesor Nutricional{" "}
              <Text className="text-amber-400">Porcino</Text>
            </Text>

            <Text className="text-slate-200 mt-4 text-sm leading-5 max-w-[80%]">
              Optimiza la dieta de tu hato seleccionando la etapa fisiológica actual.
            </Text>
          </View>
        </ImageBackground>
      </View>

      {/* CONTENIDO */}
      <ScrollView
        className="-mt-10"
        contentContainerClassName="px-6 pb-28"
        showsVerticalScrollIndicator={false}
      >
        {/* Título Categorías */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-slate-900 text-lg font-bold">Categorías</Text>
         
        </View>

        {/* Grid de Tarjetas */}
        <View className="flex-row flex-wrap justify-between">
          {opciones.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.85}
              onPress={() => seleccionar(item.id)}
              style={{ width: CARD_WIDTH }}
              className="bg-white rounded-[26px] h-[170px] p-4 mb-4 shadow-sm border border-slate-100"
            >
              {/* Icono + indicador */}
              <View className="flex-row justify-between items-start">
                <View className={`bg-slate-100 w-12 h-12 rounded-2xl items-center justify-center`}>
                  <Text className="text-2xl">{item.icon}</Text>
                </View>
                <View className={`w-2 h-2 rounded-full ${item.color}`} />
              </View>

              {/* Textos */}
              <Text className="text-slate-400 text-[12px] uppercase font-bold mt-4">
                {item.subtitulo}
              </Text>

              <Text className="text-slate-900 text-[18px] font-extrabold leading-tight">
                {item.titulo}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
