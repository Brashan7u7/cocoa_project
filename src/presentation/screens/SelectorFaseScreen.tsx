import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { OpcionEntity } from "../../domain/entities/Opcion";
import { FlowProgressIndicator } from "../components/flow/FlowProgressIndicator";

interface SelectorFaseScreenProps {
  pantalla: PantallaEntity;
  onSelect: (opcion: OpcionEntity) => void;
  progreso?: { actual: number; total: number };
}

export const SelectorFaseScreen: React.FC<SelectorFaseScreenProps> = ({
  pantalla,
  onSelect,
  progreso,
}) => {
  return (
    <ScrollView
      className="flex-1 px-6 pt-4"
      showsVerticalScrollIndicator={false}
    >
      {progreso && (
        <FlowProgressIndicator
          currentStep={progreso.actual}
          totalSteps={progreso.total}
        />
      )}

      <View className="mb-6">
        <Text className="text-2xl font-bold text-gray-900 mb-2">
          {pantalla.getTitulo()}
        </Text>
      </View>

      <View className="gap-4 pb-10">
        {pantalla.opciones.map((opcion) => {
          const isWarning = opcion.id === "menos_7_dias";
          const hasImage = opcion.imagen && opcion.imagen.startsWith("http");

          return (
            <TouchableOpacity
              key={opcion.id}
              activeOpacity={0.9}
              onPress={() => onSelect(opcion)}
              className={`rounded-2xl overflow-hidden border-2 ${
                isWarning
                  ? "border-amber-300 bg-amber-50"
                  : "border-gray-200 bg-white"
              }`}
            >
              {/* Imagen de la fase */}
              {hasImage && (
                <View className="h-32 w-full">
                  <Image
                    source={{ uri: opcion.imagen }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                  {isWarning && (
                    <View className="absolute top-2 left-2 bg-amber-500 px-2 py-1 rounded-full">
                      <Text className="text-white text-xs font-bold">Atención</Text>
                    </View>
                  )}
                </View>
              )}

              <View className="p-4">
                <View className="flex-row items-start">
                  {!hasImage && (
                    <View
                      className={`h-14 w-14 rounded-xl items-center justify-center mr-4 ${
                        isWarning ? "bg-amber-100" : "bg-indigo-100"
                      }`}
                    >
                      <Ionicons
                        name={isWarning ? "warning-outline" : "calendar-outline"}
                        size={28}
                        color={isWarning ? "#F59E0B" : "#4F46E5"}
                      />
                    </View>
                  )}

                  <View className="flex-1">
                    <Text
                      className={`text-lg font-bold mb-1 ${
                        isWarning ? "text-amber-700" : "text-gray-900"
                      }`}
                    >
                      {opcion.titulo}
                    </Text>

                    {opcion.rango && (
                      <View className="bg-indigo-100 px-2 py-1 rounded-lg self-start mb-2">
                        <Text className="text-sm font-medium text-indigo-700">
                          {opcion.rango}
                        </Text>
                      </View>
                    )}

                    {opcion.detalle && (
                      <Text className="text-sm text-gray-500 mb-1">
                        {opcion.detalle}
                      </Text>
                    )}

                    {opcion.consumoEsperado && (
                      <View className="flex-row items-center mt-2">
                        <Ionicons
                          name="restaurant-outline"
                          size={14}
                          color="#6B7280"
                        />
                        <Text className="text-sm text-gray-600 ml-1">
                          Consumo: {opcion.consumoEsperado}
                        </Text>
                      </View>
                    )}
                  </View>

                  <Ionicons name="chevron-forward" size={22} color="#D1D5DB" />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
};
