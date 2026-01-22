import { FlujoEntity } from "../entities/Flujo";

export interface FlujoRepository {
  getFlujos(): Promise<FlujoEntity[]>;
  getFlujoById(id: string): Promise<FlujoEntity | null>;
}
