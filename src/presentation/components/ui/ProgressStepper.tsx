import React from 'react';
import { View, Text } from 'react-native';

interface Step {
  number: number;
  title: string;
  description: string;
}

interface ProgressStepperProps {
  currentStep: number;
  totalSteps?: number;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  currentStep,
  totalSteps = 2,
}) => {
  const steps: Step[] = [
    {
      number: 1,
      title: 'Etapa',
      description: 'Elige la fase',
    },
    {
      number: 2,
      title: 'Cotización',
      description: 'Calcula costos',
    },
  ];

  const progress = (currentStep / totalSteps) * 100;

  return (
    <View className="bg-white px-4 py-4 border-b border-gray-200">
      
      <View className="mb-3">
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-600 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>


      <View className="flex-row justify-between items-start">
        {steps.map((step, index) => {
          const isActive = step.number === currentStep;
          const isCompleted = step.number < currentStep;
          const isPending = step.number > currentStep;

          return (
            <View key={step.number} className="flex-1 items-center">
           
              <View
                className={`
                  w-8 h-8 rounded-full items-center justify-center mb-2
                  ${isCompleted ? 'bg-secondary-600' : ''}
                  ${isActive ? 'bg-primary-600' : ''}
                  ${isPending ? 'bg-gray-300' : ''}
                `}
              >
                {isCompleted ? (
                  <Text className="text-white text-sm font-bold">✓</Text>
                ) : (
                  <Text
                    className={`
                      text-sm font-bold
                      ${isActive || isCompleted ? 'text-white' : 'text-gray-600'}
                    `}
                  >
                    {step.number}
                  </Text>
                )}
              </View>

           
              <View className="items-center">
                <Text
                  className={`
                    text-xs font-semibold mb-0.5
                    ${isActive ? 'text-primary-600' : ''}
                    ${isCompleted ? 'text-secondary-600' : ''}
                    ${isPending ? 'text-gray-400' : ''}
                  `}
                >
                  {step.title}
                </Text>
                <Text
                  className={`
                    text-xs text-center
                    ${isActive || isCompleted ? 'text-gray-600' : 'text-gray-400'}
                  `}
                  style={{ fontSize: 10 }}
                >
                  {step.description}
                </Text>
              </View>
            </View>
          );
        })}
      </View>


      <View className="mt-3">
        <Text className="text-xs text-center text-gray-500">
          Paso {currentStep} de {totalSteps} • {Math.round(progress)}% completado
        </Text>
      </View>
    </View>
  );
};