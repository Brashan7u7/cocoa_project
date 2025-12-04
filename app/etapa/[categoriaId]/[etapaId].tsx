import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, TouchableOpacity, ActivityIndicator, TextInput, KeyboardAvoidingView, Platform, Linking, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ProgressStepper } from '../../../src/presentation/components/ui/ProgressStepper';
import { EtapaEntity } from '../../../src/domain/entities/Etapa';
import { CotizacionResult } from '../../../src/domain/usecases/CalcularCotizacionUseCase';
import { generateCotizacionPDF } from '../../../src/presentation/utils/pdfGenerator';
import DIContainer from '../../../src/di/container';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

export default function ProductoScreen() {
  const router = useRouter();
  const { categoriaId, etapaId } = useLocalSearchParams();
  const [etapa, setEtapa] = useState<EtapaEntity | null>(null);
  const [categoriaTitle, setCategoriaTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [cantidadCerdos, setCantidadCerdos] = useState('');
  const [cotizacion, setCotizacion] = useState<CotizacionResult | null>(null);
  const [error, setError] = useState('');
  const [generatingPDF, setGeneratingPDF] = useState(false);

  useEffect(() => {
    loadEtapa();
  }, [categoriaId, etapaId]);

  const loadEtapa = async () => {
    try {
      const categoria = await DIContainer.getCategoriaByIdUseCase.execute(categoriaId as string);
      const etapaFound = categoria?.getEtapaById(etapaId as string);
      setEtapa(etapaFound || null);
      setCategoriaTitle(categoria?.titulo || '');
    } catch (error) {
      console.error('Error loading etapa:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCalcular = () => {
    setError('');
    const cantidad = parseInt(cantidadCerdos);

    if (isNaN(cantidad) || cantidad <= 0) {
      setError('Por favor ingresa una cantidad válida');
      return;
    }

    if (!etapa) return;

    try {
      const result = DIContainer.calcularCotizacionUseCase.execute(
        etapa.productoRecomendado,
        cantidad
      );
      setCotizacion(result);
    } catch (err) {
      setError('Error al calcular la cotización');
    }
  };

 const handleWhatsApp = () => {
    if (!cotizacion) return;

   
    const numeroWhatsApp = '529513592520';

    const mensaje = `Hola! Me interesa cotizar:\n\n` +
      `🐷 Producto: ${cotizacion.producto.nombre}\n` +
      `📦 Cantidad de cerdos: ${cotizacion.cantidadCerdos}\n` +
      `📊 Bultos necesarios: ${cotizacion.bultosNecesarios}\n` +
      `💰 Total estimado: $${cotizacion.costoTotal.toFixed(2)} MXN`;

  
    const url = `whatsapp://send?phone=${numeroWhatsApp}&text=${encodeURIComponent(mensaje)}`;
    
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'No se pudo abrir WhatsApp. Asegúrate de tener la app instalada.');
    });
  };
  const handleGeneratePDF = async () => {
    if (!cotizacion || !etapa) return;

    setGeneratingPDF(true);
    
    try {
      const result = await generateCotizacionPDF(
        cotizacion,
        categoriaTitle,
        etapa.titulo
      );

      if (result.success) {
        Alert.alert(
          'PDF Generado',
          'La cotización se ha generado exitosamente.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Error',
          'No se pudo generar el PDF. Por favor intenta de nuevo.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      Alert.alert(
        'Error',
        'Ocurrió un error al generar el PDF.',
        [{ text: 'OK' }]
      );
    } finally {
      setGeneratingPDF(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#FF6B6B" />
      </View>
    );
  }

  if (!etapa) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-4">
        <Ionicons name="alert-circle-outline" size={48} color="#9CA3AF" />
        <Text className="text-lg text-gray-600 text-center mt-4">
          Etapa no encontrada
        </Text>
        <TouchableOpacity onPress={() => router.back()} className="mt-6 bg-gray-900 px-6 py-3 rounded-full">
            <Text className="text-white font-bold">Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const producto = etapa.productoRecomendado;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1 bg-white"
    >
      <StatusBar style="dark" />
      
     
      <SafeAreaView className="bg-white">
        <View className="px-6 pt-4 pb-2">
            <View className="flex-row justify-between items-start mb-4">
                <TouchableOpacity
                onPress={() => router.back()}
                className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center"
                >
                 <Ionicons name="arrow-back" size={24} color="#111827" />
                </TouchableOpacity>

               
            </View>
            
            <View>
                <Text className="text-gray-500 text-sm font-bold uppercase mb-1">{categoriaTitle}</Text>
                <Text className="text-gray-900 text-3xl font-extrabold leading-8">
                    {producto.nombre}
                </Text>
            </View>
        </View>
      </SafeAreaView>

     
      <View className="flex-1 bg-white">
        <ScrollView className="flex-1 px-6 pt-4" showsVerticalScrollIndicator={false}>
          
          <View className="mb-6">
             <ProgressStepper currentStep={2} totalSteps={2} />
          </View>

          <View className="flex-row justify-between mb-6 bg-gray-50 p-4 rounded-2xl border border-gray-100">
             <View className="items-center flex-1 border-r border-gray-200">
                <Ionicons name="cube-outline" size={20} color="#4F46E5" />
                <Text className="text-gray-400 text-[10px] mt-1 font-bold uppercase">Presentación</Text>
                <Text className="text-gray-900 font-bold">{producto.presentacionKg} kg</Text>
             </View>
             <View className="items-center flex-1 border-r border-gray-200">
                <Ionicons name="wallet-outline" size={20} color="#10B981" />
                <Text className="text-gray-400 text-[10px] mt-1 font-bold uppercase">Precio</Text>
                <Text className="text-gray-900 font-bold">${producto.precioBulto}</Text>
             </View>
             <View className="items-center flex-1">
                <Ionicons name="restaurant-outline" size={20} color="#F59E0B" />
                <Text className="text-gray-400 text-[10px] mt-1 font-bold uppercase">Consumo</Text>
                <Text className="text-gray-900 font-bold">{producto.consumoTotalFaseKg} kg</Text>
             </View>
          </View>

          <View className="mb-6">
            <Text className="text-gray-900 font-bold text-lg mb-2">Descripción</Text>
            <Text className="text-gray-500 leading-6">{producto.descripcion}</Text>
            
            <View className="mt-3 bg-blue-50 p-3 rounded-xl border border-blue-100 flex-row gap-2">
                <Ionicons name="information-circle" size={20} color="#3B82F6" />
                <Text className="text-blue-700 text-xs flex-1 leading-5">{producto.notaTecnica}</Text>
            </View>
          </View>

          <View className="mb-8">
             <Text className="text-gray-900 font-bold text-xl mb-4">Calculadora</Text>
             
             <View className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
                <Text className="text-gray-600 font-medium mb-3">¿Cuántos cerdos tienes?</Text>
                
                <View className="flex-row gap-3 mb-2">
                    <View className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 flex-row items-center">
                        <Ionicons name="calculator-outline" size={20} color="#9CA3AF" />
                        <TextInput 
                            className="flex-1 ml-3 text-lg font-semibold text-gray-900"
                            placeholder="0"
                            keyboardType="numeric"
                            value={cantidadCerdos}
                            onChangeText={setCantidadCerdos}
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>
                    <TouchableOpacity 
                        onPress={handleCalcular}
                        className="bg-[#4F46E5] rounded-xl px-6 justify-center items-center shadow-md shadow-indigo-200"
                    >
                        <Ionicons name="arrow-forward" size={24} color="white" />
                    </TouchableOpacity>
                </View>
                
                {error ? (
                    <Text className="text-red-500 text-xs mt-1 font-medium">{error}</Text>
                ) : (
                    <Text className="text-gray-400 text-xs mt-1">Ingresa la cantidad para ver costos.</Text>
                )}
             </View>
          </View>

          {cotizacion && (
            <View className="mb-10 bg-gray-800 rounded-3xl p-6 shadow-xl shadow-gray-400">
               <View className="flex-row justify-between items-center mb-6">
                  <View>
                     <Text className="text-gray-400 text-xs font-bold uppercase mb-1">Costo Estimado</Text>
                     <Text className="text-white text-3xl font-extrabold">{formatCurrency(cotizacion.costoTotal)}</Text>
                  </View>
                  <View className="bg-white/10 p-3 rounded-full">
                     <Ionicons name="cash-outline" size={24} color="#34D399" />
                  </View>
               </View>

               <View className="bg-gray-800 rounded-xl p-4 mb-6 space-y-3">
                  <View className="flex-row justify-between">
                     <Text className="text-gray-400">Bultos requeridos</Text>
                     <Text className="text-white font-bold">{cotizacion.bultosNecesarios} pzas</Text>
                  </View>
                  <View className="h-[1px] bg-gray-700 w-full my-1" />
                  <View className="flex-row justify-between">
                     <Text className="text-gray-400">Total Alimento</Text>
                     <Text className="text-white font-bold">{cotizacion.kilogramosNecesarios.toFixed(1)} kg</Text>
                  </View>
                  <View className="h-[1px] bg-gray-700 w-full my-1" />
                  <View className="flex-row justify-between">
                     <Text className="text-gray-400">Costo por animal</Text>
                     <Text className="text-white font-bold">{formatCurrency(cotizacion.costoPorCerdo)}</Text>
                  </View>
               </View>

               <View className="flex-row gap-3">
                  <TouchableOpacity 
                    onPress={handleWhatsApp}
                    className="flex-1 bg-[#25D366] py-3 rounded-xl flex-row justify-center items-center"
                  >
                     <Ionicons name="logo-whatsapp" size={20} color="white" />
                     <Text className="text-white font-bold ml-2">Pedir</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={handleGeneratePDF}
                    disabled={generatingPDF}
                    className="flex-1 bg-white py-3 rounded-xl flex-row justify-center items-center"
                  >
                     {generatingPDF ? (
                        <ActivityIndicator size="small" color="#111827" />
                     ) : (
                        <>
                            <Ionicons name="document-text-outline" size={20} color="#111827" />
                            <Text className="text-gray-900 font-bold ml-2">PDF</Text>
                        </>
                     )}
                  </TouchableOpacity>
               </View>
            </View>
          )}

          <View className="h-6" />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}