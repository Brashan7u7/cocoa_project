import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PantallaEntity } from "../../domain/entities/Pantalla";
import { FlowProgressIndicator } from "../components/flow/FlowProgressIndicator";

interface InputScreenProps {
  pantalla: PantallaEntity;
  onSubmit: (value: number) => void;
  progreso?: { actual: number; total: number };
  notaLateral?: string;
}

export const InputScreen: React.FC<InputScreenProps> = ({
  pantalla,
  onSubmit,
  progreso,
  notaLateral,
}) => {
  const [valor, setValor] = useState("");
  const [error, setError] = useState("");

  const variableCaptura = pantalla.variableCaptura;

  const handleSubmit = () => {
    setError("");
    const cantidad = parseInt(valor);

    if (isNaN(cantidad) || cantidad <= 0) {
      setError("Por favor ingresa una cantidad válida");
      return;
    }

    if (variableCaptura) {
      const validacion = variableCaptura.validar(cantidad);
      if (!validacion.valido) {
        setError(validacion.mensaje || "Valor fuera de rango");
        return;
      }
    }

    onSubmit(cantidad);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1"
    >
      <ScrollView
        className="flex-1 px-6 pt-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {progreso && (
          <FlowProgressIndicator
            currentStep={progreso.actual}
            totalSteps={progreso.total}
          />
        )}

        <View className="mb-6">
          {pantalla.titulo && (
            <Text className="text-lg font-medium text-gray-500 mb-1">
              {pantalla.titulo}
            </Text>
          )}
          <Text className="text-2xl font-bold text-gray-900">
            {pantalla.pregunta || variableCaptura?.label}
          </Text>
        </View>

        <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mb-6">
          <Text className="text-gray-600 font-medium mb-3">
            {variableCaptura?.label || "Cantidad"}
          </Text>

          <View className="flex-row gap-3 mb-2">
            <View className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
              <Ionicons name="calculator-outline" size={20} color="#9CA3AF" />
              <TextInput
                className="flex-1 ml-3 text-lg font-semibold text-gray-900"
                placeholder="0"
                keyboardType="numeric"
                value={valor}
                onChangeText={setValor}
                placeholderTextColor="#9CA3AF"
              />
            </View>
            <TouchableOpacity
              onPress={handleSubmit}
              className="bg-indigo-600 rounded-xl px-6 justify-center items-center shadow-md"
            >
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {error ? (
            <Text className="text-red-500 text-xs mt-1 font-medium">
              {error}
            </Text>
          ) : (
            <Text className="text-gray-400 text-xs mt-1">
              {variableCaptura
                ? `Rango válido: ${variableCaptura.minimo} - ${variableCaptura.maximo}`
                : "Ingresa la cantidad para continuar."}
            </Text>
          )}
        </View>

        {notaLateral && (
          <View className="bg-blue-50 p-4 rounded-2xl flex-row gap-3 mb-6">
            <Ionicons name="information-circle" size={24} color="#3B82F6" />
            <Text className="text-blue-700 text-sm flex-1 leading-5">
              {notaLateral}
            </Text>
          </View>
        )}

        <View className="h-10" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
