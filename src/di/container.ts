
import { LocalDataSource } from '../data/datasources/LocalDataSource';
import { CategoriaRepositoryImpl } from '../data/repositories/CategoriaRepositoryImpl';
import { GetCategoriasUseCase } from '../domain/usecases/GetCategoriasUseCase';
import { GetCategoriaByIdUseCase } from '../domain/usecases/GetCategoriaByIdUseCase';
import { CalcularCotizacionUseCase } from '../domain/usecases/CalcularCotizacionUseCase';

class DIContainer {
  private static instance: DIContainer;


  private _localDataSource?: LocalDataSource;


  private _categoriaRepository?: CategoriaRepositoryImpl;


  private _getCategoriasUseCase?: GetCategoriasUseCase;
  private _getCategoriaByIdUseCase?: GetCategoriaByIdUseCase;
  private _calcularCotizacionUseCase?: CalcularCotizacionUseCase;

  private constructor() {}

  static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }


  get localDataSource(): LocalDataSource {
    if (!this._localDataSource) {
      this._localDataSource = new LocalDataSource();
    }
    return this._localDataSource;
  }


  get categoriaRepository(): CategoriaRepositoryImpl {
    if (!this._categoriaRepository) {
      this._categoriaRepository = new CategoriaRepositoryImpl(this.localDataSource);
    }
    return this._categoriaRepository;
  }


  get getCategoriasUseCase(): GetCategoriasUseCase {
    if (!this._getCategoriasUseCase) {
      this._getCategoriasUseCase = new GetCategoriasUseCase(this.categoriaRepository);
    }
    return this._getCategoriasUseCase;
  }

  get getCategoriaByIdUseCase(): GetCategoriaByIdUseCase {
    if (!this._getCategoriaByIdUseCase) {
      this._getCategoriaByIdUseCase = new GetCategoriaByIdUseCase(this.categoriaRepository);
    }
    return this._getCategoriaByIdUseCase;
  }

  get calcularCotizacionUseCase(): CalcularCotizacionUseCase {
    if (!this._calcularCotizacionUseCase) {
      this._calcularCotizacionUseCase = new CalcularCotizacionUseCase();
    }
    return this._calcularCotizacionUseCase;
  }
}

export default DIContainer.getInstance();