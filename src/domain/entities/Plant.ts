// Nuevo archivo
export interface PlanData {
  id: string;
  nombre: string;
  productoId: string;
  consumoPorUnidadKg: number;
  formula: string;
  notaTecnica: string;
}

export class PlanEntity {
  constructor(
    public readonly id: string,
    public readonly nombre: string,
    public readonly productoId: string,
    public readonly consumoPorUnidadKg: number,
    public readonly formula: string,
    public readonly notaTecnica: string
  ) {}

  // Evalúa la fórmula con el valor capturado
  calcularConsumoTotal(variables: Record<string, number>): number {
    // Reemplaza las variables en la fórmula y evalúa
    let formulaEvaluable = this.formula;
    
    for (const [nombre, valor] of Object.entries(variables)) {
      formulaEvaluable = formulaEvaluable.replace(
        new RegExp(nombre, 'g'), 
        valor.toString()
      );
    }
    
    // Evalúa la expresión matemática
    // Ejemplo: "50 * 3.5" => 175
    return Function('"use strict"; return (' + formulaEvaluable + ')')();
  }
}