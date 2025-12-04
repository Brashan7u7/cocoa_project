import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, SafeAreaView, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { StatusBar } from 'expo-status-bar';
import DIContainer from '../src/di/container';
import { CategoriaEntity } from '../src/domain/entities/Categoria';

export default function HomeScreen() {
  const router = useRouter();
  const [categorias, setCategorias] = useState<CategoriaEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const result = await DIContainer.getCategoriasUseCase.execute();
      setCategorias(result);
    } catch (error) {
      console.error('Error loading categorias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoriaSelect = (categoriaId: string) => {
    router.push(`/categoria/${categoriaId}`);
  };


  const getCategoryAssets = (id: string) => {
    switch(id) {
      case 'reproduccion': 
        return { 
          label: 'Reproducción',
          image: { uri: 'https://imgs.search.brave.com/p5be-eJeXD29havkclKZi1AqssTBZ5GxZL8I1DVWJiY/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/Zm90by1ncmF0aXMv/YWRvcmFibGVzLWNl/cmRvcy1iZWJlcy1n/cmFuamFfMjMtMjE0/OTA2NjE4Mi5qcGc_/c2VtdD1haXNfaHli/cmlkJnc9NzQwJnE9/ODA' }, // Cerdo/Granja
          tag: 'Prioridad Alta'
        };
      case 'criar_lechones': 
        return { 
          label: 'Crianza',
          image: { uri: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?q=80&w=800&auto=format&fit=crop' }, // Lechones
          tag: 'En proceso'
        };
      case 'engorda_cerdos': 
        return { 
          label: 'Engorda',
          image: { uri: 'https://imgs.search.brave.com/-iJZkbyGGCGqQNN90SRhUto3pOmIfVONu5ndaGtHqLs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly90aHVt/YnMuZHJlYW1zdGlt/ZS5jb20vYi9jZXJk/by1tZWxlbnVkby1n/b3Jkby1ncmFuZGUt/cXVlLW1pcmEtbGEt/YyVDMyVBMW1hcmEt/OTI1ODg1NTkuanBn' }, // Cerdos grandes
          tag: 'Venta'
        };
      default: 
        return { 
          label: 'General',
          image: { uri: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?q=80&w=800&auto=format&fit=crop' },
          tag: 'Info'
        };
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#FAFAFA]">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#FAFAFA]">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-20">
          
         
          <View className="flex-row justify-between items-center mb-6">
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
              
                 <Image 
                  source={{ uri: 'https://avatars.githubusercontent.com/u/84888260?v=4' }} 
                  className="w-full h-full"
                />
              </View>
              <View>
                <Text className="text-gray-400 text-xs font-medium">Ubicación actual</Text>
                <View className="flex-row items-center">
                  <Ionicons name="location-sharp" size={14} color="#374151" />
                  <Text className="text-gray-800 text-base font-bold ml-1">Mi Granja</Text>
                  <Ionicons name="chevron-down" size={14} color="#9CA3AF" style={{marginLeft: 4}}/>
                </View>
              </View>
            </View>
            <TouchableOpacity className="bg-white p-2.5 rounded-full border border-gray-100 shadow-sm">
               <Ionicons name="notifications-outline" size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          
          <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 py-3 mb-6 shadow-sm">
            <Ionicons name="search-outline" size={22} color="#9CA3AF" />
            <TextInput 
              placeholder="Buscar servicio, cotización..." 
              placeholderTextColor="#9CA3AF"
              className="flex-1 ml-3 text-base text-gray-800"
              editable={false} 
            />
            <TouchableOpacity>
              <Ionicons name="options-outline" size={22} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

         
          <TouchableOpacity activeOpacity={0.2} rounded-3xl className="mb-8 shadow-lg shadow-gray-100">
             <ImageBackground
                source={{ uri: 'https://imgs.search.brave.com/-flScKqLyFfOWwOIVp3BIuEj6RIMzcoleJGXkz6_jYk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLmJs/b2dzLmVzLzRiYTM2/Ni9ndWlhLWRlLWlt/YWdlbmVzLWRlc3Rh/Y2FkYXMtMS0vMzc1/XzE0Mi5wbmc' }}
                imageStyle={{ borderRadius: 24 }}
                className="h-44 w-full rounded-3xl overflow-hidden justify-center px-6"
             >
         
                <View className="absolute inset-0 bg-black/40" />
                
                <View className="relative z-10 w-2/3">
                  <Text className="text-white font-bold text-3xl leading-8 mb-2">
                    OPTIMIZA TU PRODUCCIÓN
                  </Text>
                  <Text className="text-gray-200 text-sm font-medium mb-4">
                    Descuentos hasta 20% en insumos
                  </Text>
                  <View className="bg-white self-start px-4 py-2 rounded-full">
                    <Text className="text-black font-bold text-xs">Explorar Ahora</Text>
                  </View>
                </View>
             </ImageBackground>
          </TouchableOpacity>

          
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">Categorías</Text>
            
          </View>

          <View className="gap-6">
            {categorias.map((categoria) => {
              const assets = getCategoryAssets(categoria.id);
              
              return (
                <TouchableOpacity
                  key={categoria.id}
                  activeOpacity={0.9}
                  onPress={() => handleCategoriaSelect(categoria.id)}
                  className="bg-white rounded-3xl shadow-sm shadow-gray-200 border border-gray-100 overflow-hidden"
                >
                 
                  <View className="h-40 w-full relative">
                    <Image 
                      source={assets.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  
                    <View className="absolute top-4 left-4 bg-white/90 px-3 py-1 rounded-full">
                      <Text className="text-xs font-bold text-gray-800">{assets.label}</Text>
                    </View>
                   
                  </View>

                 
                  <View className="p-5">
                    <View className="flex-row justify-between items-start mb-2">
                       <Text className="text-lg font-bold text-gray-900 flex-1 mr-2">
                         {categoria.titulo}
                       </Text>
                       
                    </View>
                    
                    <Text className="text-gray-500 text-sm leading-5 mb-4" numberOfLines={2}>
                      {categoria.descripcion}
                    </Text>

                    <View className="flex-row items-center border-t border-gray-100 pt-4">
                     
                       
                       
                       <View className="flex-1" />
                       
                       <Text className="text-[#FF6B6B] font-bold text-sm">Ver detalles</Text>
                       <Ionicons name="arrow-forward" size={16} color="#FF6B6B" style={{marginLeft: 4}} />
                    </View>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}