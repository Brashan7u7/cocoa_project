import React from "react";
import { View, Text } from "react-native";

interface FlowProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}

export const FlowProgressIndicator: React.FC<FlowProgressIndicatorProps> = ({
  currentStep,
  totalSteps,
  labels,
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="mb-6">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm font-medium text-gray-500">
          Paso {currentStep} de {totalSteps}
        </Text>
        <Text className="text-sm font-bold text-indigo-600">
          {Math.round(progress)}%
        </Text>
      </View>

      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>

      {labels && labels.length > 0 && (
        <View className="flex-row justify-between mt-3">
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;

            return (
              <View key={index} className="items-center">
                <View
                  className={`w-6 h-6 rounded-full items-center justify-center mb-1 ${
                    isCompleted
                      ? "bg-green-500"
                      : isCurrent
                      ? "bg-indigo-500"
                      : "bg-gray-300"
                  }`}
                >
                  <Text className="text-xs font-bold text-white">
                    {stepNumber}
                  </Text>
                </View>
                <Text
                  className={`text-xs ${
                    isCurrent ? "text-indigo-600 font-bold" : "text-gray-500"
                  }`}
                >
                  {label}
                </Text>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};
