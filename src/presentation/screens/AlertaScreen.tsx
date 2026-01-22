import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PantallaEntity } from "../../domain/entities/Pantalla";

interface AlertaScreenProps {
  pantalla: PantallaEntity;
  onContinue: () => void;
}

export const AlertaScreen: React.FC<AlertaScreenProps> = ({
  pantalla,
  onContinue,
}) => {
  return (
    <ScrollView
      className="flex-1 px-6 pt-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <View className="flex-1 justify-center items-center py-10">
        <View className="bg-amber-100 w-24 h-24 rounded-full items-center justify-center mb-6">
          <Ionicons name="warning-outline" size={48} color="#F59E0B" />
        </View>

        <Text className="text-2xl font-bold text-gray-900 text-center mb-4">
          {pantalla.titulo || "Atención"}
        </Text>

        {pantalla.mensaje && (
          <Text className="text-base text-gray-600 text-center leading-6 mb-6 px-4">
            {pantalla.mensaje}
          </Text>
        )}

        {pantalla.recomendacion && (
          <View className="bg-blue-50 p-4 rounded-2xl w-full mb-8">
            <View className="flex-row items-start gap-3">
              <Ionicons name="bulb-outline" size={24} color="#3B82F6" />
              <Text className="text-blue-700 text-sm flex-1 leading-5">
                {pantalla.recomendacion}
              </Text>
            </View>
          </View>
        )}
      </View>

      {pantalla.botonContinuar && (
        <View className="pb-10">
          <TouchableOpacity
            onPress={onContinue}
            className="bg-gray-900 py-4 rounded-xl items-center"
          >
            <Text className="text-white font-bold text-base">
              ENTENDIDO
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
};
