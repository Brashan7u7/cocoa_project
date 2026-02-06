import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  FlatList,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useFlow } from "../src/presentation/context/FlowContext";
import { FlujoEntity } from "../src/domain/entities/Flujo";
import DIContainer from "../src/di/container";

export default function HomeScreen() {
  const { startFlow, isLoading } = useFlow();
  const [flujos, setFlujos] = useState<FlujoEntity[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Responsive: detecta rotación y dimensiones
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const numColumns = isLandscape ? 2 : 1;

  useEffect(() => {
    loadFlujos();
  }, []);

  const loadFlujos = async () => {
    try {
      const result = await DIContainer.flujoRepository.getFlujos();
      setFlujos(result);
    } catch (error) {
      console.error("Error loading flujos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlujoSelect = (flujoId: string) => {
    if (flujoId === "reproducir" || flujoId === "engordar_cerdos") {
      Alert.alert(
        "Acceso Restringido",
        "Este módulo está en proceso de actualización.",
        [{ text: "Entendido" }]
      );
      return;
    }
    startFlow(flujoId);
  };

  const getFlujoAssets = (id: string) => {
    const assets = {
      reproducir: { color: "#F87171", img: "https://imgs.search.brave.com/p5be-eJeXD29havkclKZi1AqssTBZ5GxZL8I1DVWJiY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/YWRvcmFibGVzLWNl/cmRvcy1iZWJlcy1n/cmFuamFfMjMtMjE0/OTA2NjE4Mi5qcGc_/c2VtdD1haXNfaHli/cmlkJnc9NzQwJnE9/ODA" },
      criar_lechones: { color: "#60A5FA", img: "https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop" },
      engordar_cerdos: { color: "#A78BFA", img: "https://imgs.search.brave.com/-iJZkbyGGCGqQNN90SRhUto3pOmIfVONu5ndaGtHqLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jZXJk/by1tZWxlbnVkby1n/b3Jkby1ncmFuZGUt/cXVlLW1pcmEtbGEt/YyVDMyVBMW1hcmEt/OTI1ODg1NTkuanBn" },
    };
    return assets[id as keyof typeof assets] || { color: "#9CA3AF", img: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop" };
  };

  const renderItem = ({ item }: { item: FlujoEntity }) => {
    const assets = getFlujoAssets(item.id);
    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => handleFlujoSelect(item.id)}
        style={{ width: isLandscape ? '48.5%' : '100%' }}
        className="bg-white rounded-[24px] mb-6 shadow-sm border border-gray-100 overflow-hidden"
      >
        <View className="h-52 w-full">
          <Image source={{ uri: assets.img }} className="w-full h-full" resizeMode="cover" />
        </View>

        <View className="p-6">
          <Text className="text-2xl font-bold text-gray-800 mb-2">{item.titulo}</Text>
          <Text className="text-gray-500 text-base mb-6 leading-5" numberOfLines={2}>
            {item.subtitulo || item.descripcion}
          </Text>
          
          <View className="flex-row items-center justify-between pt-4 border-t border-gray-50">
            <Text style={{ color: assets.color }} className="font-semibold text-lg">
              Abrir módulo
            </Text>
            <View style={{ backgroundColor: assets.color }} className="p-2 rounded-full">
              <Ionicons name="chevron-forward" size={20} color="white" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading || isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FBFBFB]">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      <FlatList
        data={flujos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        // Clave dinámica para refrescar layout al rotar tablet
        key={numColumns}
        numColumns={numColumns}
        columnWrapperStyle={isLandscape ? { justifyContent: 'space-between' } : null}
        contentContainerStyle={{ paddingHorizontal: 30, paddingTop: 20, paddingBottom: 50 }}
        ListHeaderComponent={() => (
          <View className="mb-10 mt-6">
            <Text className="text-4xl font-black text-gray-900 tracking-tight">
              Áreas de Trabajo
            </Text>
            <Text className="text-gray-400 text-xl mt-1">
              Gestión y monitoreo de granja
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}