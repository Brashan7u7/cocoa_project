import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { OpcionEntity } from "../../../domain/entities/Opcion";

interface OptionCardProps {
  opcion: OpcionEntity;
  onPress: () => void;
  selected?: boolean;
  showIcon?: boolean;
  showImage?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  opcion,
  onPress,
  selected = false,
  showIcon = true,
  showImage = true,
}) => {
  const getIconName = (): keyof typeof Ionicons.glyphMap => {
    if (opcion.icono?.includes("warning")) return "warning-outline";
    if (opcion.icono?.includes("info")) return "information-circle-outline";
    if (opcion.icono?.includes("hembra")) return "female-outline";
    if (opcion.icono?.includes("macho")) return "male-outline";
    if (opcion.icono?.includes("lactancia")) return "water-outline";
    return "chevron-forward-outline";
  };

  const hasAlert = opcion.mensajeAlerta || opcion.colorAlerta;
  const hasInfo = opcion.mensajeInfo;
  const hasImage = showImage && opcion.imagen && opcion.imagen.startsWith("http");

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      className={`bg-white rounded-2xl overflow-hidden shadow-sm border-2 ${
        selected ? "border-indigo-500 bg-indigo-50" : "border-gray-100"
      }`}
    >
      {/* Imagen si existe */}
      {hasImage && (
        <View className="h-28 w-full">
          <Image
            source={{ uri: opcion.imagen }}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      )}

      <View className="p-4">
        <View className="flex-row items-center">
          {showIcon && !hasImage && (
            <View
              className={`h-12 w-12 rounded-xl items-center justify-center mr-4 ${
                hasAlert
                  ? "bg-amber-100"
                  : hasInfo
                  ? "bg-blue-100"
                  : "bg-gray-100"
              }`}
            >
              <Ionicons
                name={getIconName()}
                size={24}
                color={hasAlert ? "#F59E0B" : hasInfo ? "#3B82F6" : "#6B7280"}
              />
            </View>
          )}

          <View className="flex-1">
            <Text className="text-base font-bold text-gray-900 mb-1">
              {opcion.titulo}
            </Text>

            {opcion.subtitulo && (
              <Text className="text-sm text-gray-500">{opcion.subtitulo}</Text>
            )}

            {opcion.rango && (
              <View className="flex-row items-center mt-1">
                <View className="bg-gray-100 px-2 py-0.5 rounded">
                  <Text className="text-xs font-medium text-gray-600">
                    {opcion.rango}
                  </Text>
                </View>
              </View>
            )}

            {opcion.detalle && (
              <Text className="text-xs text-gray-400 mt-1">{opcion.detalle}</Text>
            )}

            {opcion.consumoEsperado && (
              <View className="flex-row items-center mt-2">
                <Ionicons name="restaurant-outline" size={12} color="#9CA3AF" />
                <Text className="text-xs text-gray-500 ml-1">
                  Consumo: {opcion.consumoEsperado}
                </Text>
              </View>
            )}
          </View>

          <Ionicons name="chevron-forward" size={20} color="#D1D5DB" />
        </View>

        {(hasAlert || hasInfo) && (
          <View
            className={`mt-3 p-3 rounded-xl ${
              hasAlert ? "bg-amber-50" : "bg-blue-50"
            }`}
          >
            <Text
              className={`text-xs ${
                hasAlert ? "text-amber-700" : "text-blue-700"
              }`}
            >
              {opcion.mensajeAlerta || opcion.mensajeInfo}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};
