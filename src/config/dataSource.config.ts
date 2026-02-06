/**
 * Configuración del DataSource
 *
 * Cambia USE_API_BACKEND a true para usar el backend
 * Cambia a false para usar datos locales (offline)
 */

// ============ CONFIGURACIÓN PRINCIPAL ============

// true = usa el backend API
// false = usa datos locales (LocalDataSource)
export const USE_API_BACKEND = true;

// URL del backend
// Para emulador Android: 'http://10.0.2.2:3000/api'
// Para emulador iOS: 'http://localhost:3000/api'
// Para dispositivo físico: 'http://TU_IP:3000/api' (ej: 'http://192.168.1.100:3000/api')
export const API_BASE_URL = "http://10.0.2.2:3000/api";

// ============ HELPER PARA OBTENER LA URL CORRECTA ============

import { Platform } from "react-native";

export const getApiUrl = (): string => {
  if (Platform.OS === "android") {
    // Emulador Android usa 10.0.2.2 para acceder al localhost de la máquina host
    return "http://10.0.2.2:3000/api";
  } else if (Platform.OS === "ios") {
    // Emulador iOS puede usar localhost directamente
    return "http://localhost:3000/api";
  }
  // Web o dispositivo físico - usar IP de la máquina
  return API_BASE_URL;
};
