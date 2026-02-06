/**
 * Exporta el DataSource correcto según la configuración
 */

import { USE_API_BACKEND, getApiUrl } from '../../config/dataSource.config';
import { LocalDataSource } from './LocalDataSource';
import { ApiDataSource } from './ApiDataSource';

// Tipo unificado para ambos datasources
export type DataSource = LocalDataSource | ApiDataSource;

// Crear instancia según configuración
let dataSourceInstance: DataSource;

if (USE_API_BACKEND) {
  const apiDataSource = new ApiDataSource();
  apiDataSource.setBaseUrl(getApiUrl());
  dataSourceInstance = apiDataSource;
  console.log('📡 Usando API Backend:', getApiUrl());
} else {
  dataSourceInstance = new LocalDataSource();
  console.log('💾 Usando datos locales');
}

export const dataSource = dataSourceInstance;

// Re-exportar clases individuales por si se necesitan
export { LocalDataSource } from './LocalDataSource';
export { ApiDataSource } from './ApiDataSource';
