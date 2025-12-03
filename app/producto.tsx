import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, TouchableOpacity } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function ProductoScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // TODO: Aquí se cargará el producto recomendado basado en los filtros
  // Por ahora es un placeholder
  const producto = {
    nombre: 'Bio Nova 2',
    imagen: require('@/assets/images/icon.png'), // Placeholder
    beneficios: [
      'Alto contenido proteico',
      'Mejora la digestibilidad',
      'Fortalece el sistema inmunológico',
      'Optimiza el crecimiento',
    ],
    precio: 850,
  };

  const handleCotizar = () => {
    router.push({
      pathname: '/cotizador',
      params: {
        productoId: '1', // TODO: usar el ID real del producto
        ...params,
      },
    });
  };

  return (
    <ThemedView className="flex-1">
      <ScrollView className="flex-1 p-5">
        <ThemedView className="mb-5">
          <ThemedText type="title" className="text-center">
            Producto Recomendado
          </ThemedText>
        </ThemedView>

        <ThemedView className="bg-gray-50 rounded-xl p-5 mb-5 items-center">
          <ThemedView className="w-48 h-48 mb-5">
            <Image 
              source={producto.imagen} 
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain" 
            />
          </ThemedView>
          <ThemedText type="title" className="mb-5 text-center">
            {producto.nombre}
          </ThemedText>

          <ThemedView className="w-full mb-5">
            <ThemedText type="subtitle" className="mb-4">
              Beneficios
            </ThemedText>
            {producto.beneficios.map((beneficio, index) => (
              <ThemedView key={index} className="mb-2.5">
                <ThemedText className="text-base">• {beneficio}</ThemedText>
              </ThemedView>
            ))}
          </ThemedView>

          <ThemedView className="w-full items-center pt-5 border-t border-gray-300">
            <ThemedText className="text-base opacity-70 mb-1">
              Precio por bulto:
            </ThemedText>
            <ThemedText type="title" className="text-blue-600">
              ${producto.precio.toLocaleString()}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <TouchableOpacity className="bg-blue-600 p-4 rounded-xl items-center" onPress={handleCotizar}>
          <ThemedText type="defaultSemiBold" className="text-white text-base">
            Calcular Cotización
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

