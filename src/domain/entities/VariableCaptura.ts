//Nuevo archivo
export interface VariableCapturaData {
  nombre: string;
  label: string;
  tipo: string;
  minimo: number;
  maximo: number;
}

export class VariableCapturaEntity {
  constructor(
    public readonly nombre: string,
    public readonly label: string,
    public readonly tipo: string,
    public readonly minimo: number,
    public readonly maximo: number
  ) {}

  validar(valor: number): { valido: boolean; mensaje?: string } {
    if (valor < this.minimo) {
      return { valido: false, mensaje: `El valor mínimo es ${this.minimo}` };
    }
    if (valor > this.maximo) {
      return { valido: false, mensaje: `El valor máximo es ${this.maximo}` };
    }
    return { valido: true };
  }
}