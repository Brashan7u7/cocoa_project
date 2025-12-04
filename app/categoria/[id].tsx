import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, ImageBackground, Image } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProgressStepper } from '../../src/presentation/components/ui/ProgressStepper';
import { CategoriaEntity } from '../../src/domain/entities/Categoria';
import DIContainer from '../../src/di/container';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function CategoriaScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [categoria, setCategoria] = useState<CategoriaEntity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategoria();
  }, [id]);

  const loadCategoria = async () => {
    try {
      const result = await DIContainer.getCategoriaByIdUseCase.execute(id as string);
      setCategoria(result || null);
    } catch (error) {
      console.error('Error loading categoria:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEtapaSelect = (etapaId: string) => {
    router.push(`/etapa/${id}/${etapaId}`);
  };

  const getEtapaIcon = (etapa: any) => {
    if (etapa.rangoEdadDias) return 'calendar-outline';
    if (etapa.rangoPeso) return 'scale-outline';
    return 'stats-chart-outline';
  };

  const getCategoryAssets = (catId: string) => {
    switch(catId) {
      case 'reproduccion': 
        return { 
          bgImage: { uri: 'https://imgs.search.brave.com/p5be-eJeXD29havkclKZi1AqssTBZ5GxZL8I1DVWJiY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/YWRvcmFibGVzLWNl/cmRvcy1iZWJlcy1n/cmFuamFfMjMtMjE0/OTA2NjE4Mi5qcGc_/c2VtdD1haXNfaHli/cmlkJnc9NzQwJnE9/ODA' },
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          iconColor: '#EF4444'
        };
      case 'criar_lechones': 
        return { 
          bgImage: { uri: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop' },
          color: 'text-blue-500',
          bgColor: 'bg-blue-50',
          iconColor: '#3B82F6'
        };
      case 'engorda_cerdos': 
        return { 
          bgImage: { uri: 'https://imgs.search.brave.com/-iJZkbyGGCGqQNN90SRhUto3pOmIfVONu5ndaGtHqLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jZXJk/by1tZWxlbnVkby1n/b3Jkby1ncmFuZGUt/cXVlLW1pcmEtbGEt/YyVDMyVBMW1hcmEt/OTI1ODg1NTkuanBn' },
          color: 'text-purple-500',
          bgColor: 'bg-purple-50',
          iconColor: '#A855F7'
        };
      default: 
        return { 
          bgImage: { uri: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop' },
          color: 'text-gray-500',
          bgColor: 'bg-gray-50',
          iconColor: '#6B7280'
        };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!categoria) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text className="text-lg text-gray-600 text-center mt-4">
          Categoría no encontrada
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-gray-900 px-6 py-3 rounded-full">
            <Text className="text-white font-bold">Volver al inicio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const assets = getCategoryAssets(id as string);

  return (
    <View className="flex-1 bg-white">
      <StatusBar style="light" />
      
      <ImageBackground 
        source={assets.bgImage} 
        className="h-72 w-full justify-start pt-12 px-4"
      >
        <View className="absolute inset-0 bg-black/30" />
        
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full items-center justify-center border border-white/30"
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View className="mt-8 px-2">
            <View className="bg-white/90 self-start px-3 py-1 rounded-full mb-3">
                <Text className={`text-xs font-bold ${assets.color} uppercase`}>Paso 1 de 2</Text>
            </View>
            <Text className="text-white text-3xl font-extrabold shadow-sm">
                {categoria.titulo}
            </Text>
        </View>
      </ImageBackground>

      <View className="flex-1 bg-white -mt-8 rounded-t-[32px] px-6 pt-8 shadow-2xl shadow-black">
        <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            
            <View className="mb-8">
                <Text className="text-gray-500 text-base leading-6 font-medium">
                    {categoria.descripcion}
                </Text>
            </View>

            <View className="mb-6">
                <ProgressStepper currentStep={1} totalSteps={2} />
            </View>

            <View className={`${assets.bgColor} p-4 rounded-2xl mb-8 flex-row items-center border border-white shadow-sm`}>
                <View className="bg-white p-2 rounded-full mr-3 shadow-sm">
                    <Ionicons name="filter" size={20} color={assets.iconColor} />
                </View>
                <View className="flex-1">
                    <Text className="text-gray-900 font-bold text-sm">Segmentación </Text>
                    <Text className="text-gray-500 text-xs mt-0.5">Elige la fase según el estado actual.</Text>
                </View>
            </View>

            <Text className="text-xl font-bold text-gray-900 mb-5">Selecciona la Fase</Text>

            <View className="gap-4 pb-10">
              {categoria.etapas.map((etapa) => (
                <TouchableOpacity
                  key={etapa.id}
                  activeOpacity={0.9}
                  onPress={() => handleEtapaSelect(etapa.id)}
                  className="bg-white rounded-2xl p-4 shadow-sm shadow-gray-200 border border-gray-100 flex-row items-center"
                >
                  <View className={`h-14 w-14 rounded-2xl ${assets.bgColor} items-center justify-center mr-4`}>
                    <Ionicons name={getEtapaIcon(etapa) as any} size={24} color={assets.iconColor} />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row justify-between items-center mb-1">
                        <Text className="text-base font-bold text-gray-900">{etapa.titulo}</Text>
                        <Ionicons name="chevron-forward" size={18} color="#D1D5DB" />
                    </View>
                    
                    <View className="flex-row items-center gap-2">
                        <View className="bg-gray-100 px-2 py-1 rounded-md">
                             <Text className="text-xs font-semibold text-gray-600">{etapa.getRangoDescripcion()}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center mt-2">
                         <Ionicons name="cube-outline" size={12} color="#9CA3AF" style={{marginRight: 4}} />
                         <Text className="text-xs text-gray-500">Producto recomendado: </Text>
                         <Text className="text-xs font-bold text-gray-700">{etapa.productoRecomendado.nombre}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
        </ScrollView>
      </View>
    </View>
  );
}