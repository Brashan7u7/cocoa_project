/**
 * Generador de PDF usando el Backend API
 */
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import {
  apiService,
  GenerarCotizacionRequest,
  ClienteData,
  AccesorioInput,
} from '../../data/api/apiService';
import { CotizacionResult } from '../../domain/services/FlowEngine';
import { AccesorioEntity } from '../../domain/entities/Accesorio';

interface AccesorioSeleccionado {
  accesorio: AccesorioEntity;
  cantidad: number;
  subtotal: number;
}

/**
 * Genera y comparte el PDF de cotización usando el backend
 */
export const generateCotizacionPDFFromAPI = async (
  cotizacion: CotizacionResult,
  faseSeleccionada: string,
  tipoPlan: 'premium' | 'economico',
  accesoriosSeleccionados: AccesorioSeleccionado[] = [],
  cliente?: ClienteData,
  idEmpleado?: string,
  observaciones?: string
) => {
  try {
    // Preparar accesorios para el request
    const accesorios: AccesorioInput[] = accesoriosSeleccionados.map((acc) => ({
      accesorio_id: acc.accesorio.id,
      cantidad: acc.cantidad,
    }));

    // Crear el request
    const request: GenerarCotizacionRequest = {
      cantidad_animales: cotizacion.cantidadAnimales,
      fase: faseSeleccionada,
      tipo_plan: tipoPlan,
      accesorios,
      cliente,
      id_empleado: idEmpleado,
      observaciones,
      formato: 'pdf',
    };

    // Llamar al backend
    const response = await apiService.generarPDFBase64(request);

    if (!response.success) {
      throw new Error('Error al generar PDF');
    }

    // Guardar el PDF en el dispositivo
    const fileUri =
      FileSystem.documentDirectory + `cotizacion_${Date.now()}.pdf`;

    await FileSystem.writeAsStringAsync(fileUri, response.data.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Verificar si se puede compartir
    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Cotización - Distribuidora El Tío',
        UTI: 'com.adobe.pdf',
      });
    } else {
      console.log('Sharing no disponible en este dispositivo');
    }

    return { success: true, uri: fileUri };
  } catch (error) {
    console.error('Error generando PDF desde API:', error);
    return { success: false, error };
  }
};

/**
 * Genera y comparte el PDF como DOCX (Word) usando el backend
 */
export const generateCotizacionDOCXFromAPI = async (
  cotizacion: CotizacionResult,
  faseSeleccionada: string,
  tipoPlan: 'premium' | 'economico',
  accesoriosSeleccionados: AccesorioSeleccionado[] = [],
  cliente?: ClienteData,
  idEmpleado?: string,
  observaciones?: string
) => {
  try {
    const accesorios: AccesorioInput[] = accesoriosSeleccionados.map((acc) => ({
      accesorio_id: acc.accesorio.id,
      cantidad: acc.cantidad,
    }));

    const request: GenerarCotizacionRequest = {
      cantidad_animales: cotizacion.cantidadAnimales,
      fase: faseSeleccionada,
      tipo_plan: tipoPlan,
      accesorios,
      cliente,
      id_empleado: idEmpleado,
      observaciones,
      formato: 'docx',
    };

    const response = await apiService.generarPDFBase64(request);

    if (!response.success) {
      throw new Error('Error al generar DOCX');
    }

    const fileUri =
      FileSystem.documentDirectory + `cotizacion_${Date.now()}.docx`;

    await FileSystem.writeAsStringAsync(fileUri, response.data.base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const isAvailable = await Sharing.isAvailableAsync();

    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        dialogTitle: 'Cotización - Distribuidora El Tío',
      });
    }

    return { success: true, uri: fileUri };
  } catch (error) {
    console.error('Error generando DOCX desde API:', error);
    return { success: false, error };
  }
};
