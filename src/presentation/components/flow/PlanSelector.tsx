import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PlanEntity } from "../../../domain/entities/Plan";

interface PlanSelectorProps {
  planes: PlanEntity[];
  planSeleccionado?: PlanEntity;
  onPlanSelect: (plan: PlanEntity) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({
  planes,
  planSeleccionado,
  onPlanSelect,
}) => {
  return (
    <View className="gap-4">
      {planes.map((plan) => {
        const isSelected = planSeleccionado?.id === plan.id;
        const isPremium = plan.esPremium();

        return (
          <TouchableOpacity
            key={plan.id}
            activeOpacity={0.9}
            onPress={() => onPlanSelect(plan)}
            className={`rounded-2xl p-5 border-2 ${
              isSelected
                ? isPremium
                  ? "border-amber-500 bg-amber-50"
                  : "border-green-500 bg-green-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View
                  className={`h-12 w-12 rounded-xl items-center justify-center ${
                    isPremium ? "bg-amber-100" : "bg-green-100"
                  }`}
                >
                  <Ionicons
                    name={isPremium ? "star" : "wallet-outline"}
                    size={24}
                    color={isPremium ? "#F59E0B" : "#22C55E"}
                  />
                </View>
                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    {plan.nombre}
                  </Text>
                  <Text
                    className={`text-sm font-medium ${
                      isPremium ? "text-amber-600" : "text-green-600"
                    }`}
                  >
                    {isPremium ? "Línea BIO NOVA" : "Línea PS"}
                  </Text>
                </View>
              </View>

              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  isSelected
                    ? isPremium
                      ? "border-amber-500 bg-amber-500"
                      : "border-green-500 bg-green-500"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <Ionicons name="checkmark" size={16} color="white" />
                )}
              </View>
            </View>

            {plan.descripcion && (
              <Text className="text-sm text-gray-600 mb-3 leading-5">
                {plan.descripcion}
              </Text>
            )}

            {plan.beneficios.length > 0 && (
              <View className="gap-2">
                {plan.beneficios.map((beneficio, index) => (
                  <View key={index} className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={isPremium ? "#F59E0B" : "#22C55E"}
                    />
                    <Text className="text-sm text-gray-700 ml-2">
                      {beneficio}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};
