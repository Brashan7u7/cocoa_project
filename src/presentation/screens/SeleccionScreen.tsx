import React from "react";
import { View, Text, ScrollView } from "react-native";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { OpcionEntity } from "../../domain/entities/Opcion";
import { OptionCard } from "../components/flow/OptionCard";
import { FlowProgressIndicator } from "../components/flow/FlowProgressIndicator";

interface SeleccionScreenProps {
  pantalla: PantallaEntity;
  onSelect: (opcion: OpcionEntity) => void;
  progreso?: { actual: number; total: number };
}

export const SeleccionScreen: React.FC<SeleccionScreenProps> = ({
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
        {pantalla.mensaje && (
          <Text className="text-base text-gray-500">{pantalla.mensaje}</Text>
        )}
      </View>

      <View className="gap-4 pb-10">
        {pantalla.opciones.map((opcion) => (
          <OptionCard
            key={opcion.id}
            opcion={opcion}
            onPress={() => onSelect(opcion)}
          />
        ))}
      </View>
    </ScrollView>
  );
};
