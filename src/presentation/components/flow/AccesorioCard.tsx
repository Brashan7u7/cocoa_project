import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AccesorioEntity } from "../../../domain/entities/Accesorio";

interface AccesorioCardProps {
  accesorio: AccesorioEntity;
  cantidadSugerida?: number;
  onToggle?: (accesorio: AccesorioEntity, selected: boolean, cantidad?: number) => void;
  isSelected?: boolean;
}

export const AccesorioCard: React.FC<AccesorioCardProps> = ({
  accesorio,
  cantidadSugerida,
  onToggle,
  isSelected = false,
}) => {
  const [selected, setSelected] = useState(isSelected);
  const [cantidad, setCantidad] = useState(1);

  const handlePress = () => {
    const newSelected = !selected;
    setSelected(newSelected);
    onToggle?.(accesorio, newSelected, cantidad);
  };

  const handleCantidadChange = (increment: boolean) => {
    const newCantidad = increment ? cantidad + 1 : Math.max(1, cantidad - 1);
    setCantidad(newCantidad);
    onToggle?.(accesorio, selected, newCantidad);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(amount);
  };

  const calcularSubtotal = () => {
    return accesorio.precio * cantidad;
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      className={`rounded-2xl p-4 border-2 ${
        selected ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-white"
      }`}
    >
      <View className="flex-row items-center">
        {accesorio.imagen && accesorio.imagen.startsWith("http") ? (
          <View className="h-12 w-12 rounded-xl overflow-hidden mr-4">
            <Image
              source={{ uri: accesorio.imagen }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        ) : (
          <View
            className={`h-12 w-12 rounded-xl items-center justify-center mr-4 ${
              selected ? "bg-indigo-100" : "bg-gray-100"
            }`}
          >
            <Ionicons
              name={
                accesorio.id.includes("bebedero")
                  ? "water-outline"
                  : accesorio.id.includes("corral")
                  ? "home-outline"
                  : "cube-outline"
              }
              size={24}
              color={selected ? "#4F46E5" : "#6B7280"}
            />
          </View>
        )}

        <View className="flex-1">
          <Text className="text-base font-bold text-gray-900">
            {accesorio.nombre}
          </Text>
          <Text className="text-sm text-gray-500 mt-0.5">
            {accesorio.descripcion}
          </Text>

          <View className="flex-row items-center justify-between mt-2">
            <View className="flex-row items-center gap-3">
              <View className="flex-row items-center">
                <Ionicons name="pricetag-outline" size={14} color="#9CA3AF" />
                <Text className="text-sm font-bold text-gray-700 ml-1">
                  {formatCurrency(accesorio.precio)}
                </Text>
              </View>

              {accesorio.presentacion && (
                <View className="bg-gray-100 px-2 py-0.5 rounded">
                  <Text className="text-xs text-gray-600">
                    {accesorio.presentacion}
                  </Text>
                </View>
              )}
            </View>

            {selected && (
              <View className="flex-row items-center bg-white border border-gray-300 rounded-lg">
                <TouchableOpacity
                  onPress={() => handleCantidadChange(false)}
                  className="px-3 py-1"
                >
                  <Text className="text-gray-700 font-bold">-</Text>
                </TouchableOpacity>
                <Text className="px-3 py-1 text-gray-900 font-bold">
                  {cantidad}
                </Text>
                <TouchableOpacity
                  onPress={() => handleCantidadChange(true)}
                  className="px-3 py-1"
                >
                  <Text className="text-gray-700 font-bold">+</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {selected && (
            <View className="mt-2 pt-2 border-t border-gray-200">
              <Text className="text-xs text-gray-600">
                Subtotal: <Text className="font-bold text-indigo-600">{formatCurrency(calcularSubtotal())}</Text>
              </Text>
            </View>
          )}

          {cantidadSugerida !== undefined && cantidadSugerida > 0 && (
            <View className="flex-row items-center mt-2 bg-blue-50 px-2 py-1 rounded-lg self-start">
              <Ionicons
                name="information-circle-outline"
                size={14}
                color="#3B82F6"
              />
              <Text className="text-xs text-blue-700 ml-1">
                Sugerido: {cantidadSugerida.toFixed(1)} kg
              </Text>
            </View>
          )}
        </View>

        <View
          className={`w-6 h-6 rounded-full border-2 items-center justify-center ml-2 ${
            selected ? "border-indigo-500 bg-indigo-500" : "border-gray-300"
          }`}
        >
          {selected && <Ionicons name="checkmark" size={16} color="white" />}
        </View>
      </View>
    </TouchableOpacity>
  );
};