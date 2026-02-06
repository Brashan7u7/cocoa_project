import { FlujoRepositoryImpl } from "../data/repositories/FlujoRepositoryImpl";
import { AccesorioRepositoryImpl } from "../data/repositories/AccesorioRepositoryImpl";
import { ProductoRepositoryImpl } from "../data/repositories/ProductoRepositoryImpl";

class DIContainer {
  private static instance: DIContainer;

  private _flujoRepository?: FlujoRepositoryImpl;
  private _accesorioRepository?: AccesorioRepositoryImpl;
  private _productoRepository?: ProductoRepositoryImpl;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  get flujoRepository(): FlujoRepositoryImpl {
    if (!this._flujoRepository) {
      this._flujoRepository = new FlujoRepositoryImpl();
    }
    return this._flujoRepository;
  }

  get accesorioRepository(): AccesorioRepositoryImpl {
    if (!this._accesorioRepository) {
      this._accesorioRepository = new AccesorioRepositoryImpl();
    }
    return this._accesorioRepository;
  }

  get productoRepository(): ProductoRepositoryImpl {
    if (!this._productoRepository) {
      this._productoRepository = new ProductoRepositoryImpl();
    }
    return this._productoRepository;
  }
}

export default DIContainer.getInstance();
