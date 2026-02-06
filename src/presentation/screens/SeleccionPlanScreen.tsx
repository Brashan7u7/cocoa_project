import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { PlanEntity } from "../../domain/entities/Plan";
import { OpcionEntity } from "../../domain/entities/Opcion";
import { PlanSelector } from "../components/flow/PlanSelector";
import { FlowProgressIndicator } from "../components/flow/FlowProgressIndicator";
import { dataSource } from "../../data/datasources";
import { PlanMapper } from "../../data/mappers/PlanMapper";

interface SeleccionPlanScreenProps {
  pantalla: PantallaEntity;
  faseSeleccionada: string;
  onSelect: (plan: PlanEntity, opcion: OpcionEntity) => void;
  progreso?: { actual: number; total: number };
}

export const SeleccionPlanScreen: React.FC<SeleccionPlanScreenProps> = ({
  pantalla,
  faseSeleccionada,
  onSelect,
  progreso,
}) => {
  const [planes, setPlanes] = useState<PlanEntity[]>([]);
  const [planSeleccionado, setPlanSeleccionado] = useState<PlanEntity | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlanes();
  }, [faseSeleccionada]);

  const loadPlanes = async () => {
    try {
      const planesData = await dataSource.getPlanesPorFase(faseSeleccionada);
      const planesEntities = PlanMapper.toDomainList(planesData);
      setPlanes(planesEntities);

      // Seleccionar el primero por defecto
      if (planesEntities.length > 0) {
        setPlanSeleccionado(planesEntities[0]);
      }
    } catch (error) {
      console.error("Error loading planes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!planSeleccionado) return;

    // Buscar la opción correspondiente al tipo de plan
    const opcionCorrespondiente = pantalla.opciones.find(
      (op) => op.id === planSeleccionado.tipo
    );

    if (opcionCorrespondiente) {
      onSelect(planSeleccionado, opcionCorrespondiente);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

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
        <Text className="text-base text-gray-500">
          Elige el plan que mejor se adapte a tus necesidades
        </Text>
      </View>

      <PlanSelector
        planes={planes}
        planSeleccionado={planSeleccionado}
        onPlanSelect={setPlanSeleccionado}
      />

      <View className="mt-8 pb-10">
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!planSeleccionado}
          className={`py-4 rounded-xl items-center flex-row justify-center ${
            planSeleccionado ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <Text className="text-white font-bold text-base mr-2">
            CONTINUAR
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
